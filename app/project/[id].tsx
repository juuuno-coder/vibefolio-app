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

  if (isLoading || !project) return <LoadingSpinner message="불러오는 중..." />;

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
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Thumbnail */}
      {project.thumbnail_url && (
        <Image
          source={{ uri: project.thumbnail_url }}
          className="w-full"
          style={{ aspectRatio: 4 / 3 }}
          contentFit="cover"
          transition={300}
        />
      )}

      <View className="px-5 pt-5">
        {/* Title */}
        <Text className="text-2xl font-black text-slate-900 leading-8">
          {project.title}
        </Text>

        {/* Author */}
        <Pressable
          onPress={() => router.push(`/user/${project.user_id}`)}
          className="flex-row items-center mt-3"
        >
          <Image
            source={{ uri: avatarUrl }}
            className="w-9 h-9 rounded-full bg-slate-200"
            contentFit="cover"
            style={{ borderWidth: 1, borderColor: "#e2e8f0" }}
          />
          <View className="ml-2.5">
            <Text className="text-sm font-semibold text-slate-700">
              {displayName}
            </Text>
          </View>
        </Pressable>

        {/* Stats & Actions */}
        <View className="flex-row items-center mt-4 py-3.5 border-y border-slate-100">
          <View className="flex-row items-center gap-1">
            <Eye size={16} color="#94a3b8" />
            <Text className="text-sm text-slate-400">
              {project.views_count || 0}
            </Text>
          </View>
          <View className="flex-row items-center gap-1 ml-4">
            <Heart size={16} color="#94a3b8" />
            <Text className="text-sm text-slate-400">
              {project.likes_count || 0}
            </Text>
          </View>
          <View className="flex-1" />
          <Pressable onPress={handleBookmark} className="p-2">
            <Bookmark
              size={20}
              color={bookmarked ? "#16A34A" : "#94a3b8"}
              fill={bookmarked ? "#16A34A" : "none"}
            />
          </Pressable>
          <Pressable onPress={handleShare} className="p-2">
            <Share2 size={20} color="#94a3b8" />
          </Pressable>
        </View>

        {/* Description / Content */}
        <Text className="text-[15px] text-slate-700 leading-7 mt-4">
          {project.content_text || project.description || ""}
        </Text>

        {/* Source URL */}
        {sourceUrl && (
          <Pressable
            onPress={() => Linking.openURL(sourceUrl)}
            className="flex-row items-center gap-2 mt-6 bg-green-50 px-4 py-3.5 rounded-xl"
            style={{ borderWidth: 1, borderColor: "#dcfce7" }}
          >
            <ExternalLink size={18} color="#16A34A" />
            <Text
              className="text-sm text-green-700 font-semibold flex-1"
              numberOfLines={1}
            >
              {sourceUrl}
            </Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}
