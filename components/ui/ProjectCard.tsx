import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Heart, Eye, MessageCircle } from "lucide-react-native";
import type { Project } from "@/lib/api/projects";

interface Props {
  project: Project;
}

export function ProjectCard({ project }: Props) {
  const router = useRouter();

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
          {project.user && (
            <Text className="text-xs text-slate-400 flex-1" numberOfLines={1}>
              {project.user.display_name}
            </Text>
          )}
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Eye size={13} color="#94a3b8" />
              <Text className="text-xs text-slate-400">
                {project.view_count}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Heart size={13} color="#94a3b8" />
              <Text className="text-xs text-slate-400">
                {project.like_count}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MessageCircle size={13} color="#94a3b8" />
              <Text className="text-xs text-slate-400">
                {project.comment_count}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
