import { updateUser, updateUserPassword } from "@/api/user.api";
import CustomModal from "@/components/modal/CustomModal";
import { useAuth } from "@/context/auth.context";
import {
  IRoles,
  IUserAuthContext,
  IUsers,
  IUserUpdate,
} from "@/interface/userdetail.interface";
import { Entypo, Ionicons, Octicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Alert,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";

const EditProfile = () => {
  const profilePic = require("@/assets/images/profilepage/user.png");
  const profilePageBG = require("@/assets/images/profilepage/Bubble Bung Bung.png");

  const auth = useAuth();
  const userData: IUserAuthContext | undefined = auth?.authContext;

  // State variables
  const [updateUserData, setUpdateUserData] = useState<IUserUpdate>({
    firstname: "",
    lastname: "",
    phone: "",
    role: userData?.role as IRoles,
  });

  const [modal, setModal] = useState(false);
  const [isConfirmModalVisible, SetIsConfirmModalVisible] = useState(false);
  const [isNotMatchPasswordModalVisible, setIsNotMatchPasswordModalVisible] =
    useState(false);
  const [isSuccessModalVisible, setIsSuccessVisibleModal] = useState(false);
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
      setIsNotMatchPasswordModalVisible(true);
      // console.log("Password and Confirm Password not match");
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
        SetIsConfirmModalVisible(true);
        console.log("Updated Successfully: ", updatepass);
      } catch (error) {
        console.log("error occurs during update password:", error);
      }
      // CloseModalandClearPass();
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
      setIsSuccessVisibleModal(true);
    } catch (error) {
      console.log("Error during Update User:", error);
      resetstate();
    }
  };

  useFocusEffect(resetstate);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="w-full flex-1 flex bg-white" edges={["top"]}>
        <CustomModal
          visible={isSuccessModalVisible}
          setVisible={setIsSuccessVisibleModal}
          icon={<Octicons name="check-circle-fill" size={46} color="#45d66b" />}
          text={["แก้ไขข้อมูลสำเร็จ"]}
          onPress={() => {
            setIsSuccessVisibleModal(false);
            CloseModalandClearPass();
            resetstate();
            router.back();
          }}
        />
        <Modal isVisible={modal}>
          <KeyboardAvoidingView
            className="bg-white py-3 px-7 rounded-xl"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            shouldRasterizeIOS
          >
            <Text
              className="text-primaryblue-300 font-kanit text-3xl text-center my-4"
              style={{ color: "#0285DF" }}
            >
              แก้ไขรหัสผ่าน
            </Text>
            <View className=" gap-4">
              <Text className="font-kanit text-text-3 text-xl">Password:</Text>
              <TextInput
                placeholder="รหัสผ่าน"
                placeholderTextColor={"#D8D8D8"}
                secureTextEntry
                style={styles.modal_input}
                onChangeText={(val) => setPassword(val)}
              />
              <Text className="font-kanit text-text-3 text-xl">
                Confirm Password:
              </Text>
              <TextInput
                placeholder="ยืนยันรหัสผ่าน"
                placeholderTextColor={"#D8D8D8"}
                secureTextEntry
                style={styles.modal_input}
                onChangeText={(val) => setconfirmPassword(val)}
              />
            </View>
            <View
              className="flex flex-row justify-evenly"
              style={{ marginVertical: 24 }}
            >
              <TouchableOpacity
                onPress={() => {
                  CloseModalandClearPass();
                }}
              >
                <View className="px-10 py-2 rounded-lg border border-primaryblue-200">
                  <Text className="font-kanit text-primaryblue-200 text-lg">
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
                disabled={password === "" || confirmPassword === ""}
              >
                <View
                  className={`px-10 py-2 rounded-lg ${
                    password === "" || confirmPassword === ""
                      ? `bg-customgray-100 border border-customgray-200`
                      : `bg-primaryblue-200 border border-primaryblue-200`
                  }`}
                >
                  <Text
                    className={`font-kanit text-lg ${
                      password === "" || confirmPassword === ""
                        ? "text-customgray-400"
                        : "text-text-2"
                    }`}
                  >
                    ยืนยัน
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <CustomModal
              visible={isConfirmModalVisible}
              setVisible={SetIsConfirmModalVisible}
              icon={
                <Octicons name="check-circle-fill" size={46} color="#45d66b" />
              }
              text={["เปลี่ยนรหัสผ่านสำเร็จ"]}
              onPress={() => {
                SetIsConfirmModalVisible(false);
                CloseModalandClearPass();
              }}
            />
            <CustomModal
              visible={isNotMatchPasswordModalVisible}
              setVisible={setIsNotMatchPasswordModalVisible}
              icon={
                <Entypo name="circle-with-cross" size={46} color="#eb4034" />
              }
              text={["รหัสผ่านไม่ตรงกัน"]}
              onPress={() => {
                setIsNotMatchPasswordModalVisible(false);
                CloseModalandClearPass();
              }}
            />
          </KeyboardAvoidingView>
        </Modal>
        <View className=" px-5 py-3 bg-white w-full z-10">
          <View className=" w-full relative bg-white">
            <View className="">
              <Text className=" text-center font-kanitMedium text-3xl text-primaryblue-200">
                แก้ไขข้อมูลส่วนตัว
              </Text>
            </View>
            <View className=" absolute bottom-0">
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
              >
                <Ionicons name="arrow-back" size={36} color={"#71BFFF"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className=" bg-secondaryblue-200 relative bottom-[52px]">
          <View>
            <Image source={profilePageBG} />
          </View>
        </View>
        <View className="rounded-t-[60px] h-[70vh] w-full bg-white relative bottom-32 flex items-center">
          <View className=" absolute -top-16 rounded-full size-32 border-[5px] border-secondaryblue-200 bg-secondaryblue-200 flex">
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
          <KeyboardAwareScrollView className="px-3 flex flex-col mt-16 w-full ">
            {editabledata.map((editableItem, index) => (
              <View key={index} className="px-5 mt-4">
                <Text className="font-kanit text-text-3 text-xl mb-2">
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
                    backgroundColor: !editableItem.disable ? "#FFF" : "#F2F2F2",
                    borderRadius: 4,
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                    height: 40,
                  }}
                />
              </View>
            ))}
            <View
              className="items-center flex flex-col px-4 mt-16"
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
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
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
    height: 40,
  },
});

export default EditProfile;
