import authReducer from "../../reducers/auth";

test("Should set uid for login", () => {
  const uid = "abc123";
  const action = {
    type: "LOGIN",
    uid,
  };
  const state = authReducer({}, action);
  expect(state.uid).toEqual(action.uid);
});

test("Should clear uid for logout", () => {
  const action = {
    type: "LOGOUT",
  };
  const state = authReducer({ uid: "123abc" }, action);
  expect(state).toEqual({});
});
