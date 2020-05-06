import React from "react";
import { shallow } from "enzyme";
import { LoginPage } from "../../components/LoginPage";

let startLogin, wrapper;

beforeEach(() => {
  startLogin = jest.fn();
  wrapper = shallow(<LoginPage startLogin={startLogin} />);
});

test("Should render login page correctly", () => {
  expect(wrapper).toMatchSnapshot();
});

test("Should call startLogin on button click", () => {
  wrapper.find("button").prop("onClick")();
  expect(startLogin).toHaveBeenCalled();
});
