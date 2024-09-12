import styles from "./CSSModule.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles); // 미리 styles에서 클래스를 받아오도록 설정

const CSSModule = () => {
  const highlighted = false;
  return (
    <div className={cx("wrapper", { highlighted })}>
      안녕하세요, 저는 <span className="something">CSSModule!</span>
    </div>
  );
};

export default CSSModule;
