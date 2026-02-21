import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Heart, Eye } from "lucide-react-native";
import { memo } from "react";
import type { Project } from "@/lib/api/projects";

interface Props {
  project: Project;
}

function getBadges(project: Project) {
  const badges: { label: string; bg: string; text: string }[] = [];
  if ((project.likes_count || 0) >= 100) {
    badges.push({ label: "POPULAR", bg: "#fef08a", text: "#a16207" });
  }
  const daysSinceCreated = Math.floor(
    (Date.now() - new Date(project.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceCreated <= 7) {
    badges.push({ label: "NEW RELEASE", bg: "#4f46e5", text: "#ffffff" });
  }
  return badges;
}

function addCommas(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export const ProjectCard = memo(function ProjectCard({ project }: Props) {
  const router = useRouter();
  const user = project.users || project.User;
  const displayName = user?.username || "Unknown";
  const avatarUrl =
    user?.avatar_url && user.avatar_url !== "/globe.svg"
      ? user.avatar_url
      : `https://api.dicebear.com/7.x/initials/png?seed=${displayName}`;
  const badges = getBadges(project);

  return (
    <Pressable
      onPress={() => router.push(`/project/${project.project_id}`)}
      className="bg-white"
    >
      {/* Image - 4:3 aspect ratio, rounded-xl, shadow-sm (web: ImageCard) */}
      <View
        className="relative rounded-xl overflow-hidden bg-gray-100"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        {project.thumbnail_url ? (
          <Image
            source={{ uri: project.thumbnail_url }}
            className="w-full"
            style={{ aspectRatio: 4 / 3 }}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
            placeholder={{ blurhash: "LKO2?U%2Tw=w]~RBVZRi};RPxuwH" }}
            recyclingKey={project.project_id}
          />
        ) : (
          <View
            className="w-full bg-gray-100 items-center justify-center"
            style={{ aspectRatio: 4 / 3 }}
          >
            <Text className="text-4xl">{"🎨"}</Text>
          </View>
        )}

        {/* Badges overlay - web: absolute top-3 left-3 flex-col gap-2 */}
        {badges.length > 0 && (
          <View className="absolute top-3 left-3 gap-2">
            {badges.map((b) => (
              <View
                key={b.label}
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: b.bg }}
              >
                <Text
                  className="text-[10px] font-bold"
                  style={{ color: b.text }}
                >
                  {b.label}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Info below image - web: pt-3 px-1 */}
      <View className="pt-3 px-1">
        {/* Title - web: font-bold text-gray-900 text-[15px] truncate mb-2 */}
        <Text
          className="text-[15px] font-bold text-gray-900 mb-2"
          numberOfLines={1}
        >
          {project.title}
        </Text>

        {/* User + Stats row */}
        <View className="flex-row items-center justify-between">
          {/* User info - web: w-5 h-5 avatar + text-xs text-gray-500 */}
          <Pressable
            onPress={() => router.push(`/user/${project.user_id}`)}
            className="flex-row items-center flex-1 gap-1.5"
          >
            <View
              className="w-5 h-5 rounded-full overflow-hidden bg-gray-100"
              style={{ borderWidth: 1, borderColor: "#f3f4f6" }}
            >
              <Image
                source={{ uri: avatarUrl }}
                className="w-full h-full"
                contentFit="cover"
                cachePolicy="memory-disk"
              />
            </View>
            <Text
              className="text-xs text-gray-500"
              numberOfLines={1}
              style={{ maxWidth: 120 }}
            >
              {displayName}
            </Text>
          </Pressable>

          {/* Stats - web: text-xs text-gray-400, flex items-center gap-1 */}
          <View className="flex-row items-center gap-2">
            <View className="flex-row items-center gap-1 px-1.5 py-0.5 rounded-full">
              <Heart size={12} color="#9ca3af" />
              <Text className="text-xs text-gray-400">
                {addCommas(project.likes_count || 0)}
              </Text>
            </View>
            <View className="flex-row items-center gap-1 px-1.5 py-0.5 rounded-full">
              <Eye size={12} color="#9ca3af" />
              <Text className="text-xs text-gray-400">
                {addCommas(project.views_count || 0)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
});
