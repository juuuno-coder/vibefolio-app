import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getProject } from "@/lib/api/projects";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  Heart,
  Eye,
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

  // User info from detail API
  const projectUser = project.User || project.users;
  const displayName = projectUser?.username || "Unknown";
  const avatarUrl =
    (projectUser as any)?.profile_image_url ||
    projectUser?.avatar_url ||
    `https://api.dicebear.com/7.x/initials/png?seed=${displayName}`;
  const sourceUrl =
    (project.custom_data as any)?.source_url ||
    (project as any).source_url ||
    null;

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
        <Pressable
          onPress={() => router.push(`/user/${project.user_id}`)}
          className="flex-row items-center mt-3"
        >
          <Image
            source={{ uri: avatarUrl }}
            className="w-8 h-8 rounded-full bg-slate-200"
            contentFit="cover"
          />
          <Text className="ml-2 text-sm font-semibold text-slate-600">
            {displayName}
          </Text>
        </Pressable>

        {/* Stats */}
        <View className="flex-row items-center gap-4 mt-4 py-3 border-y border-slate-100">
          <View className="flex-row items-center gap-1">
            <Eye size={16} color="#94a3b8" />
            <Text className="text-sm text-slate-400">{project.views_count || 0}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Heart size={16} color="#94a3b8" />
            <Text className="text-sm text-slate-400">{project.likes_count || 0}</Text>
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

        {/* Description / Content */}
        <Text className="text-base text-slate-700 leading-7 mt-4">
          {project.content_text || project.description || ""}
        </Text>

        {/* Source URL */}
        {sourceUrl && (
          <Pressable
            onPress={() => Linking.openURL(sourceUrl)}
            className="flex-row items-center gap-2 mt-6 bg-indigo-50 px-4 py-3 rounded-xl"
          >
            <ExternalLink size={18} color="#6366f1" />
            <Text className="text-sm text-indigo-600 font-semibold flex-1" numberOfLines={1}>
              {sourceUrl}
            </Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}
