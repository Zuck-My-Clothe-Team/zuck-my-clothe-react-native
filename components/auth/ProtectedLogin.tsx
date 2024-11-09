/* eslint-disable react-hooks/exhaustive-deps */
import { CheckToken } from "@/api/auth.api";
import { useAuth } from "@/context/auth.context";
import {
  IUserAuthContext,
  IUserDetail,
} from "@/interface/userdetail.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import LoadingBubble from "./Loading";

type Props = {
  children: React.ReactNode;
};

const ProtectedLogin: React.FC<Props> = ({ children }) => {
  const auth = useAuth();
  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const prepareApp = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");

        if (!token) {
          throw new Error("Token not found");
        }

        const result: IUserDetail | null = await CheckToken(token).catch(
          (error) => {
            console.error(error);
            return null;
          }
        );

        if (!result) {
          throw new Error("Token is invalid");
        }

        const userData: IUserAuthContext = {
          isAuth: true,
          user_id: result.user_id,
          email: result.email,
          firstname: result.firstname,
          role: result.role,
          lastname: result.lastname,
          phone: result.phone,
          profile_image_url: result.profile_image_url,
        };

        auth?.setAuthContext(userData);
      } catch {
        auth?.setAuthContext({
          isAuth: false,
          user_id: "",
          email: "",
          firstname: "",
          role: "",
          lastname: "",
          phone: "",
          profile_image_url: "",
        });
      } finally {
        setAppIsReady(true);
      }
    };

    prepareApp();
  }, [auth?.authContext.isAuth, usePathname()]);

  useEffect(() => {
    if (appIsReady) {
      if (!auth?.authContext.isAuth) {
        router.replace("/loginpage");
      } else {
        if (
          auth?.authContext.role === "Employee" ||
          auth?.authContext.role === "SuperAdmin" ||
          auth?.authContext.role === "Manager"
        ) {
          router.replace("/(employee)/home");
        } else if (auth.authContext.role === "Client") {
          router.replace("/(tabs)/home");
        }
      }
    }
  }, [appIsReady, auth?.authContext.role]);

  if (!appIsReady) {
    return <LoadingBubble />;
  }

  return <>{children}</>;
};

export default ProtectedLogin;
