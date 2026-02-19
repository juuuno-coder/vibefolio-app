import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Heart, Eye } from "lucide-react-native";
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
    badges.push({ label: "NEW", bg: "#818cf8", text: "#ffffff" });
  }
  return badges;
}

export function ProjectCard({ project }: Props) {
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
      className="bg-white rounded-2xl overflow-hidden mb-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Image with 4:3 aspect ratio */}
      <View className="relative">
        {project.thumbnail_url ? (
          <Image
            source={{ uri: project.thumbnail_url }}
            className="w-full"
            style={{ aspectRatio: 4 / 3 }}
            contentFit="cover"
            transition={200}
            placeholder={{ blurhash: "LKO2?U%2Tw=w]~RBVZRi};RPxuwH" }}
          />
        ) : (
          <View
            className="w-full bg-slate-100 items-center justify-center"
            style={{ aspectRatio: 4 / 3 }}
          >
            <Text className="text-4xl">{"🎨"}</Text>
            <Text className="text-xs text-slate-300 mt-1">No Image</Text>
          </View>
        )}

        {/* Badges overlay */}
        {badges.length > 0 && (
          <View className="absolute top-2.5 left-2.5 flex-row gap-1.5">
            {badges.map((b) => (
              <View
                key={b.label}
                className="px-2 py-0.5 rounded-md"
                style={{ backgroundColor: b.bg }}
              >
                <Text className="text-[10px] font-bold" style={{ color: b.text }}>
                  {b.label}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Card Info */}
      <View className="px-3.5 py-3">
        <Text
          className="text-[15px] font-bold text-slate-900 leading-5"
          numberOfLines={1}
        >
          {project.title}
        </Text>

        <View className="flex-row items-center justify-between mt-2">
          {/* Author */}
          <Pressable
            onPress={() => router.push(`/user/${project.user_id}`)}
            className="flex-row items-center flex-1 gap-1.5"
          >
            <Image
              source={{ uri: avatarUrl }}
              className="w-5 h-5 rounded-full bg-slate-200"
              contentFit="cover"
            />
            <Text className="text-xs text-slate-400" numberOfLines={1}>
              {displayName}
            </Text>
          </Pressable>

          {/* Stats */}
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Heart size={12} color="#94a3b8" />
              <Text className="text-[11px] text-slate-400">
                {project.likes_count || 0}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Eye size={12} color="#94a3b8" />
              <Text className="text-[11px] text-slate-400">
                {project.views_count || 0}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
