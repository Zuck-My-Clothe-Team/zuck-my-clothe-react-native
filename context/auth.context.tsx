import { IUserAuthContext } from "@/interface/userdetail.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState, ReactNode } from "react";

export const initialAuth: IUserAuthContext = {
  user_id: "",
  email: "",
  firstname: "",
  role: "",
  lastname: "",
  isAuth: false,
  phone: "",
  profile_image_url: "",
};

interface AuthContextType {
  authContext: IUserAuthContext;
  setAuthContext: (value: IUserAuthContext) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authContext, setAuthContext] = useState<IUserAuthContext>(initialAuth);

  const logout = async () => {
    console.log("Logout initiated");
    try {
      await AsyncStorage.removeItem("accessToken");
      setAuthContext({ ...authContext, isAuth: false });
      console.log("Logout success");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ authContext, setAuthContext, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
