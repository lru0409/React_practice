# 21장. 백엔드 프로그래밍: Node.js의 Koa 프레임워크

> **백엔드**
- 데이터를 여러 사람과 공유하기 위해 서버가 필요함
- 서버에 데이터를 담을 때는 여러 가지 규칙이 필요함
    - 특정 데이터를 등록할 때 사용자 인증 정보가 필요할 수도 있고, 등록할 데이터를 어떻게 검증할지, 데이터의 종류를 어떻게 구분할지 등을 고려해야 함
    - 데이터를 조회할 때는 어떤 종류의 데이터를 몇 개씩 보여줄지, 어떻게 보여줄지에 관한 로직이 필요함 → 서버 프로그래밍 또는 백엔드 프로그래밍을 통해 이를 구현
- PHP, 파이썬, Golang, 자바, 자바스크립트, 루비 등 다양한 언어로 구현 가능
    - 그중 자바스크립트로 서버를 구현할 수 있는 Node.js를 사용해보자

> **Node.js**
- 처음에는 자바스크립트를 웹 브라우저에서만 사용할 수 있었음
- 구글이 크롬 웹 브라우저를 소개하며 V8 자바스크립트 엔진 공개 → 이 엔진을 기반으로 **서버에서도 자바스크립트를 사용할 수 있는 런타임 Node.js** 개발

> **Koa**
- Node.js 환경에서 웹 서버 구축 시 보통 Express, Hapi, Koa 등의 프레임워크 사용
- Koa는 Express의 기존 개발 팀이 개발한 프레임워크 → 기존 Express에서 고치고 싶었던 점들을 개선하며 아예 새로운 프레임워크 개발
- Express는 미들웨어, 라우팅, 템플릿, 파일 호스팅 등과 같은 다양한 기능 자체적으로 내장하는 반면, Koa는 미들웨어 기능만 갖추고 있으며 나머지를 다른 라이브러리를 적용해 사용 → **Koa는 필요한 기능들만 붙여 서버를 만들 수 있기 때문에 훨씬 가벼움**
- async/await 문법을 정식으로 지원해 비동기 작업을 편하게 관리 가능

<br/>

## Koa 기본 사용법

### 미들웨어

- Koa 애플리케이션은 미들웨어의 배열로 구성됨
- `app.use` 함수는 미들웨어 함수를 애플리케이션에 등록함
- 미들웨어 함수의 구조 : `(ctx, next) => {}`
    - `ctx` : Context의 줄임말, **웹 요청과 응답에 대한 정보**를 지니고 있음
    - `next` : 현재 처리 중인 미들웨어의 **다음 미들웨어를 호출하는 함수**
        - 이 기능을 활용하면 조건부로 다음 미들웨어 처리를 무시하도록 만들 수 있음
        - `Promise`를 반환 → 이 `Promise`는 다음에 처리해야 할 미들웨어가 끝나야 완료됨
- 미들웨어는 `app.use`를 사용하여 등록되는 순서대로 처리됨

```jsx
const Koa = require('koa');

const app = new Koa();

app.use(async (ctx, next) => {
  if (ctx.query.authorized !== '1') {
    ctx.status = 401;
    return;
  }
  await next();
  console.log('END');
});

app.use((ctx) => {
  ctx.body = 'hello world';
});

app.listen(4000, () => {
  console.log('Listening to port 4000');
});
```

<br/>

## nodemon 사용하기

nodemon은 **코드를 변경할 때마다 서버를 자동으로 재시작**해 줌

- nodemon을 개발용 의존 모듈로 설치 : `yarn add --dev nodemon`
- `package.json`에 `scripts` 추가
    
    ```jsx
    "scripts": {
    	"start": "node src",
    	"start:dev": "nodemon --watch src/ src/index.js"
    }
    ```
    
- 이제부터는 다음 명령어를 사용하여 서버 시작
    
    ```bash
    yarn start # 재시작이 필요 없을 때
    yarn start:dev # 재시작이 필요할 때
    ```