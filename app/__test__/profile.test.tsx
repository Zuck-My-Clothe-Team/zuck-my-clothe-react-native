import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useAuth } from "@/context/auth.context";
import { SplashScreen } from "expo-router";
import ProfilePage from "../(tabs)/profile";

jest.mock("@/context/auth.context");
jest.mock("expo-router");

describe("ProfilePage", () => {
  const mockLogout = jest.fn();
  const mockAuthContext = {
    authContext: {
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      profile_image_url: "http://example.com/profile.jpg",
    },
    logout: mockLogout,
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue(mockAuthContext);
    (SplashScreen.preventAutoHideAsync as jest.Mock).mockImplementation(
      jest.fn
    );
    jest.clearAllMocks();
  });

  it("should render profile page correctly", () => {
    const { getByText, getByTestId } = render(<ProfilePage />);

    expect(getByText("John")).toBeTruthy();
    expect(getByText("john.doe@example.com")).toBeTruthy();
    expect(getByText("1234567890")).toBeTruthy();
    expect(getByTestId("profile-image").props.source.uri).toBe(
      "http://example.com/profile.jpg"
    );
  });

  it("should handle logout button click", async () => {
    const { getByText } = render(<ProfilePage />);

    fireEvent.press(getByText("ออกจากระบบ"));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  it("should render default profile image if no URL is provided", () => {
    const mockAuthContextWithoutImage = {
      ...mockAuthContext,
      authContext: {
        ...mockAuthContext.authContext,
        profile_image_url: undefined,
      },
    };
    (useAuth as jest.Mock).mockReturnValue(mockAuthContextWithoutImage);

    const { getByTestId } = render(<ProfilePage />);

    expect(getByTestId("profile-image").props.source).toBe(
      require("../../assets/images/profilepage/profilepic.jpg")
    );
  });

  it("should render all option cards", () => {
    const { getByText } = render(<ProfilePage />);

    expect(getByText("แก้ไขข้อมูลส่วนตัว")).toBeTruthy();
    expect(getByText("ที่อยู่")).toBeTruthy();
    expect(getByText("ข้อกำหนดเงื่อนไขและนโยบายอื่น ๆ")).toBeTruthy();
    expect(getByText("ตั้งค่า")).toBeTruthy();
    expect(getByText("ติดต่อ Support")).toBeTruthy();
    expect(getByText("ออกจากระบบ")).toBeTruthy();
  });
});
