// import { connect } from "react-redux";
// import { useCallback } from "react";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeInput, insert, toggle, remove } from "../modules/todos";
import Todos from "../components/Todos";
import { useActions } from "../lib/useActions";

// const TodosComponent = ({ input, todos, changeInput, insert, toggle, remove }) => {
//   return (
//     <Todos
//       input={input}
//       todos={todos}
//       onChangeInput={changeInput}
//       onInsert={insert}
//       onToggle={toggle}
//       onRemove={remove}
//     />
//   );
// };

const TodosContainer = () => {
  const { input, todos } = useSelector((state) => state.todos);
  // const dispatch = useDispatch();
  // const onChangeInput = useCallback(
  //   (input) => dispatch(changeInput(input)),
  //   [dispatch]
  // );
  // const onInsert = useCallback((text) => dispatch(insert(text)), [dispatch]);
  // const onToggle = useCallback((id) => dispatch(toggle(id)), [dispatch]);
  // const onRemove = useCallback((id) => dispatch(remove(id)), [dispatch]);
  const [onChangeInput, onInsert, onToggle, onRemove] = useActions(
    [changeInput, insert, toggle, remove],
    []
  );
  return (
    <Todos
      input={input}
      todos={todos}
      onChangeInput={onChangeInput}
      onInsert={onInsert}
      onToggle={onToggle}
      onRemove={onRemove}
    />
  );
};

// export default connect(
//   ({ todos }) => ({ input: todos.input, todos: todos.todos }),
//   { changeInput, insert, toggle, remove }
// )(TodosContainer);
export default React.memo(TodosContainer);
