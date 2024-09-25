// import { bindActionCreators } from "redux";
// import { connect } from "react-redux";
import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Counter from "../components/Counter";
import { increase, decrease } from "../modules/counter";

// const CounterContainer = ({ number, increase, decrease }) => {
//   return (
//     <Counter number={number} onIncrease={increase} onDecrease={decrease} />
//   );
// };
const CounterContainer = () => {
  const number = useSelector((state) => state.counter.number);
  const dispatch = useDispatch();
  return (
    <Counter
      number={number}
      onIncrease={useCallback(() => dispatch(increase()), [dispatch])}
      onDecrease={useCallback(() => dispatch(decrease()), [dispatch])}
    />
  );
};

// const mapStateToProps = (state) => ({
//   number: state.counter.number,
// });

// const mapDispatchToProps = (dispatch) => ({
//   increase: () => dispatch(increase()),
//   decrease: () => dispatch(decrease()),
// });
// const mapDispatchToProps = (dispatch) =>
//   bindActionCreators({ increase, decrease }, dispatch);
// const mapDispatchToProps = { increase, decrease };

// export default connect(mapStateToProps, mapDispatchToProps)(CounterContainer);
export default CounterContainer;
