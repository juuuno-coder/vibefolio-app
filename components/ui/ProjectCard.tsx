import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Heart, Eye } from "lucide-react-native";
import type { Project } from "@/lib/api/projects";

interface Props {
  project: Project;
}

export function ProjectCard({ project }: Props) {
  const router = useRouter();
  const user = project.users || project.User;
  const displayName = user?.username || "Unknown";
  const avatarUrl =
    user?.avatar_url && user.avatar_url !== "/globe.svg"
      ? user.avatar_url
      : `https://api.dicebear.com/7.x/initials/png?seed=${displayName}`;

  return (
    <Pressable
      onPress={() => router.push(`/project/${project.project_id}`)}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 mb-3"
    >
      {project.thumbnail_url && (
        <Image
          source={{ uri: project.thumbnail_url }}
          className="w-full h-48"
          contentFit="cover"
          transition={200}
          placeholder={{ blurhash: "LKO2?U%2Tw=w]~RBVZRi};RPxuwH" }}
        />
      )}
      <View className="p-3">
        <Text className="text-base font-bold text-slate-900" numberOfLines={2}>
          {project.title}
        </Text>
        {project.description && (
          <Text className="text-sm text-slate-500 mt-1" numberOfLines={2}>
            {project.description}
          </Text>
        )}
        <View className="flex-row items-center mt-2 gap-3">
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
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Eye size={13} color="#94a3b8" />
              <Text className="text-xs text-slate-400">
                {project.views_count || 0}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Heart size={13} color="#94a3b8" />
              <Text className="text-xs text-slate-400">
                {project.likes_count || 0}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
