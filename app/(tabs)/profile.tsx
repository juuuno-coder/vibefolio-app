import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  LogOut,
  Settings,
  ChevronRight,
  Bookmark,
  FolderOpen,
  Star,
} from "lucide-react-native";
import { useAuth } from "@/lib/auth/AuthContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, userProfile, loading, signOut } = useAuth();

  if (loading) return <LoadingSpinner message="Loading..." />;

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center" edges={["top"]}>
        <Text className="text-lg font-bold text-slate-700 mb-2">
          Login Required
        </Text>
        <Text className="text-sm text-slate-400 mb-6">
          Sign in to view your profile
        </Text>
        <Pressable
          onPress={() => router.push("/(auth)/login")}
          className="bg-indigo-500 px-8 py-3 rounded-xl"
        >
          <Text className="text-white font-bold text-base">Login</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: signOut,
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="px-4 py-3">
          <Text className="text-2xl font-black text-slate-900">My Page</Text>
        </View>

        {/* Profile Card */}
        <View className="mx-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <View className="flex-row items-center">
            <Image
              source={{
                uri:
                  userProfile?.avatar_url ||
                  `https://api.dicebear.com/7.x/initials/png?seed=${userProfile?.display_name || "U"}`,
              }}
              className="w-16 h-16 rounded-full bg-slate-200"
              contentFit="cover"
            />
            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold text-slate-900">
                {userProfile?.display_name || "User"}
              </Text>
              <Text className="text-sm text-slate-400">
                {userProfile?.email || user.email}
              </Text>
              {userProfile?.bio && (
                <Text className="text-sm text-slate-500 mt-1" numberOfLines={2}>
                  {userProfile.bio}
                </Text>
              )}
            </View>
          </View>

          {/* Points */}
          <View className="mt-4 flex-row items-center bg-indigo-50 rounded-xl px-4 py-3">
            <Star size={18} color="#6366f1" />
            <Text className="text-sm font-bold text-indigo-600 ml-2">
              {userProfile?.points || 0}P
            </Text>
          </View>
        </View>

        {/* Menu */}
        <View className="mx-4 mt-4 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <MenuItem
            icon={<FolderOpen size={20} color="#6366f1" />}
            label="My Projects"
            onPress={() => {
              if (user) router.push(`/user/${user.id}`);
            }}
          />
          <MenuItem
            icon={<Bookmark size={20} color="#6366f1" />}
            label="Bookmarks"
            onPress={() => {}}
          />
          <MenuItem
            icon={<Settings size={20} color="#6366f1" />}
            label="Settings"
            onPress={() => {}}
          />
        </View>

        {/* Sign Out */}
        <Pressable
          onPress={handleSignOut}
          className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex-row items-center"
        >
          <LogOut size={20} color="#ef4444" />
          <Text className="text-red-500 font-semibold ml-3">Sign Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-4 border-b border-slate-50"
    >
      {icon}
      <Text className="flex-1 text-base text-slate-700 ml-3">{label}</Text>
      <ChevronRight size={18} color="#cbd5e1" />
    </Pressable>
  );
}
