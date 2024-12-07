import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type TermOfserviceProps = {
  title?: string;
  description?: string;
};

const TermOfService = () => {
  const TOSText: TermOfserviceProps[] = [
    {
      description: `ยินดีต้อนรับสู่ Zuck My Clothe (ZMC) โดยการดาวน์โหลดและใช้งานแอปพลิเคชันของเรา ("แอปพลิเคชัน") ท่านตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขดังต่อไปนี้ หากท่านไม่ยินยอมตามข้อกำหนดเหล่านี้ กรุณาหยุดการใช้งานแอปพลิเคชันทันที`,
    },
    {
      title: `1. การให้บริการ`,
      description: `แอปพลิเคชัน Zuck My Clothe (ZMC) ให้บริการซักผ้าครบวงจรแก่ผู้ใช้บริการ ซึ่งรวมถึงการซัก อบ รีด และการจัดส่งผ้า ผู้ใช้บริการสามารถเลือกบริการและติดตามสถานะผ่านแอปพลิเคชันของเรา`,
    },
    {
      title: `2. การลงทะเบียนบัญชีผู้ใช้`,
      description: `เพื่อใช้บริการจากแอปพลิเคชัน ZMC ผู้ใช้จะต้องลงทะเบียนบัญชีผู้ใช้ด้วยข้อมูลที่ถูกต้องและครบถ้วน ผู้ใช้มีความรับผิดชอบในการรักษาความปลอดภัยของบัญชี และข้อมูลการเข้าสู่ระบบของตนเอง`,
    },
    {
      title: `3. การชำระเงิน`,
      description: `การชำระค่าบริการซักผ้าสามารถทำได้ผ่านช่องทางที่แอปพลิเคชันรองรับ ผู้ใช้ต้องตรวจสอบให้แน่ใจว่าการชำระเงินเสร็จสมบูรณ์และถูกต้องก่อนการใช้บริการ`,
    },
    {
      title: `4. นโยบายการจัดส่ง`,
      description: `ZMC ให้บริการจัดส่งผ้าถึงที่ตามที่ผู้ใช้ระบุในแอปพลิเคชัน การจัดส่งจะดำเนินการตามเวลาที่กำหนด แต่ ZMC ไม่รับผิดชอบหากเกิดความล่าช้าจากปัจจัยภายนอก เช่น สภาพอากาศหรือปัญหาการขนส่ง`,
    },
    {
      title: `5. ความรับผิดชอบของผู้ใช้`,
      description: `ผู้ใช้บริการต้องรับผิดชอบในการส่งผ้าที่ไม่มีสิ่งของมีค่า หรือสิ่งของที่มีความเสี่ยงสูงในการสูญหายหรือเสียหาย เช่น เงิน, เครื่องประดับ หรือสิ่งของอันตราย`,
    },
    {
      title: `6. การยกเลิกหรือคืนเงิน`,
      description: `การยกเลิกคำสั่งซื้อสามารถทำได้ภายในระยะเวลาที่กำหนด หากคำสั่งซื้อถูกยกเลิกก่อนเริ่มการบริการ ลูกค้าจะได้รับเงินคืนตามนโยบายของ ZMC ในกรณีที่เกิดความผิดพลาดจากทาง ZMC ทางบริษัทจะพิจารณาให้การคืนเงินหรืออื่น ๆ ตามความเหมาะสม`,
    },
    {
      title: `7. การเก็บข้อมูลส่วนบุคคล`,
      description: `การใช้แอปพลิเคชัน ZMC อาจต้องมีการเก็บข้อมูลส่วนบุคคลของผู้ใช้เพื่อให้บริการได้อย่างมีประสิทธิภาพ เช่น ข้อมูล่วนตัว การติดต่อและที่อยู่จัดส่ง ข้อมูลเหล่านี้จะถูกเก็บรักษาอย่างปลอดภัยและจะไม่ถูกเปิดเผยต่อบุคคลภายนอกโดยไม่ได้รับการอนุญาตจากผู้ใช้`,
    },
    {
      title: `8. ข้อกำหนดการเปลี่ยนแปลง`,
      description: `ZMC ขอสงวนสิทธิ์ในการปรับปรุง แก้ไข หรือเปลี่ยนแปลงข้อกำหนดและเงื่อนไขเหล่านี้ โดยจะแจ้งให้ผู้ใช้ทราบผ่านทางแอปพลิเคชันหรือช่องทางอื่น ๆ หากผู้ใช้ยังคงใช้งานแอปพลิเคชันหลังจากการเปลี่ยนแปลง ถือว่าได้ยอมรับข้อกำหนดและเงื่อนไขที่มีการปรับปรุงแล้ว`,
    },
    {
      title: `9. ข้อจำกัดความรับผิดชอบ`,
      description: `ZMC จะไม่รับผิดชอบต่อความเสียหายที่เกิดขึ้นจากการใช้บริการ ไม่ว่าจะเป็นความเสียหายโดยตรงหรือโดยอ้อม ยกเว้นในกรณีที่เกิดจากความผิดพลาดที่เกิดขึ้นจากทาง ZMC โดยตรง`,
    },
    {
      title: `10. การยกเลิกบัญชี`,
      description: `ZMC ขอสงวนสิทธิ์ในการระงับการให้บริการ หรือยกเลิกบัญชีผู้ใช้หากพบว่าผู้ใช้กระทำการที่ผิดกฎหมายหรือฝ่าฝืนข้อกำหนดและเงื่อนไขนี้`,
    },
  ];

  const policyText: TermOfserviceProps[] = [
    {
      title: `ข้อมูลที่เก็บรวบรวม`,
      description: `ZMC อาจเก็บข้อมูลส่วนบุคคลของผู้ใช้ เช่น ชื่อ ที่อยู่ เบอร์โทรศัพท์ และข้อมูลการชำระเงิน เพื่อให้บริการได้อย่างมีประสิทธิภาพ ข้อมูลเหล่านี้จะถูกเก็บรักษาอย่างปลอดภัยและใช้ตามวัตถุประสงค์ที่ได้รับการอนุญาตจากผู้ใช้เท่านั้น`,
    },
    {
      title: `การใช้ข้อมูล`,
      description: `ข้อมูลที่เก็บรวบรวมจะถูกใช้เพื่อ:
- การประมวลผลคำสั่งซื้อและจัดส่งบริการ
- การปรับปรุงคุณภาพบริการ
- การสื่อสารกับผู้ใช้เกี่ยวกับบริการต่าง ๆ`,
    },
    {
      title: `การปกป้องข้อมูล`,
      description: `ZMC ใช้เทคโนโลยีและมาตรการทางด้านความปลอดภัยที่เหมาะสมในการปกป้องข้อมูลส่วนบุคคลของผู้ใช้จากการเข้าถึงที่ไม่ได้รับอนุญาต`,
    },
    {
      title: `การแบ่งปันข้อมูล`,
      description: `ZMC จะไม่เปิดเผยข้อมูลส่วนบุคคลของผู้ใช้ให้กับบุคคลภายนอก ยกเว้นในกรณีที่กฎหมายกำหนดหรือในกรณีที่มีการอนุญาตจากผู้ใช้`,
    },
    {
      title: `---`,
    },
    {
      title: `การติดต่อ`,
      description: `หากท่านมีคำถามเกี่ยวกับข้อกำหนดและเงื่อนไขหรือการเก็บข้อมูลส่วนบุคคล สามารถติดต่อเราได้ที่:
- อีเมล: support@zuck.co.th
- โทรศัพท์: +66 88-888-8888`,
    },
  ];

  return (
    <SafeAreaView className=" bg-background-1 flex-1">
      <View className=" w-full relative mt-3">
        <View className="">
          <Text className=" text-center font-kanitMedium text-3xl text-primaryblue-200">
            ข้อกำหนดและนโยบาย
          </Text>
        </View>
        <View className=" px-6 absolute -top-[2px]">
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Ionicons name="arrow-back" size={30} color={"#71BFFF"} />
          </TouchableOpacity>
        </View>
      </View>

      <View className=" px-6 h-[93%] mt-4">
        <ScrollView className=" bg-white rounded-2xl flex-1 p-3 flex flex-col">
          <Text className=" flex-1 font-kanit text-lg text-text-1 ">
            ข้อกำหนดและเงื่อนไขการใช้บริการแอปพลิเคชั่น Zuck My Clothe (ZMC)
          </Text>
          {TOSText.map((text, index) => (
            <View key={index} className=" flex flex-col my-2">
              {text.title && (
                <Text className=" font-kanit text-lg text-text-1 ">
                  {text.title}
                </Text>
              )}
              <Text className=" font-kanitLight text-base text-text-1">
                {text.description}
              </Text>
            </View>
          ))}

          <View className=" my-3">
            <Text className="font-kanit text-lg text-text-1">
              นโยบายความเป็นส่วนตัว
            </Text>
            {policyText.map((text, index) => (
              <View key={index} className=" flex flex-col my-2">
                {text.title && (
                  <Text className=" font-kanit text-lg text-text-1 ">
                    {text.title}
                  </Text>
                )}
                {text.description && (
                  <Text className=" font-kanitLight text-base text-text-1">
                    {text.description}
                  </Text>
                )}
              </View>
            ))}
          </View>
          <View className=" h-5" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default TermOfService;
