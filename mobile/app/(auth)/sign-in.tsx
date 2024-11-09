import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Modal from "react-native-modal";

import * as icons from "@/constants/icons";
import * as images from "@/constants/images";
import { storeInfo, storeTokens } from "@/lib/secureStore";

const SignIn: React.FC = () => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]); // Store each digit
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const inputRefs = useRef<Array<TextInput | null>>([]); // Refs for automatically focusing on the next input

  // Handle updating code digits
  const handleChangeText = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value;

    setCode(newCode);

    // Automatically focus on the next input field when a digit is entered
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all inputs are filled
    if (newCode.every((digit) => digit !== "")) {
      console.log("Complete Code:", newCode.join("")); // Handle the complete code here
    }
  };

  const handleSignIn = async () => {
    const API_URL = process.env.EXPO_PUBLIC_USER_API_URL;

    try {
      const response = await fetch(`${API_URL}/authentication/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const responseData = await response.json();
      const jwtToken = responseData.token;
      const refreshToken = responseData.refresh_token;

      try {
        await storeTokens(jwtToken, refreshToken);
        await storeInfo("email", email);

        setModalVisible(false);
        setCode(["", "", "", "", "", ""]);

        router.push("/home");
      } catch (error) {
        console.error("Error storing tokens:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGoogleSignIn = () => {
    if (router.canDismiss()) {
      router.dismissAll();
    }
    router.replace("/home");
    console.log("Sign-in with Google");
  };

  return (
    <SafeAreaView className="h-full w-full bg-primary">
      <ScrollView className="w-full h-full">
        <View className="w-full flex items-center justify-center gap-y-5 mt-5">
          <View className="flex items-center justify-center">
            <Image source={images.logo} className="h-14 w-14" />
            <Text className="text-txt-100 text-2xl font-bold ml-2 mt-1">
              RiConnect
            </Text>
          </View>
          <Text className="text-txt-100 text-2xl text-start w-full pl-5 font-medium pt-4">
            Sign-in
          </Text>
          <View className="w-full items-center justify-center gap-y-4 px-5">
            <View className="flex flex-col gap-y-2 w-full">
              <Text className="font-medium text-base text-txt-200">Email</Text>
              <TextInput
                className="bg-primary p-2 rounded-lg w-full border border-primary-80"
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <View className="flex flex-col gap-y-2 w-full">
              <Text className="font-medium text-base text-txt-200">
                Password
              </Text>
              <TextInput
                className="bg-primary p-2 rounded-lg w-full border border-primary-80"
                placeholder="Password"
                secureTextEntry={showPassword}
                onChangeText={(text) => setPassword(text)}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="flex items-start justify-start w-full px-5"
        >
          <Text className="text-primary-80 text-base font-light mt-1">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <View className="flex w-full items-center justify-center px-5 mt-24">
          <TouchableOpacity
            onPress={handleSignIn}
            className="bg-primary-0 p-2 rounded-lg w-full items-center justify-center"
          >
            <Text className="text-lg font-semibold text-white">Sign-in</Text>
          </TouchableOpacity>
          <View className="flex flex-row items-center justify-center w-full my-5">
            <View className="border border-primary-80 w-[40%]" />
            <Text className="text-txt-200 text-base font-medium px-5 opacity-70">
              or
            </Text>
            <View className="border border-primary-80 w-[40%]" />
          </View>
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            className="bg-primary border border-primary-0 w-full p-2 rounded-lg items-center justify-center"
          >
            <View className="flex flex-row items-center justify-center">
              <Image
                source={icons.google}
                className="h-5 w-5 mx-2"
                tintColor={"#0240B4"}
              />
              <Text className="text-lg font-semibold text-primary-0">
                Sign-in with Google
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className="flex flex-row items-center justify-center w-full px-5 mt-1">
          <Text className="text-txt-200 text-base font-medium">
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push("/sign-up")}>
            <Text className="text-primary-95 text-base font-medium">
              {" "}
              Sign-up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for entering 6-digit code */}
    </SafeAreaView>
  );
};

export default SignIn;
