import { View, ActivityIndicator, Text } from "react-native";

interface Props {
  message?: string;
}

export function LoadingSpinner({ message }: Props) {
  return (
    <View className="flex-1 items-center justify-center py-12">
      <ActivityIndicator size="large" color="#16A34A" />
      {message && (
        <Text className="text-sm text-gray-400 mt-3">{message}</Text>
      )}
    </View>
  );
}

/* Skeleton matching web's LazyImageCard placeholder:
   - Gray box aspect 4:3, rounded-xl
   - Title skeleton 75% width
   - User skeleton with avatar circle
*/
export function SkeletonCard() {
  return (
    <View className="bg-white">
      <View
        className="w-full bg-gray-100 rounded-xl"
        style={{ aspectRatio: 4 / 3 }}
      />
      <View className="pt-3 px-1">
        <View className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
        <View className="flex-row items-center gap-2">
          <View className="w-5 h-5 rounded-full bg-gray-100" />
          <View className="h-3 bg-gray-100 rounded w-16" />
        </View>
      </View>
    </View>
  );
}
