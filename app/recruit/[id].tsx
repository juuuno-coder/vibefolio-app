import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getRecruitItem } from "@/lib/api/recruit";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  Calendar,
  MapPin,
  Building2,
  ExternalLink,
  Bookmark,
  Share2,
} from "lucide-react-native";
import { useAuth } from "@/lib/auth/AuthContext";
import { toggleRecruitBookmark } from "@/lib/bookmarks";
import { useState } from "react";
import { Share } from "react-native";
import { BASE_URL } from "@/lib/constants";
import dayjs from "dayjs";

export default function RecruitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);

  const { data: item, isLoading } = useQuery({
    queryKey: ["recruit-item", id],
    queryFn: () => getRecruitItem(Number(id)),
    enabled: !!id,
  });

  const handleBookmark = async () => {
    if (!user) {
      router.push("/(auth)/login");
      return;
    }
    try {
      const result = await toggleRecruitBookmark(Number(id));
      setBookmarked(result);
    } catch (e) {
      console.warn("Bookmark failed:", e);
    }
  };

  const handleShare = async () => {
    if (!item) return;
    try {
      await Share.share({
        message: `${item.title} - ${BASE_URL}/recruit/${item.id}`,
      });
    } catch (e) {}
  };

  if (isLoading || !item) return <LoadingSpinner message="Loading..." />;

  const typeLabels: Record<string, string> = {
    job: "Job",
    contest: "Contest",
    event: "Event",
  };
  const typeColors: Record<string, string> = {
    job: "#3b82f6",
    contest: "#8b5cf6",
    event: "#f59e0b",
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Thumbnail */}
      {item.thumbnail && (
        <Image
          source={{ uri: item.thumbnail }}
          className="w-full h-52"
          contentFit="cover"
          transition={300}
        />
      )}

      <View className="px-4 pt-4">
        {/* Type Badge */}
        <View className="flex-row items-center gap-2 mb-2">
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: (typeColors[item.type] || "#94a3b8") + "20" }}
          >
            <Text
              className="text-xs font-bold"
              style={{ color: typeColors[item.type] || "#94a3b8" }}
            >
              {typeLabels[item.type] || item.type}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text className="text-2xl font-black text-slate-900">
          {item.title}
        </Text>

        {/* Meta Info */}
        <View className="mt-3 gap-2">
          {item.company && (
            <View className="flex-row items-center gap-2">
              <Building2 size={16} color="#94a3b8" />
              <Text className="text-sm text-slate-600">{item.company}</Text>
            </View>
          )}
          {item.date && (
            <View className="flex-row items-center gap-2">
              <Calendar size={16} color="#94a3b8" />
              <Text className="text-sm text-slate-600">
                Deadline: {dayjs(item.date).format("YYYY.MM.DD")}
              </Text>
            </View>
          )}
          {item.location && (
            <View className="flex-row items-center gap-2">
              <MapPin size={16} color="#94a3b8" />
              <Text className="text-sm text-slate-600">{item.location}</Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View className="flex-row items-center gap-3 mt-4 py-3 border-y border-slate-100">
          <Pressable onPress={handleBookmark} className="flex-row items-center gap-1 px-3 py-2 bg-slate-50 rounded-lg">
            <Bookmark
              size={18}
              color={bookmarked ? "#6366f1" : "#94a3b8"}
              fill={bookmarked ? "#6366f1" : "none"}
            />
            <Text className="text-sm text-slate-500">Save</Text>
          </Pressable>
          <Pressable onPress={handleShare} className="flex-row items-center gap-1 px-3 py-2 bg-slate-50 rounded-lg">
            <Share2 size={18} color="#94a3b8" />
            <Text className="text-sm text-slate-500">Share</Text>
          </Pressable>
          <View className="flex-1" />
        </View>

        {/* Description */}
        {item.description && (
          <Text className="text-base text-slate-700 leading-7 mt-4">
            {item.description}
          </Text>
        )}

        {/* Source URL */}
        {item.source_url && (
          <Pressable
            onPress={() => Linking.openURL(item.source_url!)}
            className="flex-row items-center gap-2 mt-6 bg-indigo-500 px-5 py-4 rounded-xl"
          >
            <ExternalLink size={18} color="#ffffff" />
            <Text className="text-base text-white font-bold">
              Apply / View Original
            </Text>
          </Pressable>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mt-4">
            {item.tags.map((tag) => (
              <View
                key={tag}
                className="bg-slate-100 rounded-full px-3 py-1"
              >
                <Text className="text-xs text-slate-500">{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
