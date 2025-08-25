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