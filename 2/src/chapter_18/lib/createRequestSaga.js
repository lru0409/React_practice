import { call, put } from "redux-saga/effects";
import { startLoading, finishLoading } from "../modules/loading";

export default function createRequestSaga(type, request) {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;

  return function* (action) {
    yield put(startLoading(type)); // 로딩 시작
    try {
      // call을 사용하면 Promise를 반환하는 함수를 호출하고 기다릴 수 있다.
      // 첫 번째 파라미터는 함수, 나머지 파라미터는 해당 함수에 넣을 인수이다.
      const response = yield call(request, action.payload);
      yield put({ type: SUCCESS, payload: response.data });
    } catch (e) {
      yield put({ type: FAILURE, payload: e, error: true });
    }
    yield put(finishLoading(type)); // 로딩 끝
  };
}
