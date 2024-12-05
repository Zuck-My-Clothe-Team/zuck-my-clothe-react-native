import { useAuth } from "@/context/auth.context";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

const ProfilePage = () => {
  const auth = useAuth();
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          Welcome, Employee!
        </Text>
        <Text style={{ fontSize: 18, marginTop: 10 }}>
          {auth?.authContext.firstname} {auth?.authContext.lastname}
        </Text>
        <Text style={{ fontSize: 18, marginTop: 10 }}>
          {auth?.authContext.email}
        </Text>
        <TouchableOpacity
          onPress={async () => {
            try{

              await auth?.logout();
            }catch(err){
              console.log("logout error: ",err)
            }
          }}
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: "red",
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfilePage;
