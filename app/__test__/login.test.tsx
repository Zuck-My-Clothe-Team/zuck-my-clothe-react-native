// app/index.test.tsx

import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import App from "..";

describe("App Component", () => {
  it("renders correctly", () => {
    const { getByText, getByPlaceholderText } = render(<App />);
    expect(getByText("Suck My Clothe")).toBeTruthy();
    expect(getByText("Enter your phone number")).toBeTruthy();
    expect(getByPlaceholderText("0xx xxx xxxx")).toBeTruthy();
  });

  it("formats phone number correctly", () => {
    const { getByPlaceholderText } = render(<App />);
    const input = getByPlaceholderText("0xx xxx xxxx");

    fireEvent.changeText(input, "0901231234");
    expect(input.props.value).toBe("090 123 1234");
  });

  it("validates phone number correctly", () => {
    const { getByPlaceholderText } = render(<App />);
    const input = getByPlaceholderText("0xx xxx xxxx");

    fireEvent.changeText(input, "1123456789");
    expect(input.props.value).toBe("");

    fireEvent.changeText(input, "01");
    expect(input.props.value).toBe("0");

    fireEvent.changeText(input, "0901231234");
    expect(input.props.value).toBe("090 123 1234");
  });

  it("enables/disables submit button correctly", async () => {
    const { getByPlaceholderText, getByTestId } = render(<App />);
    const input = getByPlaceholderText("0xx xxx xxxx");
    const button = getByTestId("login-button");

    expect(button.props.accessibilityState.disabled).toBe(true);

    fireEvent.changeText(input, "0901231234");
    expect(button.props.accessibilityState.disabled).toBe(false);

    fireEvent.changeText(input, "090");
    expect(button.props.accessibilityState.disabled).toBe(true);
  });
});
