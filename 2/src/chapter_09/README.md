# 9장. 컴포넌트 스타일링

> **다음과 같은 스타일링 방식을 알아본다.**
>
> - **일반 CSS** : 컴포넌트를 스타일링하는 가장 기본적인 방식
> - **Sass** : CSS 전처리기 중 하나, 확장된 CSS 문법을 사용해 CSS 코드를 더욱 쉽게 작성 가능
> - **CSS Module** : CSS 클래스가 다른 CSS 클래스의 이름과 절대 충돌하지않도록 파일마다 고유한 이름을 자동으로 생성해주는 옵션
> - **styled-components** : 스타일을 자바스크립트 파일에 내장시키는 방식

<br/>

## 가장 흔한 방식, 일반 CSS

- 기존의 CSS 스타일리 딱히 불편하지 않고 새로운 기술을 배울 필요가 없다고 생각되면, 일반 CSS를 사용해도 상관 없다.
- 실제로 소규모 프로젝트에서는 새로운 스타일링 시스템을 적용하는 것이 불필요할 수 있다.
- CSS 작성 시 가장 중요한 점은 CSS 클래스를 중복되지 않게 만드는 것이다. 이를 위한 두 가지 방식이 있다.
  - 특별한 규칙을 사용하여 이름 짓기 : `.App-logo { … }`
  - CSS Selector를 활용하기 : `.App .logo { … }`

<br/>

## Sass 사용하기

- Syntacticlly Awesome Style Sheets(문법적으로 매우 멋진 스타일시트)
- CSS 전처리기로 복잡한 작업을 쉽게 할 수 있도록 해주고, 스타일 코드의 재활용성을 높여주고, 코드의 가독성을 높인다.
- 두 가지 확장자 .scss와 .sass를 지원한다.

  ```sass
  $font-stack: Helvetica, sans-serif
  $primary-color: #333

  body
  	font: 100% $font-stack
  	color: $primary-color
  ```

  ```scss
  $font-stack: Helvetica, sans-serif;
  $primary-color: #333;

  body {
    font: 100% $font-stack;
    color: $primary-color;
  }
  ```

  - .scss 확장자는 중괄호와 세미콜론을 사용해 기존 CSS 작성하는 방식과 비슷하다.
  - 주로 .scss 문법이 더 자주 사용된다.

- 변수나 믹스인(재사용되는 스타일 블록을 함수처럼 사용)을 사용할 수 있다.
  ```scss
  // 변수 사용하기
  $red: #fa5252;
  $orange: #fd7314;
  $yellow: #fcc419;
  // 믹스인 만들기(재사용되는 스타일 블록을 함수처럼 사용 가능)
  @mixin square($size) {
    $calculated: 32px * $size;
    width: $calculated;
    height: $calculated;
  }
  ```
- 다음과 같이 스타일 코드를 작성한다.

  ```scss
  @import "../styles/utils.scss";

  .SassComponent {
    display: flex;
    .box {
      // 일반 CSS에서 .SassComponent .box 와 마찬가지
      background: red;
      &.red {
        // .red 클래스가 .box와 함께 사용되었을 때
        background: $red;
        @include square(1);
      }
      &.orange {
        // .orange 클래스가 .box와 함께 사용되었을 때
        background: $orange;
        @include square(2);
      }
      &.yellow {
        // .yellow 클래스가 .box와 함께 사용되었을 때
        background: $yellow;
        @include square(3);
      }
    }
  }
  ```

### sass-loader 설정 커스터마이징하기

- 프로젝트에 디렉토리를 많이 만들어서 구조가 깊어졌다면, util.scss 파일을 import하기 위해 상위 폴더로 한참 거슬러 올라가야 한다는 단점이 있다.
- 웹팩에서 Sass를 처리하는 sass-loader의 설정을 커스터마이징하면 해결할 수 있다.

1. `npm run eject` 명령을 통해 세부 설정을 밖으로 꺼낸다.
   - create-react-app 프로젝트는 프로젝트의 구조와 복잡도를 낮추기 위해 세부 설정이 숨겨져 있다.
   - `npm run eject`는 커밋 후 진행해야 한다.
2. 프로젝트에 생성된 config 디렉토리 안의 webpack.config.js를 연다.
3. sassRegex라는 키워드를 찾는다. (두 번째 탐색)
4. use: 에 있는 ‘sass-loader’ 부분을 지우고, concat을 통해 커스터마이징된 sass-loader 설정을 넣어준다.

   ```jsx
   use: getStyleLoaders({
   	...
   }).concat({
   	loader: require.resolve('sass-loader'),
   	options: {
   			sassOptions: {
   				includePaths: [paths.appSrc + "/styles"], // Sass 파일을 styles 디렉터리 기준 절대 경로를 사용해 불러올 수 있음
   			},
   			additionalData: "@import 'utils';" // Sass 파일을 불러올 때마다 코드의 맨 윗부분에 특정 코드를 포함시킴
   	},
   }),
   ```

5. 서버를 껐다가 재시작한다.

### node_modules에서 라이브러리 불러오기

- 설치한 라이브러리는 node_modules 디렉토리에 저장된다.
- 문결 문자를 사용하면, 자동으로 node_modules에서 경로를 탐지한다.
  ```jsx
  @import '~library/styles';
  ```
- 연습 삼아 유용한 Sass 라이브러리 두 가지를 설치해본다.
  ```jsx
  npm add open-color include-media
  ```
  ```jsx
  @import '~include-media/dist/include-media';
  @import '~open-color/open-color';
  ```
  - 보통 scss 파일 경로가 어디에 위치하고 있는지 라이브러리 공식 매뉴얼에서 알려주지 않을 때가 많으니, 직접 경로로 들어가서 확인해 보아야 한다.

<br/>

## CSS Module

- CSS를 불러와서 사용할 때 클래스 이름을 고유한 값([파일 이름]_[클래스 이름]_[해시 값]) 형태로 자동으로 만들어서 컴포넌트 스타일 클래스 이름이 중첩되는 현상을 방지해주는 기술이다.
- .module.css 확장자로 파일을 저장하기만 하면 CSS Module이 적용된다.

```jsx
/* 자동으로 고유해질 것이므로 흔히 사용되는 단어를 클래스 이름으로 사용 가능 */
.wrapper {
  background: black;
  color: white;
}

/* 전역 CSS를 작성하고 싶다면 */
:global .something {
  font-weight: 800;
  color: aqua;
}
```

- CSS Module이 적용된 스타일 파일을 불러오면 객체를 하나 전달받는다. CSS Module에서 사용한 클래스 이름과 해당 이름은 고유화한 값이 키-값 형태로 들어와있다.
  → 고유한 클래스 이름을 사용하려면 클래스를 적용하고 싶은 JSX 엘리먼트에 `className`으로 `styles.[클래스 이름]`을 전달하면 된다.
  → :global로 전역적으로 선언한 클래스는 평상시처럼 문자열로 넣어준다.

```jsx
import styles from "./CSSModule.module.css";
const CSSModule = () => {
  return (
    <div className={styles.wrapper}>
      안녕하세요, 저는 <span className="something">CSSModule!</span>
    </div>
  );
};
```

### classnames

- CSS 클래스를 조건부로 설정할 때 매우 유용한 라이브러리이다.
- CSS Module을 사용할 때 이 라이브러리를 사용하면 여러 클래스를 적용할 때 매우 편리하다.
- `npm install calssnames` : 라이브러리 설치
- 여러 개의 파라미터를 조합해 CSS 클래스를 설정할 수 있다.

  ```jsx
  import classNames from "classnames";

  classNames("one", "two"); // 'one two'
  classNames("one", { two: true }); // 'one two'
  classNames("one", { two: false }); // 'one'
  const hello = "hello";
  classNames("one", hello, { myCondition: true }); // 'one hello myCondition'
  ```

- 사용 예시
  ```jsx
  // before
  const myComponent = ({ highlighted, theme }) => (
    <div className={`MyComponent ${highlighted ? "highlighted" : ""} ${theme}`}>
      Hello
    </div>
  );
  ```
  ```jsx
  // after
  const myComponent = ({ highlighted, theme }) => (
    <div className={classNames("MyComponent", { highlighted }, theme)}>
      Hello
    </div>
  );
  ```
- classnames에 내장되어 있는 bind 함수를 사용하면 CSS Module에서 클래스를 넣어줄 때마다 `styles.[클래스 이름]` 형태를 사용할 필요가 없어진다.

  ```jsx
  import classNames from "classnames/bind";
  import styles from "./CSSModule.module.css";

  const cx = classNames.bind(styles); // 미리 styles에서 클래스를 받아오도록 설정

  const myComponent = ({ highlighted, theme }) => (
    <div className={cx("MyComponent", { highlighted }, theme)}>Hello</div>
  );
  ```

- Sass와도 함께 사용 가능하다.
- CSS Module이 아닌 일반 .css/.scss 파일에서도 `:local`을 사용하여 CSS Module을 사용할 수 있다.
  ```css
  :local .wapper {
    ...;
  }
  ```

<br/>

## styled-components

- 자바스크립트 파일 안에 스타일을 선언할 수 있다. (CSS-in-JS)
- CSS-in-JS 라이브러리 중 개발자들이 가장 선호하는 라이브러리이다.
- `npm install styled-components` : 라이브러리 설치
- props 값으로 전달해주는 값을 스타일에 쉽게 적용할 수 있다는 것이 장점이다.
- VSCode를 사용할 때 styled-component를 위해 컴포넌트 내부에 작성한 문자열에 코드 신택스 하이라이팅이 적용되지 않는 경우 → vscode-styled-components를 검색해 설치하자

```jsx
const Box = styled.div`
  /* props로 넣어준 값을 직접 전달해 줄 수 있음 */
  background: ${(props) => props.color || "blue"};
  padding: 1rem;
  display: flex;
`;

const StyledComponent = () => (
  <Box color="black">
    <Button>안녕하세요</Button>
  </Box>
);
```

- 사용해야 할 태그명이 유동적인 경우, syled의 파라미터로 태그명을 전달할 수 있다.
  ```jsx
  const MyInput = styled("input")`
  	...
  `;
  ```

### Tagged 템플릿 리터럴

- styled-components에서 스타일을 작성할 때 사용하는 문법이다.
- 일반 템플릿 리터럴은 템플릿 안에 자바스크립트 객체나 함수를 전달하면 형태를 잃어버린다.
- 함수 뒤에 템플릿 리터럴을 넣어주면(Tagged 템플릿 리터럴을 사용하면), 템플릿 안에 넣은 값을 온전히 추출할 수 있다.
  ```jsx
  function tagged(...args) {
    console.log(args);
  }
  tagged`hello ${{ foo: "bar" }} ${() => "world"}!`;
  ```

### 반응형 디자인

```jsx
const Box = styled.div`
  background: ${(props) => props.color || "blue"};
  padding: 1rem;
  display: flex;
  /* 기본적으로는 1024px에 가운데 정렬, 가로 크기가 작아짐에 따라 크기 줄이기, 768px 미만이 되면 꽉 채우기 */
  width: 1024px;
  margin: 0 auto;
  @media (max-width: 1024px) {
    width: 768px;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;
```
