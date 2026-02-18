import { View, Text, FlatList } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getProjects, type Project } from "@/lib/api/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ["user-profile", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("User")
        .select("*")
        .eq("id", id)
        .single();
      return data;
    },
    enabled: !!id,
  });

  // Fetch user's projects (server-side filter via userId param)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["user-projects", id],
    queryFn: ({ pageParam = 1 }) =>
      getProjects({ page: pageParam, limit: 20, userId: id }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    enabled: !!id,
  });

  const userProjects: Project[] =
    data?.pages.flatMap((page) => page.projects) ?? [];

  return (
    <FlatList
      className="flex-1 bg-white"
      data={userProjects}
      keyExtractor={(item) => item.project_id}
      ListHeaderComponent={
        <View className="items-center py-6 border-b border-slate-100">
          <Image
            source={{
              uri:
                profile?.avatar_url ||
                `https://api.dicebear.com/7.x/initials/png?seed=${
                  profile?.display_name || "U"
                }`,
            }}
            className="w-20 h-20 rounded-full bg-slate-200"
            contentFit="cover"
          />
          <Text className="text-xl font-bold text-slate-900 mt-3">
            {profile?.display_name || "User"}
          </Text>
          {profile?.bio && (
            <Text className="text-sm text-slate-400 mt-1 px-6 text-center">
              {profile.bio}
            </Text>
          )}
        </View>
      }
      renderItem={({ item }) => (
        <View className="px-4 pt-3">
          <ProjectCard project={item} />
        </View>
      )}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isLoading || isFetchingNextPage ? (
          <LoadingSpinner />
        ) : null
      }
      ListEmptyComponent={
        !isLoading ? (
          <View className="items-center py-20">
            <Text className="text-slate-400">No projects yet</Text>
          </View>
        ) : null
      }
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}
