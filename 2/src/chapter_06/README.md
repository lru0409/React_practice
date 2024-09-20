# 6장. 컴포넌트 반복

## key

- 컴포넌트 배열을 렌더링했을 때 어떤 원소에 변동이 있었는지 더욱 빠르게 감지하기 위해 사용한다.
- 데이터 항목의 아이디나 인덱스 값을 사용해 key를 설정하면 된다.
  - 다만 고유한 값이 없을 때만 index를 key로 사용해야 한다. index를 key로 사용하면, 배열이 변경될 때 효율적으로 리렌더링하지 못하기 때문이다.

```jsx
const articleList = articles.map((article) => (
  <Article title={article.title} writer={article.writer} key={article.id} />
));
```

```jsx
const IterationSample = () => {
  const names = ["눈사람", "얼음", "눈", "바람"];
  const namesList = names.map((name, index) => <li key={index}>{name}</li>);
  return <ul>{namesList}</ul>;
};
```

<br/>

## 동적인 배열 렌더링하기

- state의 배열을 변경할 때에는 배열에 직접 접근하여 수정하는 것이 아니라 concat, filter 등의 함수를 사용해 새로운 배열을 만든 후 이를 set 함수로 설정해 주어야 한다는 점에 주의하자!
