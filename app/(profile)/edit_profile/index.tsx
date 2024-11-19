import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, SplashScreen } from "expo-router";
import { useAuth } from "@/context/auth.context";
import {
  IRoles,
  IUserAuthContext,
  IUsers,
  IUserUpdate,
} from "@/interface/userdetail.interface";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Modal from "react-native-modal";
import { updateUser, updateUserPassword } from "@/api/user.api";
import { useFocusEffect } from "@react-navigation/native";

const profilePic = require("../../../assets/images/profilepage/user.png");
const profilePageBG = require("../../../assets/images/profilepage/Bubble Bung Bung.png");

const EditProfile = () => {
  const auth = useAuth();
  const userData: IUserAuthContext | undefined = auth?.authContext;
  const screenHeight = Dimensions.get("window").height;

  // State variables
  const [updateUserData, setUpdateUserData] = useState<IUserUpdate>({
    firstname: "",
    lastname: "",
    phone: "",
    role: userData?.role as IRoles,
  });

  const [modal, setModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [pressedButton, setPressedButton] = useState(false);

  // Editable data
  const editabledata = [
    { name: "ชื่อ", placeholder: userData?.firstname, key: "firstname" },
    { name: "นามสกุล", placeholder: userData?.lastname, key: "lastname" },
    { name: "เบอร์โทร", placeholder: userData?.phone, key: "phone" },
    {
      name: "Email",
      placeholder: userData?.email,
      key: "email",
      disable: true,
    },
  ];

  // Handle input changes dynamically
  // Updated handleInputChange
  const handleInputChange = (key: string, value: string) => {
    setUpdateUserData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const CloseModalandClearPass = () => {
    setModal(false);
    setPassword("");
    setconfirmPassword("");
    setPressedButton(false);
  };

  const resetstate = useCallback(() => {
    setUpdateUserData({
      firstname: "",
      lastname: "",
      phone: "",
      role: userData?.role as IRoles,
    });
    setModal(false);
    setPassword("");
    setconfirmPassword("");
    setPressedButton(false);
  }, []);

  const handleConfirmPassword = async (
    password: string,
    confirmpassword: string
  ) => {
    if (password !== confirmpassword) {
      Alert.alert(
        "เปลี่ยนรหัสผ่านผิดพลาด",
        "Password และ Confirm Password ไม่ตรงกัน",
        [
          {
            text: "OK",
            onPress: () => {
              CloseModalandClearPass();
            },
          },
        ]
      );
    } else if (password === "" || confirmpassword === "") {
      Alert.alert("โปรดใส่รหัสผ่าน", "โปรดใส่รหัสผ่านให้ครบถ้วน", [
        {
          text: "OK",
          onPress: () => {
            CloseModalandClearPass();
          },
        },
      ]);
    } else {
      const objpass = {
        password: password,
      };
      try {
        const updatepass = await updateUserPassword(
          userData?.user_id as string,
          objpass
        );
        console.log("Updated Successfully: ", updatepass);
      } catch (error) {
        console.log("error occurs during update password:", error);
      }
      CloseModalandClearPass();
    }
  };

  const handleUserUpdate = async (
    userId: string,
    olddata: IUserUpdate,
    newdata: IUserUpdate
  ) => {
    // console.log("User ID :",userId);
    if (newdata.firstname === "") {
      newdata.firstname = olddata.firstname;
    }
    if (newdata.lastname === "") {
      newdata.lastname = olddata.lastname;
    }
    if (newdata.phone === "") {
      newdata.phone = olddata.phone;
    }

    // console.log("Data :", newdata);

    try {
      const receive: IUsers = await updateUser(userId, newdata);
      console.log("Update completed", receive);
      Alert.alert("เปลี่ยนข้อมูลสำเร็จ", "เปลี่ยนข้อมูลสำเร็จ", [
        {
          text: "OK",
          onPress: () => {
            resetstate();
          },
        },
      ]);
    } catch (error) {
      console.log("Error during Update User:", error);
      resetstate();
    }
  };

  useFocusEffect(resetstate);

  return (
    <View className="">
      <View className="bg-background-1 h-28 w-full absolute z-10"></View>
      <View className="h-full w-full bg-secondaryblue-200 absolute z-0">
        <Image
          source={profilePageBG}
          resizeMode="cover"
          resizeMethod="resize"
          style={{ width: "auto" }}
        />
      </View>
      <SafeAreaView className="h-full relative z-20">
        <Modal isVisible={modal}>
          <View className="bg-white p-3 rounded-lg">
            <Text
              className="text-primaryblue-300 font-kanit text-3xl text-center my-4"
              style={{ color: "#0285DF" }}
            >
              แก้ไขรหัสผ่าน
            </Text>
            <View className="gap-4">
              <Text className="font-kanit text-text-3 text-xl">Password :</Text>
              <TextInput
                placeholder="รหัสผ่าน"
                placeholderTextColor={"#D8D8D8"}
                secureTextEntry
                style={styles.modal_input}
                onChangeText={(val) => setPassword(val)}
              ></TextInput>

              <Text className="font-kanit text-text-3 text-xl">
                Confirm Password :
              </Text>
              <TextInput
                placeholder="รหัสผ่าน"
                placeholderTextColor={"#D8D8D8"}
                secureTextEntry
                style={styles.modal_input}
                onChangeText={(val) => setconfirmPassword(val)}
              ></TextInput>
            </View>

            <View
              className="flex flex-row justify-evenly"
              style={{ marginVertical: 20 }}
            >
              <TouchableOpacity
                onPress={() => {
                  CloseModalandClearPass();
                }}
              >
                <View className="px-12 py-2 rounded-lg border border-primaryblue-200">
                  <Text className="font-kanit text-primaryblue-200 text-xl">
                    ยกเลิก
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  if (!pressedButton) {
                    setPressedButton(true);
                    await handleConfirmPassword(password, confirmPassword);
                  }
                }}
              >
                <View className="px-12 py-2 rounded-lg bg-primaryblue-200">
                  <Text className="font-kanit text-text-2 text-xl">ยืนยัน</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View className="h-24 relative bg-background-1 justify-center">
          <TouchableOpacity
            className="absolute mx-5 pt-5 z-10"
            onPress={() => router.back()}
          >
            <AntDesign name="arrowleft" size={48} color="#71BFFF" />
          </TouchableOpacity>
          <View className="w-full h-full flex items-center justify-end pb-3">
            <Text className="text-4xl p-1 font-kanitMedium text-primaryblue-200">
              แก้ไขข้อมูลส่วนตัว
            </Text>
          </View>
        </View>

        <View className="mt-20 rounded-t-[60px] h-full w-full bg-white relative flex items-center">
          <View className="absolute -top-16 rounded-full size-32 border-[5px] border-secondaryblue-200 bg-secondaryblue-200 flex">
            <Image
              source={
                userData?.profile_image_url
                  ? { uri: userData?.profile_image_url }
                  : profilePic
              }
              className="size-full rounded-full"
              resizeMode="cover"
              testID="profile-image"
            />
          </View>
          <View className="px-5 flex flex-col mt-20 w-full gap-y-8 max-h-screen pb-16">
            {editabledata.map((editableItem, index) => (
              <View key={index} className="px-5">
                <Text className="font-kanit text-text-3 text-2xl mb-2">
                  {editableItem.name}
                </Text>
                <TextInput
                  placeholder={editableItem.placeholder}
                  placeholderTextColor="#D8D8D8"
                  editable={!editableItem.disable}
                  onChangeText={(value) =>
                    handleInputChange(editableItem.key, value)
                  }
                  style={{
                    fontFamily: "Kanit_400Regular",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: !editableItem.disable ? "#BDE2FF" : "#D8D8D8",
                    borderRadius: 4,
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                  }}
                />
              </View>
            ))}

            <View
              className="items-center flex flex-col px-4"
              style={{ gap: 20 }}
            >
              <TouchableOpacity
                className="border border-primaryblue-200 rounded-md w-full"
                onPress={() => setModal(true)}
              >
                <Text className="font-kanit text-text-3 text-xl text-center px-6 py-2">
                  แก้ไขรหัสผ่าน
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-primaryblue-200 rounded-md w-full"
                onPress={async () => {
                  if (!pressedButton) {
                    setPressedButton(true);
                    // console.log("hello")
                    const olddata: IUserUpdate = {
                      firstname: userData?.firstname as string,
                      lastname: userData?.lastname as string,
                      phone: userData?.phone as string,
                      role: userData?.role as IRoles,
                    };
                    // console.log(send)
                    await handleUserUpdate(
                      userData?.user_id as string,
                      olddata,
                      updateUserData
                    );
                  }
                }}
              >
                <Text className="font-kanit text-text-2 text-xl text-center px-6 py-2">
                  บันทึกการเปลี่ยนแปลง
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  modal_input: {
    borderWidth: 1,
    borderColor: "#BDE2FF",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    fontFamily: "Kanit_400Regular",
    color: "#373737",
  },
});

export default EditProfile;
