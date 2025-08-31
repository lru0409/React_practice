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

<br>

## koa-router 사용하기

### 기본 사용법

- `yarn add koa-router`
- `rounter.get`의 첫 번째 파라미터에는 라우트의 경로, 두 번째 파라미터에는 해당 라우트에서 사용할 미들웨어 함수를 넣음
- `get`은 해당 라우트에 사용할 HTTP 메서드를 의미함
    - `post`, `put`, `delete` 등을 넣을 수 있음

```jsx
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

router.get('/', ctx => {
  ctx.body = '홈';
});

router.get('/about', ctx => {
  ctx.body = '소개';
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
  console.log('Listening to port 4000');
});
```

### 라우트 파라미터와 쿼리

- 파라미터는 `/about/:name` 형식으로 콜론(:) 사용
    - 파라미터가 있을 수도 있고 없을 수도 있다면 `/about/:name?` 처럼 파라미터 이름 뒤에 물음표 사용
    - 파라미터 값을 `ctx.params`에서 조회 가능
- 쿼리는 `/posts/?id=10` 같은 형식으로 요청했다면 해당 값을 `ctx.query`에서 조회 가능

```jsx
router.get('/about', ctx => {
  ctx.body = '소개';
});

router.get('/about/:name', ctx => {
  const { name } = ctx.params;
  ctx.body = `${name}의 소개`;
});

router.get('/posts', ctx => {
  const { id } = ctx.query;
  ctx.body = id ? `포스트 #${id}` : '포스트 아이디가 없습니다.';
});
```

> **파라미터와 쿼리**
> - 파라미터: 처리할 작업의 카테고리를 받아오거나, 고유 ID 혹은 이름으로 특정 데이터를 조회할 때 사용
> - 쿼리: 옵션에 관련된 정보를 받아올 때 사용
>    - 예를 들어 여러 항목을 리스팅하는 API라면, 어떤 조건을 만족하는 항목을 보여 줄지 또는 어떤 기준으로 정렬할지를 정해야 할 때 사용

### **REST API**

- 웹 브라우저에서 데이터베이스에 직접 접속해 데이터를 변경하면 보안상 문제가 되므로, REST API를 만들어 사용함
- 클라이언트가 서버에 데이터 조회, 생성, 삭제, 업데이트 요청 → 서버가 필요한 로직에 따라 데이터베이스에 접근해 작업 처리
- **HTTP 메서드 종류**
    - `GET`: 데이터 조회
    - `POST`: 데이터 등록 (인증 작업 시에도 활용)
    - `DELETE`: 데이터 삭제
    - `PUT`: 데이터를 새 정보로 통째로 교체
    - `PATCH`: 데이터의 특정 필드를 수정
- 라우트에서 `route.get(…)`은 GET 요청을 받는 경우, `route.post(…)`는 POST 요청을 받는 경우

### 라우트 모듈화

- 각 라우트를 index.js 파일에 모두 작성하면, 코드가 길어지고 유지보수가 어려워짐 → 라우터를 여러 파일에 분리시켜 작성해야 함

```jsx
// src/api/index.js
const Router = require('@koa/router');

const api = new Router();

api.get('/test', (ctx) => {
  ctx.body = 'test 성공';
});

module.exports = api;
```

```jsx
// src/index.js
const api = require('./api');

router.use('/api', api.routes());

app.use(router.routes()).use(router.allowedMethods());
```

### 컨트롤러 파일 작성

- 라우트 처리 함수들을 컨트롤러 파일에 분리해 관리함
- `koa-bodyparser` 미들웨어를 적용해야 POST/PUT/PATCH 같은 메서드의 Request Body에 JSON 형식으로 들어온 데이터를 서버에서 파싱해서 사용할 수 있음
    - `yarn add koa-bodyparser`
    
    ```jsx
    const bodyParser = require('koa-bodyparser');
    
    app.use(bodyParser());
    
    app.use(router.routes()).use(router.allowedMethods());
    ```