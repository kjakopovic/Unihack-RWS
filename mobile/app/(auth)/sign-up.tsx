import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { userSchema } from "@/schemas/zod-schemas";

const SignUp = () => {
  // Initialize useForm with zodResolver for validation
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
  });

  // Handle form submission
  const handleSignUp = async (data: any) => {
    console.log("Form data:", data);

    const { first_name, last_name, age, email, password } = data;

    console.log("First Name:", first_name);

    const API_URL = process.env.EXPO_PUBLIC_USER_API_URL;

    console.log("API URL:", API_URL);

    try {
      const response = await fetch(`${API_URL}/authentication/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name,
          last_name,
          age,
          email,
          password,
        }),
      });

      const responseData = await response.json();

      console.log("Response data:", responseData);

      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.replace("/home");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <SafeAreaView className="h-full w-full bg-black/90 border">
      <ScrollView className="w-full h-full py-2">
        <View className="w-full h-full flex items-center justify-center gap-y-5">
          <Text className="text-white text-start w-full pl-5 pt-5 text-2xl font-bold">
            Create you account
          </Text>

          {/* Form Fields */}
          <View className="w-full items-center justify-center gap-y-4 px-5">
            {/* First Name */}
            <View className="flex flex-col gap-y-2 w-full">
              <Text className="text-white/80">First Name</Text>
              <TextInput
                className="bg-primary border border-quinterny-500 p-2 rounded-lg w-full"
                placeholder="First Name"
                onChangeText={(text) => setValue("first_name", text)}
                {...register("first_name")}
                placeholderTextColor={"gray"}
              />
              {errors.firstName && (
                <Text className="text-danger">
                  *{errors.firstName.message as string}
                </Text>
              )}
            </View>

            {/* Last Name */}
            <View className="flex flex-col gap-y-2 w-full">
              <Text className="text-white/80">Last Name</Text>
              <TextInput
                className="bg-primary border border-quinterny-500 p-2 rounded-lg w-full"
                placeholder="Last Name"
                onChangeText={(text) => setValue("last_name", text)}
                {...register("last_name")}
                placeholderTextColor={"gray"}
              />
              {errors.lastName && (
                <Text className="text-danger">
                  *{errors.lastName.message as string}
                </Text>
              )}
            </View>

            {/* Age */}
            <View className="flex flex-col gap-y-2 w-full">
              <Text className="text-white/80">Age</Text>
              <TextInput
                className="bg-primary border border-quinterny-500 p-2 rounded-lg w-full"
                placeholder="Age"
                onChangeText={(text) => setValue("age", parseInt(text))}
                keyboardType="numeric"
                {...register("age")}
                placeholderTextColor={"gray"}
              />
              {errors.age && (
                <Text className="text-danger">
                  *{errors.age.message as string}
                </Text>
              )}
            </View>

            {/* Email */}
            <View className="flex flex-col gap-y-2 w-full">
              <Text className="text-white/80">Email</Text>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                className="bg-primary border border-quinterny-500 p-2 rounded-lg w-full"
                placeholder="Email"
                onChangeText={(text) => setValue("email", text)}
                {...register("email")}
                placeholderTextColor={"gray"}
              />
              {errors.email && (
                <Text className="text-danger">
                  *{errors.email.message as string}
                </Text>
              )}
            </View>

            {/* Password */}
            <View className="flex flex-col gap-y-2 w-full">
              <Text className="text-white/80">Password</Text>
              <TextInput
                className="bg-primary border border-quinterny-500 p-2 rounded-lg w-full"
                placeholder="Password"
                onChangeText={(text) => setValue("password", text)}
                secureTextEntry={true}
                {...register("password")}
                placeholderTextColor={"gray"}
              />
              {errors.password && (
                <Text className="text-danger">
                  *{errors.password.message as string}
                </Text>
              )}
            </View>

            {/* Confirm Password */}
            <View className="flex flex-col gap-y-2 w-full">
              <Text className="text-white/80">Confirm Password</Text>
              <TextInput
                className="bg-primary border border-quinterny-500 p-2 rounded-lg w-full"
                placeholder="Confirm Password"
                onChangeText={(text) => setValue("confirmPassword", text)}
                secureTextEntry={true}
                {...register("confirmPassword")}
                placeholderTextColor={"gray"}
              />
              {errors.confirmPassword && (
                <Text className="text-danger">
                  *{errors.confirmPassword.message as string}
                </Text>
              )}
            </View>
          </View>

          {/* Sign In Option */}
          <View className="flex flex-row items-center justify-start gap-x-2 w-full px-5">
            <Text className="text-base font-medium text-txt-200">
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.push("/sign-in");
              }}
            >
              <Text className="text-base font-medium text-quinterny-800">
                Sign-in
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <View className="w-full items-center justify-center px-5">
            <TouchableOpacity
              onPress={handleSubmit(handleSignUp)}
              className="bg-quinterny-500 p-2 rounded-lg w-full items-center justify-center mt-16"
            >
              <Text className="text-lg text-white font-semibold">Sign-up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
