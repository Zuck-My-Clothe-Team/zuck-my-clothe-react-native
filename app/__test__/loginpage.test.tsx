import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import LoginPage from "../loginpage";
import { GoogleLogin } from "@/api/auth.api";
import { useAuth } from "@/context/auth.context";
import * as Google from "expo-auth-session/providers/google";

jest.mock("@/api/auth.api");
jest.mock("@/context/auth.context");
jest.mock("@react-native-async-storage/async-storage");
jest.mock("expo-auth-session");
jest.mock("expo-auth-session/providers/google");

describe("LoginPage", () => {
  const mockSetAuthContext = jest.fn();
  const mockPromptAsync = jest.fn();
  const mockResponse = {
    type: "success",
    params: { accessToken: "mockAccessToken" },
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      setAuthContext: mockSetAuthContext,
    });
    (Google.useAuthRequest as jest.Mock).mockReturnValue([
      ,
      mockResponse,
      mockPromptAsync,
    ]);
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should handle Google sign-in failure", async () => {
    const { getByTestId } = render(<LoginPage />);
    fireEvent.press(getByTestId("login-button"));

    await waitFor(() => {
      expect(mockPromptAsync).toHaveBeenCalled();
    });
  });

  it("should handle response error or not successful", async () => {
    const mockErrorResponse = { type: "error" };
    (Google.useAuthRequest as jest.Mock).mockReturnValue([
      ,
      mockErrorResponse,
      mockPromptAsync,
    ]);

    const { getByTestId } = render(<LoginPage />);
    fireEvent.press(getByTestId("login-button"));
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        "Google sign-in response error or not successful:",
        mockErrorResponse
      );
    });
  });
});
