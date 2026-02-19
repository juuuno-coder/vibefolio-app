import { View, ActivityIndicator, Text } from "react-native";

interface Props {
  message?: string;
}

export function LoadingSpinner({ message }: Props) {
  return (
    <View className="flex-1 items-center justify-center py-12">
      <ActivityIndicator size="large" color="#16A34A" />
      {message && (
        <Text className="text-sm text-slate-400 mt-3">{message}</Text>
      )}
    </View>
  );
}

export function SkeletonCard() {
  return (
    <View className="bg-white rounded-2xl overflow-hidden mb-4 border border-slate-100">
      <View className="w-full bg-slate-100" style={{ aspectRatio: 4 / 3 }} />
      <View className="p-3.5">
        <View className="h-4 bg-slate-100 rounded-md w-3/4 mb-2" />
        <View className="flex-row items-center gap-2 mt-1">
          <View className="w-5 h-5 rounded-full bg-slate-100" />
          <View className="h-3 bg-slate-100 rounded-md w-20" />
        </View>
      </View>
    </View>
  );
}
