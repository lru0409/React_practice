# 14장. 외부 API를 연동하여 뉴스 뷰어 만들기

> **뉴스 API**
>
> [News API – Search News and Blog Articles on the Web](https://newsapi.org/)

<br/>

## 비동기 작업의 이해

- 서버의 API를 사용해야 할 때는 네트워크 송수신 과정에서 시간이 걸리기 때문에 작업이 즉시 처리되는 것이 아니라, 응답을 받을 때까지 기다렸다가 전달받은 응답 데이터를 처리해야 한다.
- 만약 API 작업을 동기적으로 처리한다면, 응답을 받을 때까지 기다리는 동안 다른 작업을 할 수 없다. 하지만 이를 비동기적으로 처리하면, 동시에 다른 작업을 하고 있을 수 있다.

> **콜백 함수**

- 자바스크립트에서 비동기 작업을 위해 흔히 사용되는 방법이다.
- 콜백 함수가 여러 번 중첩되면, 코드의 가독성이 나빠진다. → 콜백 지옥 (지양하자!)

> **Promise**

- 콜백 지옥이 형성되지 않도록 ES6에 도입된 기능이다.
- 여러 작업을 연달아 처리한다고 해서 여러 번 감싸는 것이 아니라, `.then`을 사용하여 그다음 작업을 설정하기 때문에 콜백 지옥이 형성되지 않는다.

> **async/await**

- Promise를 더욱 쉽게 사용할 수 있도록 해 주는 ES2017(ES8) 문법이다.
- 함수의 앞 부분에 async 키워드를 추가하고, 해당 함수 내부에서 Promise의 앞 부분에 await를 사용하면, Promise가 끝날 때까지 기다리고 결과 값을 변수에 담을 수 있다.

<br/>

## axios로 API 호출해서 데이터 받아오기

- 현재 가장 많이 사용되고 있는 자바스크립트 HTTP 클라이언트이다.
- HTTP 요청을 Promise 기반으로 처리한다는 특징이 있다.
- `npm install axios` : axios 라이브러리 설치
- 가짜 API를 호출하여 이에 대한 응답을 받아오는 코드 작성해보기
  ```jsx
  const onClick = async () => {
    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/todos/1',
      );
      setData(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  ```

<br/>

## newsapi API 키 발급받기

[Register - News API](https://newsapi.org/register)

- 발급받은 API 키는 후추 API를 요청할 때 API 주소의 쿼리 파라미터로 넣어서 사용하면 된다.
- [한국 뉴스를 가져오는 API에 대한 설명서](https://newsapi.org/s/south-korea-news-api)
- 사용할 API 주소는 두 가지 형태이다.

  1. 전체 뉴스 불러오기 : https://newsapi.org/v2/top-headlines?country=kr&apiKey=[API키]

  2. 특정 카테고리 뉴스 불러오기 : https://newsapi.org/v2/top-headlines?country=kr&category=[카테고리]&apiKey=[API키]

- news API 호출해보기
  ```jsx
  const response = await axios.get(
    'https://newsapi.org/v2/top-headlines?country=us&apiKey=0747e42a4385468f97c0053edcfa5f3e',
  );
  setData(response.data);
  ```

<br/>

## 데이터 연동하기

- 컴포넌트가 화면에 보이는 시점에 API를 요청해보자. useEffect를 사용하여 컴포넌트가 처음 렌더링되는 시점에 API를 요청하면 된다.
- 단, `useEffect`에 등록하는 함수에 async를 붙일 수 없다. `useEffect`에서 반환하는 값은 뒷정리 함수이기 때문이다. → `useEffect` 내부에서 async/await 를 사용하고 싶다면, 함수 내부에 async 키워드가 붙은 또 다른 함수들 만들어 사용해야 한다.

  ```jsx
  useEffect(() => {
    // async를 사용하는 함수 따로 선언
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'https://newsapi.org/v2/top-headlines?country=us&apiKey=0747e42a4385468f97c0053edcfa5f3e',
        );
        setArticles(response.data.articles);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);
  ```

<br/>

## usePromise 커스텀 Hook 만들기

- API 호출처럼 Promise를 사용해야 하는 경우, 더욱 간결하게 코드를 작성할 수 있도록 해주는 커스텀 Hook을 만들어 프로젝트에 적용해보자.
- src/lib 디렉토리를 만들자. 프로젝트의 다양한 곳에 사용될 수 있는 유틸 함수들은 보통 이 경로에 작성한다.
- usePromise 커스텀 훅은 Promise의 대기 중, 완료 결과, 실패 결과에 대한 상태를 관리하며 usePromise 내부에서 사용한 useEffect의 의존 배열로 설정된다.
  - 의존 배열을 설정하는 부분에서 ESLint 경고가 나타난다. 이 경고를 무시하려면, 특정 줄에서 ESLint 규칙을 무시하도록 주석을 작성해주자.
    ```jsx
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ```
- `usePromise` 커스텀 훅

  ```jsx
  export default function usePromise(promiseCreator, deps) {
    // 대기 중/완료/실패에 대한 상태 관리
    const [loading, setLoading] = useState(false);
    const [resolved, setResolved] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
      const process = async () => {
        setLoading(true);
        try {
          const resolved = await promiseCreator();
          setResolved(resolved);
        } catch (e) {
          setError(e);
        }
        setLoading(false);
      };
      process();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return [loading, resolved, error];
  }
  ```

- `usePromise` 커스텀 훅의 사용
  ```jsx
  const NewsList = ({ category }) => {
    const [loading, response, error] = usePromise(() => {
      const query = category === 'all' ? '' : `&category=${category}`;
      return axios.get(
        `https://newsapi.org/v2/top-headlines?country=us${query}&apiKey=0747e42a4385468f97c0053edcfa5f3e`,
      );
    }, [category]);
    (...)
  }
  ```
