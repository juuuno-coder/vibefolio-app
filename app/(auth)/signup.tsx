import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react-native";

export default function SignUpScreen() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email.trim() || !password || !displayName.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: displayName.trim(),
          },
        },
      });
      if (error) throw error;

      Alert.alert(
        "Account Created",
        "Please check your email for verification link.",
        [{ text: "OK", onPress: () => router.replace("/(auth)/login") }]
      );
    } catch (e: any) {
      Alert.alert("Sign Up Failed", e.message || "Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, justifyContent: "center", flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-3xl font-black text-slate-900 mb-2">
          Create Account
        </Text>
        <Text className="text-base text-slate-400 mb-8">
          Join Vibefolio and showcase your work
        </Text>

        {/* Display Name */}
        <View className="flex-row items-center bg-slate-50 rounded-xl border border-slate-200 px-4 h-14 mb-3">
          <User size={20} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-3 text-base text-slate-900"
            placeholder="Display Name"
            placeholderTextColor="#94a3b8"
            value={displayName}
            onChangeText={setDisplayName}
          />
        </View>

        {/* Email */}
        <View className="flex-row items-center bg-slate-50 rounded-xl border border-slate-200 px-4 h-14 mb-3">
          <Mail size={20} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-3 text-base text-slate-900"
            placeholder="Email"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        {/* Password */}
        <View className="flex-row items-center bg-slate-50 rounded-xl border border-slate-200 px-4 h-14 mb-3">
          <Lock size={20} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-3 text-base text-slate-900"
            placeholder="Password (6+ chars)"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff size={20} color="#94a3b8" />
            ) : (
              <Eye size={20} color="#94a3b8" />
            )}
          </Pressable>
        </View>

        {/* Confirm Password */}
        <View className="flex-row items-center bg-slate-50 rounded-xl border border-slate-200 px-4 h-14 mb-6">
          <Lock size={20} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-3 text-base text-slate-900"
            placeholder="Confirm Password"
            placeholderTextColor="#94a3b8"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
          />
        </View>

        {/* Sign Up Button */}
        <Pressable
          onPress={handleSignUp}
          disabled={loading}
          className={`h-14 rounded-xl items-center justify-center ${
            loading ? "bg-indigo-300" : "bg-indigo-500"
          }`}
        >
          <Text className="text-white font-bold text-base">
            {loading ? "Creating..." : "Sign Up"}
          </Text>
        </Pressable>

        {/* Login Link */}
        <View className="flex-row items-center justify-center mt-6 mb-10">
          <Text className="text-slate-400">Already have an account? </Text>
          <Pressable onPress={() => router.push("/(auth)/login")}>
            <Text className="text-indigo-500 font-bold">Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
