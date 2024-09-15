// app/otp_submit.test.tsx

import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import OTPSubmit from "../otp_submit";
import { Alert } from "react-native";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

describe("OTPSubmit Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getAllByTestId, getByText } = render(<OTPSubmit />);
    const inputs = getAllByTestId("otp-input-box");

    expect(getByText("Enter OTP")).toBeTruthy();
    expect(inputs).toHaveLength(6);
  });

  it("updates OTP state correctly on digit input", () => {
    const { getAllByTestId } = render(<OTPSubmit />);
    const inputs = getAllByTestId("otp-input-box");

    fireEvent.changeText(inputs[0], "1");
    expect(inputs[0].props.value).toBe("1");

    fireEvent.changeText(inputs[1], "2");
    expect(inputs[1].props.value).toBe("2");
  });

  it("dismisses keyboard on last digit input", () => {
    const { getAllByTestId } = render(<OTPSubmit />);
    const inputs = getAllByTestId("otp-input-box");

    fireEvent.changeText(inputs[5], "6");
    expect(inputs[5].props.value).toBe("6");
    // Assuming the keyboard dismiss is handled internally, we can't directly test it here.
  });

  it("handles backspace correctly", () => {
    const { getAllByTestId } = render(<OTPSubmit />);
    const inputs = getAllByTestId("otp-input-box");

    fireEvent.changeText(inputs[0], "1");
    fireEvent.changeText(inputs[1], "2");
    fireEvent.changeText(inputs[1], "keyPress", {
      nativeEvent: { key: "Backspace" },
    });

    expect(inputs[1].props.value).toBe("");
    expect(inputs[0].props.value).toBe("1");
  });

  it("does not accept non-numeric characters", () => {
    const { getAllByTestId } = render(<OTPSubmit />);
    const inputs = getAllByTestId("otp-input-box");

    fireEvent.changeText(inputs[0], "a");
    expect(inputs[0].props.value).toBe("");
  });

  it("shows error message on incorrect OTP", async () => {
    const { getAllByTestId, getByText } = render(<OTPSubmit />);
    const inputs = getAllByTestId("otp-input-box");
    const submitButton = getByText("Submit");

    fireEvent.changeText(inputs[0], "1");
    fireEvent.changeText(inputs[1], "2");
    fireEvent.changeText(inputs[2], "3");
    fireEvent.changeText(inputs[3], "4");
    fireEvent.changeText(inputs[4], "5");
    fireEvent.changeText(inputs[5], "0");

    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText("Incorrect OTP. Please try again.")).toBeTruthy();
    });
  });

  // TODO : Fix the test case when implementing the send OTP feature
  it("shows success alert on correct OTP", async () => {
    const correctOTP = "123456";
    const alertSpy = jest.spyOn(Alert, "alert");
    const { getAllByTestId, getByText } = render(<OTPSubmit />);
    const inputs = getAllByTestId("otp-input-box");
    const submitButton = getByText("Submit");

    fireEvent.changeText(inputs[0], correctOTP[0]);
    fireEvent.changeText(inputs[1], correctOTP[1]);
    fireEvent.changeText(inputs[2], correctOTP[2]);
    fireEvent.changeText(inputs[3], correctOTP[3]);
    fireEvent.changeText(inputs[4], correctOTP[4]);
    fireEvent.changeText(inputs[5], correctOTP[5]);

    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Success",
        "OTP verified successfully"
      );
    });
  });

  it("shows alert on resend OTP", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    const { getByTestId, getByText } = render(<OTPSubmit />);
    const resendButton = getByTestId("resend-button");

    fireEvent.press(resendButton);

    expect(getByText("Resend OTP")).toBeTruthy();
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "OTP Resent",
        "A new OTP has been sent to your phone."
      );
    });
  });
});
