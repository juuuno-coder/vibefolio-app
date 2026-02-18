import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getProject } from "@/lib/api/projects";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  Heart,
  Eye,
  MessageCircle,
  ExternalLink,
  Share2,
  Bookmark,
} from "lucide-react-native";
import { useAuth } from "@/lib/auth/AuthContext";
import { toggleBookmark } from "@/lib/bookmarks";
import { useState } from "react";
import { Share } from "react-native";
import { BASE_URL } from "@/lib/constants";

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(id!),
    enabled: !!id,
  });

  const handleBookmark = async () => {
    if (!user) {
      router.push("/(auth)/login");
      return;
    }
    try {
      const result = await toggleBookmark(id!);
      setBookmarked(result);
    } catch (e) {
      console.warn("Bookmark failed:", e);
    }
  };

  const handleShare = async () => {
    if (!project) return;
    try {
      await Share.share({
        message: `${project.title} - ${BASE_URL}/project/${project.project_id}`,
      });
    } catch (e) {}
  };

  if (isLoading || !project) return <LoadingSpinner message="Loading..." />;

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Thumbnail */}
      {project.thumbnail_url && (
        <Image
          source={{ uri: project.thumbnail_url }}
          className="w-full h-64"
          contentFit="cover"
          transition={300}
        />
      )}

      <View className="px-4 pt-4">
        {/* Title */}
        <Text className="text-2xl font-black text-slate-900">
          {project.title}
        </Text>

        {/* Author */}
        {project.user && (
          <Pressable
            onPress={() => router.push(`/user/${project.user!.id}`)}
            className="flex-row items-center mt-3"
          >
            <Image
              source={{
                uri:
                  project.user.avatar_url ||
                  `https://api.dicebear.com/7.x/initials/png?seed=${project.user.display_name}`,
              }}
              className="w-8 h-8 rounded-full bg-slate-200"
              contentFit="cover"
            />
            <Text className="ml-2 text-sm font-semibold text-slate-600">
              {project.user.display_name}
            </Text>
          </Pressable>
        )}

        {/* Stats */}
        <View className="flex-row items-center gap-4 mt-4 py-3 border-y border-slate-100">
          <View className="flex-row items-center gap-1">
            <Eye size={16} color="#94a3b8" />
            <Text className="text-sm text-slate-400">{project.view_count}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Heart size={16} color="#94a3b8" />
            <Text className="text-sm text-slate-400">{project.like_count}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <MessageCircle size={16} color="#94a3b8" />
            <Text className="text-sm text-slate-400">
              {project.comment_count}
            </Text>
          </View>
          <View className="flex-1" />
          <Pressable onPress={handleBookmark} className="p-2">
            <Bookmark
              size={20}
              color={bookmarked ? "#6366f1" : "#94a3b8"}
              fill={bookmarked ? "#6366f1" : "none"}
            />
          </Pressable>
          <Pressable onPress={handleShare} className="p-2">
            <Share2 size={20} color="#94a3b8" />
          </Pressable>
        </View>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mt-4">
            {project.tags.map((tag) => (
              <View
                key={tag}
                className="bg-slate-100 rounded-full px-3 py-1"
              >
                <Text className="text-xs text-slate-500">{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Description */}
        <Text className="text-base text-slate-700 leading-7 mt-4">
          {project.description}
        </Text>

        {/* Source URL */}
        {project.source_url && (
          <Pressable
            onPress={() => Linking.openURL(project.source_url!)}
            className="flex-row items-center gap-2 mt-6 bg-indigo-50 px-4 py-3 rounded-xl"
          >
            <ExternalLink size={18} color="#6366f1" />
            <Text className="text-sm text-indigo-600 font-semibold flex-1" numberOfLines={1}>
              {project.source_url}
            </Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}
