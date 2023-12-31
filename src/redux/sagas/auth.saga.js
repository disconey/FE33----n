import { put, takeEvery } from "redux-saga/effects";
import axios from "axios";

import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  getUserInfoRequest,
  getUserInfoSuccess,
  getUserInfoFailure,
  updateUserInfoRequest,
  updateUserInfoSuccess,
  updateUserInfoFailure,
  paymentRequest,
  paymentSuccess,
  paymentFailure,
} from "redux/slicers/auth.slice";

function* loginSaga(action) {
  try {
    const { data, callback } = action.payload;
    const result = yield axios.post("http://localhost:4000/login", data);
    yield localStorage.setItem("accessToken", result.data.accessToken);
    yield callback();
    yield put(
      loginSuccess({
        data: result.data.user,
      })
    );
  } catch (e) {
    yield put(loginFailure({ error: "Email hoặc mật khẩu không đúng" }));
  }
}

function* registerSaga(action) {
  try {
    const { data, callback } = action.payload;
    yield axios.post("http://localhost:4000/register", data);
    yield callback();
    yield put(registerSuccess());
  } catch (e) {
    yield put(registerFailure({ error: "Email đã tồn tại" }));
  }
}

function* getUserInfoSaga(action) {
  try {
    const { id } = action.payload || {};
    const result = yield axios.get(`http://localhost:4000/users/${id}`, {
      params: {
        _embed: "orders",
      },
    });
    yield put(getUserInfoSuccess({ data: result.data }));
  } catch (e) {
    yield put(getUserInfoFailure({ error: "Lỗi" }));
  }
}
function* paymentSaga(action) {
  try {
    const { data, callback } = action.payload;
    const result = yield axios.patch(
      `http://localhost:4000/users/${data.id}`,
      data
    );
    yield callback();
    yield put(paymentSuccess({ data: result.data.user }));
  } catch (e) {
    yield put(paymentFailure({ error: e }));
  }
}
function* updateUserInfoSaga(action) {
  try {
    const { data, callback, id } = action.payload;
    const result = yield axios.patch(`http://localhost:4000/users/${id}`, data);
    // yield callback();
    yield put(updateUserInfoSuccess({ data: result.data }));
  } catch (e) {
    yield put(updateUserInfoFailure({ error: e }));
  }
}

export default function* authSaga() {
  yield takeEvery(loginRequest.type, loginSaga);
  yield takeEvery(registerRequest.type, registerSaga);
  yield takeEvery(getUserInfoRequest.type, getUserInfoSaga);
  yield takeEvery(paymentRequest.type, paymentSaga);
  yield takeEvery(updateUserInfoRequest.type, updateUserInfoSaga);
}
