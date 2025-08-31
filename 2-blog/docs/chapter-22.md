# 22장. mongoose를 이용한 MongoDB 연동 실습

## 소개하기

- MySQL, OracleDB, PostgreSQL 같은 **RDBMS**(관계형 데이터베이스)가 가지는 한계
    1. 데이터 스키마가 고정적임 → 데이터 양이 많을 때는 스키마를 변경하는 작업이 번거로움
    2. 데이터 양이 늘어나면 여러 컴퓨터에 분산시키는 것이 아니라, 해당 데이터베이스의 성능을 업그레이드하는 방식으로 확장해 주어야 함
- **MongoDB**는 RDBMS의 이러한 한계를 극복한 문서 지향적 **NoSQL 데이터베이스**임
    - 데이터들은 유동적인 스키마를 지닐 수 있음
    - 데이터 양이 늘어나도 여러 컴퓨터로 분산하여 처리할 수 있도록 확장하기 쉽게 설계됨
    - 조금만 배워도 유용하게 활용할 수 있는 MongoDB를 사용해보자
- 다만 상황별로 적합한 데이터베이스가 다름
    - 데이터의 구조가 자주 바뀐다면 → MongoDB
    - 까다로운 조건으로 데이터를 필터링하거나, ACID 특정을 지켜야 한다면 → RDBMS

> **ACID 특성**
>
> 데이터베이스 트랜잭션이 안전하게 처리되는 것을 보장하기 위한 성질
> - **원자성(Atomicity)**
>    - 트랜잭션 안의 작업이 모두 성공하거나, 모두 실패해야 함
>    - 예: 은행 이체 → 내 계좌에서 돈 빠지고, 상대 계좌에 돈 들어가고 → 둘 중 하나라도 실패하면 전체 취소
> - **일관성(Consistency)**
>    - 트랜잭션 전후로 데이터가 항상 유효한 상태를 유지해야 함
    - 예: 통장 잔고가 음수가 되면 안 된다 → 규칙 위반 시 트랜잭션 자체가 실패
>- **고립성(Isolation)**
>    - 동시에 여러 트랜잭션이 실행돼도, 각각이 독립적으로 실행된 것처럼 보장해야 함
>    - 예: 내가 송금하는 동안 다른 사람이 내 잔고를 조회하면, 최종 결과만 보이도록 보장
>- **지속성(Durability)**
>    - 트랜잭션이 성공적으로 완료되면, 결과는 시스템이 고장나도 영구적으로 저장되어야 함
>    - 예: 은행 서버가 꺼졌다가 켜져도 송금 기록은 남아 있어야 함
</aside>

### 문서(document)

- RDBMS의 레코드(record)와 비슷한 개념
- 문서의 데이터 구조는 한 개 이상의 키-값 쌍으로 구성됨
- 문서는 BSON(바이너리 형태의 JSON) 형태로 저장되기 때문에 JSON 형태의 객체를 데이터베이스에 저장할 때, 큰 공수를 들이지 않고도 가능
- 자동 생성되는 `_id` 값은 시간, 머신 아이디, 프로세스 아이디, 순차 번호로 되어 있어 값의 고유함을 보장
- MongoDB에서는 한 컬렉션(문서들의 집합)에 서로 스키마가 다른 문서들이 공존할 수 있음

```jsx
{
	"_id": ObjectId("594948a081ad6e0ea526f3f5"),
	"username": "velopert"
},
{
	"_id": ObjectId("594948a081ad6e0ea526f3f6"),
	"username": "velopert2",
	"phone": "010-1234-1234"
},
```

### MongoDB 구조

- 서버 하나에 데이터베이스를 여러 개 가지고 있을 수 있음
- 각 데이터베이스에는 여러 개의 컬렉션이 있으며, 컬렉션 내부에는 문서들이 있음

![MongoDB 구조](https://github.com/user-attachments/assets/30ec2e74-c93a-46aa-bf98-c5cd196b2c94)

### 스키마 디자인

- RDBMS에서 블로그용 데이터 스키마를 설계한다면 각 포스트, 댓글마다 테이블을 만들어 필요에 따라 JOIN해서 사용하는 것이 일반적
- 반면 NoSQL에서는 모든 것을 문서 하나에 넣음 (댓글도 포스트 문서 내부에 넣음)

```jsx
{
	_id: ObjectId,
	title: String,
	body: String,
	username: String,
	createdDate: Date,
	comments: [
		{
			_id: ObjectId,
			text: String,
			createdDate: Date,
		},
	],
};
```

- 문서 내부에 위치한 또 다른 문서를 **서브다큐먼트(subdocument)**라고 함
    - 서브다큐먼트 또한 일반 문서를 다루는 것처럼 쿼리 가능
    - 문서 하나에는 최대 16MB만큼 데이터를 넣을 수 있음 → 이 용량을 초과할 가능성이 있다면 컬렉션을 분리시키는 것이 좋음

<br>

## MongoDB 서버 준비

### 설치

macOS에서는 Homebrew를 이용해 간편하게 설치 가능

```jsx
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### 작동 확인

- `mongosh` 명령을 입력하면 터미널 기반 MongoDB 클라이언트가 실행됨
    - 이 명령을 통해 MongoDB가 성공적으로 설치되었고 제대로 가동 중인지 확인 가능
    - 설치 안 되어 있다면 설치 → `brew install mongosh`
- 여기서 `version()`이라는 명령어를 입력해보자

<br>

## mongoose의 설치 및 적용

- **mongoose**는 Node.js 환경에서 사용하는 MongoDB 기반 ODM(Object Data Modelling) 라이브러리
    - 데이터베이스 문서들을 자바스크립트 객체처럼 사용할 수 있게 해줌
- **dotenv**은 환경변수들을 파일에 넣고 사용할 수 있게 하는 개발 도구
    - mongoose를 사용해 MongoDB에 접속할 때 필요한 주소, 계정 및 비밀번호 정보를 코드 안에 직접 작성하는 대신 환경변수로 설정하는 것이 좋음
- `yarn add mongoose dotenv`

### .env 환경변수 파일 생성

```jsx
// .env
PORT=4000
MONGO_URI=mongodb://localhost:27017/blog
```

```jsx
// src/index.js
require('dotenv').config();

const { PORT } = process.env;

const port = PORT || 4000;
app.listen(port, () => {
  console.log('Listening to port %d', port);
});
```

### mongoose로 서버와 데이터베이스 연결

```jsx
// src/index.js
const mongoose = require('mongoose');

const { PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((e) => {
    console.error(e);
  });
```

> **CommonJS 대신 ESM 방법 사용**

<br>

## 데이터베이스의 스키마와 모델

- **스키마** : 컬렉션에 들어가는 문서 내부의 각 필드가 어떤 형식으로 되어 있는지 정의하는 객체
- **모델** : 스키마를 사용하여 만드는 인스턴스
    - 데이터베이스에서 실제 작업을 처리할 수 있는 함수들을 지니고 있는 객체

### 스키마 생성

- mongoose 모듈의 `Schema`를 사용해 정의

```jsx
import mongoose from 'mongoose';

const { Schema } = mongoose;

const AuthorSchema = new Schema({
  name: String,
  email: String,
});
const BookSchema = new Schema({
  title: String,
  description: String,
  authors: [AuthorSchema],
  meta: {
    likes: Number,
  },
  extra: Schema.Types.Mixed,
});
```

> **Schema에서 지원하는 타입**
> - String
> - Number
> - Date
> - Buffer : 파일을 담을 수 있는 버퍼
> - Boolean
> - Mixed(Schema.Types.Mixed) : 어떤 데이터도 넣을 수 있는 형식
> - ObjectId(Schema.Types.ObjectId) : 객체 아이디, 주로 다른 객체 참조 시 사용
> - Array : 배열 형태의 값, []로 감싸서 사용

### 모델 생성

- `mongoose.model` 함수 사용
- 스키마 이름을 첫 번째 파라미터, 스키마 객체를 두 번째 파라미터로 전달
- 데이터베이스는 스키마 이름을 정해주면, 그 이름의 복수 형태로 데이터베이스에 컬렉션 이름을 만듦
    - `Book`(스키마 이름) → `books`(컬렉션 이름)
    - 이 컨벤션을 따르고 싶지 않다면, 세 번째 파라미터로 원하는 컬렉션 이름 전달

```jsx
const Book = mongoose.model('Book', BookSchema);
```

<br>

## MongoDB Compass의 설치 및 사용

- MongoDB Compass는 MongoDB를 위한 GUI 프로그램
    - 데이터베이스를 쉽게 조회 및 수정 가능
- https://www.mongodb.com/download-center/compass에서 다운로드

<br>

## 데이터 생성과 조회

### 데이터 생성

- 포스트의 인스턴스를 만들 때는 `new` 키워드 사용
- `save()` 함수를 실행시켜 데이터베이스에 저장

```jsx
export const write = async (ctx) => {
  const { title, body, tags } = ctx.request.body;
  const post = new Post({ title, body, tags });
  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
```

### 데이터 조회

- 모델 인스턴스의 `find()` 함수 사용
- `find()` 함수 호출 후 `exec()`을 붙여주어야 서버에 쿼리를 요청함

```jsx
const posts = await Post.find().exec();
```

### 특정 포스트 조회

- 특정 id를 가진 데이터를 조회할 때 `findById()` 함수 사용

```jsx
const post = await Post.findById(id).exec();
```

<br>

## 데이터 삭제와 수정

### 데이터 삭제

- `remove()`: 특정 조건을 만족하는 데이터를 모두 지움
- `findByIdAndDelete()`: id를 찾아서 지움
- `findOneAndRemove()`: 특정 조건을 만족하는 데이터 하나를 찾아서 제거

```jsx
await Post.findByIdAndDelete(id).exec();
```

### 데이터 수정

- `findByIdAndUpdate()` 함수 사용
- 첫 번째 파라미터는 id, 두 번째 파라미터는 업데이트 내용, 세 번째 파라미터는 옵션 전달

```jsx
const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
  new: true, // 이 값을 설정하면 업데이트된 데이터를 반환, false면 업데이트되기 전 데이터를 반환
}).exec();
```

<br>

## 요청 검증

### ObjectId 검증

- id가 잘못된 겨웅 클라이언트가 요청을 잘못 보낸 것이니 400 Bad Request 오류를 띄워줘야 함
- id 값이 올바른 ObjectId인지 검증하는 방법은 다음과 같음

```jsx
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;
ObjectId.isValid(id);
```

### Request Body 검증

- 객체 검증을 수월하게 해주는 라이브러리 Joi를 사용하자
    - `yarn add joi`

```jsx
import Joi from 'joi';

...
const schema = Joi.object().keys({
  // 객체가 다음 필드를 가지고 있음을 검증
  title: Joi.string().required(), // required()가 있으면 필수 항목
  body: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
});

// 검증하고 나서 검증 실패인 경우 에러 처리
const result = schema.validate(ctx.request.body);
if (result.error) {
  ctx.status = 400; // Bad Request
  ctx.body = result.error;
  return;
}
```

<br>

## 페이지네이션 구현

- 블로그의 포스트 목록에서 한 페이지에 보이는 포스트 개수는 10~20개 정도가 적당함
- 포스트 목록에서 포스트 전체 내용을 보여 줄 필요 없고, 처음 200자 정도만 보여주면 적당함

### 가짜 데이터 생성하기

- mongoDB와 연결 시 아래 함수를 한 번 호출 후 삭제하기
- Compass에서 잘 등록되었는지 확인하기

```jsx
export default async function createFakeData() {
  const posts = [...Array(40).keys()].map((i) => ({
    title: `포스트 #${i}`,
    body: "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    tags: ['가짜', '데이터'],
  }));

  try {
    const docs = await Post.insertMany(posts);
    console.log(docs);
  } catch (e) {
    console.error(e);
  }
}
```

### 페이지네이션 기능 구현하기

- 가장 최근에 작성된 포스트를 먼저 보여주기 위해 `sort()` 함수를 사용해 역순 정렬
    - 파라미터를 `{ key: 1 }` 형식으로 전달
    - `key`는 정렬할 필드를 설정하는 부분
    - 오른쪽 값을 `1`로 설정하면 오름차순, `-1`로 설정하면 내림차순으로 정렬
- `skip()` 함수는 파라미터로 받은 개수를 제외하고 그다음 데이터를 불러옴
    - 한 페이지 당 10개인 경우, `(page - 1) * 10`을 파라미터로 전달하면, 현재 페이지의 데이터를 불러올 수 있는 것

```jsx
export const list = async (ctx) => {
  const page = parseInt(ctx.query.page || '1', 10); // query로 page 정보를 받지 못한 경우 1로 자동 설정

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const posts = await Post.find()
      .sort({ _id: -1 }) // 포스트를 역순으로 불러오기
      .skip((page - 1) * 10) // 현재 페이지의 데이터를 주기 위해 넘기기
      .limit(10) // 한 페이지 당 10개씩만 주기
      .lean() // Document 객체를 JSON 형태로 변환
      .exec();
    const postCount = await Post.countDocuments().exec();
    ctx.set('Last-Page', Math.ceil(postCount / 10)); // http 헤더 설정해 Last Page 알려주기
    ctx.body = posts.map((post) => ({
      ...post,
      body: post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`, // body가 200가 초과인 경우 자르기
    }));
  } catch (e) {
    ctx.throw(500, e);
  }
};
```
