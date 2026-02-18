import { View, ActivityIndicator, Text } from "react-native";

interface Props {
  message?: string;
}

export function LoadingSpinner({ message }: Props) {
  return (
    <View className="flex-1 items-center justify-center py-12">
      <ActivityIndicator size="large" color="#6366f1" />
      {message && (
        <Text className="text-sm text-slate-400 mt-3">{message}</Text>
      )}
    </View>
  );
}
