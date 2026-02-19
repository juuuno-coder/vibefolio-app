import { View, Text, FlatList, Pressable, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Bell } from "lucide-react-native";
import { getProjects, type Project } from "@/lib/api/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { LoadingSpinner, SkeletonCard } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/lib/auth/AuthContext";
import { useState } from "react";

const LIMIT = 20;

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: ({ pageParam = 1 }) =>
      getProjects({ page: pageParam, limit: LIMIT, sort: "latest" }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  });

  const projects: Project[] =
    data?.pages.flatMap((page) => page.projects) ?? [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-lg bg-green-600 items-center justify-center">
            <Text className="text-white font-black text-sm">V</Text>
          </View>
          <Text className="text-xl font-black text-slate-900">Vibefolio</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => {}}
            className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center"
          >
            <Bell size={20} color="#64748b" />
          </Pressable>
          <Pressable
            onPress={() => router.push("/project/quick-post")}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: "#16A34A" }}
          >
            <Plus size={20} color="#ffffff" />
          </Pressable>
        </View>
      </View>

      {/* Feed */}
      {isLoading ? (
        <View className="px-4 pt-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.project_id}
          renderItem={({ item }) => (
            <View className="px-4">
              <ProjectCard project={item} />
            </View>
          )}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#16A34A"
              colors={["#16A34A"]}
            />
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-6 items-center">
                <LoadingSpinner message="더 불러오는 중..." />
              </View>
            ) : !hasNextPage && projects.length > 0 ? (
              <View className="py-8 items-center">
                <Text className="text-slate-300 text-sm">
                  모든 프로젝트를 불러왔습니다
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-3xl mb-3">{"🎨"}</Text>
              <Text className="text-slate-400 text-base">
                아직 프로젝트가 없습니다
              </Text>
              <Pressable
                onPress={() => router.push("/project/quick-post")}
                className="mt-4 px-6 py-2.5 rounded-full"
                style={{ backgroundColor: "#16A34A" }}
              >
                <Text className="text-white font-bold text-sm">
                  첫 프로젝트 올리기
                </Text>
              </Pressable>
            </View>
          }
          contentContainerStyle={{ paddingTop: 4, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
