# 23장. JWT를 통한 회원 인증 시스템 구현하기

## JWT의 이해

- JSON Web Token, 데이터가 JSON으로 이루어져 있는 토큰
- 두 개체가 서로 안전하게 정보를 주고받을 수 있도록 웹 표준으로 정의된 기술

### 세션 기반 인증과 토큰 기반 인증의 차이

- **세션 기반 인증 시스템**
    - 서버가 사용자가 로그인 중임을 기억하는 방식
    - 과정
        1. 사용자가 로그인을 하면, 서버는 세션 저장소에 세션을 생성하고 세션 id 발급
        2. 클라이언트는 발급된 id를 브라우저의 쿠키에 저장
        3. 사용자가 요청을 보낼 때마다 서버는 세션 저장소에서 세션 조회 후 로그인 여부를 알아냄
    - 세션 저장소는 주로 메모리, 디스크, 데이터베이스 등을 사용
    - 서버를 확장하기 번거로움 → 모든 서버끼리 같은 세션을 공유해야 하므로 세션 전용 데이터베이스 필요
- **토큰 기반 인증 시스템**
    - 토큰 : 로그인 이후 서버가 만들어주는 문자열
        - 토큰에는 사용자의 로그인 정보와 해당 정보가 서버에서 발급되었음을 증명하는 서명이 들어 있음
        - 서명 데이터는 HMAC SHA256, RSA SHA256 같은 해싱 알고리즘을 통해 만들어짐
        - 서명을 통해 무결성(정보가 변경되거나 위조되지 않았음을 의미하는 성질)이 보장됨
    - 과정
        - 사용자가 로그인을 하면 서버가 사용자에게 토큰을 발급
        - 사용자가 요청을 보낼 때 발급받은 토큰과 함께 요청하게 됨
        - 서버는 해당 토큰이 유효한지 검사하고, 결과에 따라 작업을 처리하고 응답
    - 서버에서 사용자 로그인 정보를 기억하기 위해 사용되는 리소스가 적음 → 서버의 확장성 높음

<br>

## User 스키마/모델 만들기

- 사용자 스키마에는 사용자 계정명과 비밀번호가 필요함
- 비밀번호를 데이터베이스에 저장하면 플레인(아무런 가공도 하지 않은) 텍스트로 저장하면 보안 상 매우 위험
- 단방향 해싱 함수를 지원하는 `bcrypt` 라이브러리를 사용하자
    - `yarn add bcypt`

```jsx
// UserSchema
const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});
```

### 모델 메서드 만들기

모델 메서드란 모델에서 사용할 수 있는 함수로 두 가지 종류가 있다.

1. **인스턴스 메서드** : 모델을 통해 만든 문서 인스턴스에서 사용할 수 있는 함수
    
    ```jsx
    import bcrypt from 'bcrypt';
    
    UserSchema.methods.setPassword = async function (password) {
      const hash = await bcrypt.hash(password, 10);
      this.hashedPassword = hash;
    };
    
    UserSchema.methods.checkPassword = async function (password) {
      const result = await bcrypt.compare(password, this.hashedPassword);
      return result;
    };
    ```
    
    - 계정의 `hashedPassword` 값을 설정해주는 `setPassword` 메서드 작성
    - 해당 계정의 비밀번호와 일치하는지 검증하는 `checkPassword` 메서드 작성
    - 인스턴스 메서드 작성 시 화살표 함수가 아닌 function 키워드를 사용해 구현해야 함
        - 함수 내부에서 `this`로 문서 인스턴스에 접근해야 하기 때문
2. **스태틱 메서드** : 모델에서 바로 사용할 수 있는 함수
    
    ```jsx
    UserSchema.statics.findByUsername = async function (username) {
      return this.findOne({ username });
    }
    ```
    
    - username으로 데이터를 찾을 수 있게 해주는 `findByUsername` 메서드 작성
    - 스태틱 함수에서 `this`는 모델을 가리킴

<br>

## 회원 인증 API 만들기

- auth.ctrl.js에 네 개의 API 작성
    - register(회원가입), login, check(로그인 여부 확인), logout

### 회원가입 구현하기

- 기존에 동일한 `username`이 존재하는지 확인하기 위해 `findByUsername` 스태틱 메서드 사용
- 비밀번호를 설정할 때는 (암호화시켜 저장하기 위해) `setPassword` 인스턴스 메서드 사용
- 스태틱, 인스턴스 함수의 작업을 API 함수 내부에 직접 구현해도 상관없지만, 이렇게 메서드들을 만들어 사용하면 → 가독성, 유지보수성 향상
- 반환을 위해 데이터를 JSON으로 반환한 뒤 `hashedPassword` 필드를 지우는 작업을 serialize 인스턴스 함수로 따로 만들자
    
    ```jsx
    UserSchema.methods.serialize = function () {
      const data = this.toJSON();
      delete data.hashedPassword;
      return data;
    }
    ```

### 로그인 구현하기

- 사용자 데이터를 찾기 위해 `findByUsername` 스태틱 메서드 사용
- 비밀번호 검사를 위해 `checkPassword` 인스턴스 메서드 사용

<br>

## 토큰 발급 및 검증하기

- JWT 토큰을 만들기 위해서 `jsonwebtoken` 모듈 설치
    - `yarn add jsonwebtoken`

### 비밀키 설정하기

- JWT 토큰을 만들 때 사용할 비밀키를 만들어 `.env` 파일에 `JWT_SECRET` 값으로 설정
- 이 비밀키는 문자열로 아무거나 입력하면 됨
- macOS/리눅스를 사용한다면 `openssl rand -hex 64` 명령으로 랜덤 문자열 생성 가능
- 이 비밀키는 외부에 공개되면 절대 안 됨 → 비밀키가 공개되면 누구든 JWT 토큰 발급이 가능해짐

### 토큰 발급하기

- 토큰을 발급하는 `generateToken` 인스턴스 메서드 구현
    
    ```jsx
    UserSchema.methods.generateToken = function () {
      const token = jwt.sign(
        // 첫 번째 파라미터로는 토큰 안에 집어넣고 싶은 데이터 전달
        {
          _id: this._id,
          username: this.username,
        },
        process.env.JWT_SECRET, // 두 번째 파라미터로는 JWT 암호 전달
        {
          expiresIn: '7d', // 7일 동안 유효함
        },
      );
      return token;
    };
    ```
    
- 사용자가 브라우저에서 토큰을 두 가지 방법으로 저장할 수 있다.
    1. localStorage, sessionStorage → XSS 공격 위험
    2. 쿠키 → httpOnly 속성을 통해 XSS 공격 방어 가능, CSRF 공격 위험
    
    → 쿠키를 사용해보자.
    
    ```jsx
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
        httpOnly: true,
    });
    ```
    

### 토큰 검증하기

- 사용자의 토큰을 확인한 후 검증하는 작업을 미들웨어를 통해 처리
- 이 미들웨어를 적용하는 작업은 `app`에 `router` 미들웨어를 적용하기 전에 이루어져야 함
- 해석된 토큰 정보를 `ctx.state.user`에 저장해두고, `check` api에서 로그인 여부를 알아내기 위해 사용

```jsx
const jwtMiddleware = (ctx, next) => {
  const token = ctx.cookies.get('access_token');
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = { // 해석된 토큰 정보를 ctx.state.user에 저장
      _id: decoded._id,
      username: decoded.username,
    };
    console.log(decoded);
    return next();
  } catch (e) {
    // 토큰 검증 실패
    return next();
  }
};
```

### 토큰 재발급하기

- 해석된 토큰에서 `iat`는 이 토큰이 언제 만들어졌는지, `exp`는 언제 만료되는지를 각각 알려줌
- exp에 표현된 날짜가 3.5일 미만이라면 토큰을 새로운 토큰으로 재발급해주는 기능 구현

```jsx
// jwtMiddleware에 로직 추가
const now = Math.floor(Date.now() / 1000);
if (decoded.exp - now < 60 * 60 * 24 * 3.5) {
    const user = await User.findById(decoded._id);
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    httpOnly: true,
    });
}
```