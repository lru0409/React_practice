# Lifting State Up

> 여러 개의 컴포넌트들 사이에서 state를 공유하는 방법

<br/>

## Shared State

- 하나의 데이터를 여러 컴포넌트에서 표현해야 하는 경우, 각 컴포넌트의 state에서 데이터를 각각 보관하는 것이 아니라 가장 가까운 공통된 부모 컴포넌트의 state를 공유해서 사용하는 것이 효율적이다.
- State에 있는 데이터를 여러 개의 하위 컴포넌트에서 공유하여 사용하는 것을 Shared State라고 한다.

<br/>

## 하위 컴포넌트에서 State 공유하기

- 섭씨온도 값을 props로 받아서 물이 끓는지 안 끓는지를 알려주는 컴포넌트
  ```jsx
  function BoilingVerdict(props) {
    if (props.celsius >= 100) {
      return <p>물이 끓습니다.</p>;
    }
    return <p>물이 끓지 않습니다.</p>;
  }
  ```
- 온도를 입력받기 위한 컴포넌트

  ```jsx
  const scaleNames = {
    c: "섭씨",
    f: "화씨",
  };

  function TemperatureInput(props) {
    const handleChange = (event) => {
      props.onTemperatureChange(event.target.value);
    };

    return (
      <fieldset>
        <legend>온도를 입력해 주세요(단위:{scaleNames[props.scale]}</legend>
        <input value={props.temperature} onChange={handleChange} />
      </fieldset>
    );
  }
  ```

- 섭씨온도 ↔ 화씨온도 변환 함수

  ```jsx
  function toCelsius(fahrenheit) {
    return ((fahrenheit - 32) * 5) / 9;
  }

  function toFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
  }
  ```

- 온도 값과 변환하는 함수를 인자로 받아 값을 변환시키는 함수
  ```jsx
  function tryConvert(temperature, convert) {
    const input = parseFloat(temperature);
    if (Number.isNaN(input)) {
      return "";
    }
    const output = convert(input);
    const rounded = Math.round(output * 1000) / 1000;
    return rounded.toString();
  }
  ```
- state를 상위 컴포넌트로 올린다는 것을 lifting state up 이라고 한다.
- 온도를 입력받아 계산하는 상위 컴포넌트

  ```jsx
  function Calculator(props) {
    const [temperature, setTemperature] = useState("");
    const [scale, setScale] = useState("c");

    const handleCelsiusChange = (temperature) => {
      setTemperature(temperature);
      setScale("c");
    };

    const handleFahrenheightChange = (temperature) => {
      setTemperature(temperature);
      setScale("f");
    };

    const celsius =
      scale === "f" ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheight =
      scale === "c" ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={handleCelsiusChange}
        />
        <TemperatureInput
          scale="f"
          temperature={fahrenheight}
          onTemperatureChange={handleFahrenheightChange}
        />
        <BoilingVerdict celsius={parseFloat(celsius)} />
      </div>
    );
  }
  ```

<br/>

<img width="876" alt="스크린샷 2024-09-02 오후 6 09 28" src="https://gist.github.com/user-attachments/assets/1f8bd1fd-de21-491f-866b-13090ed3b222">
