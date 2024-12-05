import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Modal from "react-native-modal";

type CustomModalProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  icon: React.ComponentProps<any>;
  text: string[];
  secondary_text?: string[];
  submit_text?: string;
  onPress?: () => void;
};

const CustomModal = (props: CustomModalProps) => {
  return (
    <View className="">
      <Modal
        isVisible={props.visible}
        className=" flex justify-center items-center"
        onBackdropPress={() => {
          props.setVisible(false);
        }}
        animationInTiming={350}
        animationOutTiming={350}
        hasBackdrop
      >
        <View
          className=" bg-white justify-center items-center rounded-xl flex flex-col gap-y-4"
          style={{ width: "90%", height: "22%"}}
        >
          <View className="">{props.icon}</View>

          <View className=" flex flex-col justify-center items-center">
            {props.text.map((text, index) => (
              <Text key={index} className=" font-kanit text-text-1 text-xl">
                {text}
              </Text>
            ))}
            {props.secondary_text?.map((text, index) => (
              <Text key={index} className=" font-kanit text-text-4 text-base">
                {text}
              </Text>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => {
              props.setVisible(false);
              if (props.onPress) {
                props.onPress();
              }
            }}
            className=" px-6 py-2 bg-primaryblue-200 rounded-lg"
          >
            <Text className=" text-white font-kanit">
              {props.submit_text ? props.submit_text : "ตกลง"}
            </Text>

          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default CustomModal;
