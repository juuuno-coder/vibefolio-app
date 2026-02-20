import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Plus,
  Bell,
  Search,
  Heart,
  Layers,
  Camera,
  Wand2,
  Palette,
  PenTool,
  Video,
  Film,
  Headphones,
  Box,
  FileText,
  Code,
  Smartphone,
  Gamepad2,
  Clock,
  Flame,
  Eye,
  ChevronDown,
} from "lucide-react-native";
import { getProjects, type Project } from "@/lib/api/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { LoadingSpinner, SkeletonCard } from "@/components/ui/LoadingSpinner";
import { useState, useCallback, useMemo } from "react";

const LIMIT = 20;

const CATEGORIES = [
  { value: "all", label: "전체보기", Icon: Layers },
  { value: "photo", label: "포토", Icon: Camera },
  { value: "animation", label: "웹툰/애니", Icon: Wand2 },
  { value: "graphic", label: "그래픽", Icon: Palette },
  { value: "design", label: "디자인", Icon: PenTool },
  { value: "video", label: "영상", Icon: Video },
  { value: "cinema", label: "영화·드라마", Icon: Film },
  { value: "audio", label: "오디오", Icon: Headphones },
  { value: "3d", label: "3D", Icon: Box },
  { value: "text", label: "텍스트", Icon: FileText },
  { value: "code", label: "코드", Icon: Code },
  { value: "webapp", label: "웹/앱", Icon: Smartphone },
  { value: "game", label: "게임", Icon: Gamepad2 },
] as const;

const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "인기순" },
  { value: "likes", label: "좋아요순" },
  { value: "views", label: "조회순" },
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<string>("latest");
  const [showSort, setShowSort] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["projects", category, sort],
    queryFn: ({ pageParam = 1 }) =>
      getProjects({
        page: pageParam,
        limit: LIMIT,
        sort,
        genre: category === "all" ? undefined : category,
      }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  });

  const projects: Project[] =
    data?.pages.flatMap((page) => page.projects) ?? [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const sortLabel = useMemo(
    () => SORT_OPTIONS.find((s) => s.value === sort)?.label || "최신순",
    [sort]
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header - 56px like web mobile */}
      <View
        className="flex-row items-center justify-between px-4"
        style={{ height: 56 }}
      >
        <View className="flex-row items-center gap-2">
          <View className="w-7 h-7 rounded-lg bg-green-600 items-center justify-center">
            <Text className="text-white font-black text-xs">V</Text>
          </View>
          <Text className="text-lg font-black text-gray-900">Vibefolio</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Pressable
            onPress={() => {}}
            className="w-9 h-9 rounded-full items-center justify-center"
          >
            <Search size={20} color="#6b7280" />
          </Pressable>
          <Pressable
            onPress={() => {}}
            className="w-9 h-9 rounded-full items-center justify-center"
          >
            <Bell size={20} color="#6b7280" />
          </Pressable>
          <Pressable
            onPress={() => router.push("/project/quick-post")}
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: "#16A34A" }}
          >
            <Plus size={18} color="#ffffff" />
          </Pressable>
        </View>
      </View>

      {/* Category Filter Bar - matching web StickyMenu */}
      <View
        className="border-b border-gray-100"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.03,
          shadowRadius: 3,
          elevation: 1,
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8, gap: 4 }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = category === cat.value;
            const IconComp = cat.Icon;
            return (
              <Pressable
                key={cat.value}
                onPress={() => setCategory(cat.value)}
                className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: isActive ? "#f0fdf4" : "transparent",
                }}
              >
                <IconComp
                  size={14}
                  color={isActive ? "#16A34A" : "#94a3b8"}
                />
                <Text
                  className="text-xs"
                  style={{
                    color: isActive ? "#15803d" : "#64748b",
                    fontWeight: isActive ? "700" : "500",
                  }}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Sort row */}
        <View className="flex-row items-center justify-between px-4 pb-2">
          <View className="flex-1" />
          <Pressable
            onPress={() => setShowSort(!showSort)}
            className="flex-row items-center gap-1 px-2 py-1 rounded-md"
            style={{
              backgroundColor: showSort ? "#f0fdf4" : "transparent",
            }}
          >
            <Text
              className="text-[11px]"
              style={{
                color: showSort ? "#16A34A" : "#6b7280",
                fontWeight: "600",
              }}
            >
              {sortLabel}
            </Text>
            <ChevronDown
              size={12}
              color={showSort ? "#16A34A" : "#6b7280"}
            />
          </Pressable>
        </View>

        {/* Sort dropdown */}
        {showSort && (
          <View className="absolute right-3 top-full bg-white rounded-xl z-50 py-1"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.12,
              shadowRadius: 12,
              elevation: 8,
              borderWidth: 1,
              borderColor: "#f1f5f9",
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => {
                  setSort(opt.value);
                  setShowSort(false);
                }}
                className="px-4 py-2.5"
                style={{
                  backgroundColor: sort === opt.value ? "#f0fdf4" : "transparent",
                }}
              >
                <Text
                  className="text-xs"
                  style={{
                    color: sort === opt.value ? "#16A34A" : "#374151",
                    fontWeight: sort === opt.value ? "600" : "400",
                  }}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Feed */}
      {isLoading ? (
        <View className="px-2 pt-8">
          <SkeletonCard />
          <View style={{ height: 32 }} />
          <SkeletonCard />
          <View style={{ height: 32 }} />
          <SkeletonCard />
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.project_id}
          renderItem={({ item }) => (
            <View className="px-2">
              <ProjectCard project={item} />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 40 }} />}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.3}
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
                <LoadingSpinner message="더 많은 프로젝트 불러오는 중..." />
              </View>
            ) : !hasNextPage && projects.length > 0 ? (
              <View className="py-10 items-center">
                <Text className="text-gray-400 text-sm">
                  모든 프로젝트를 불러왔습니다
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-gray-400 text-base">
                프로젝트가 없습니다
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingTop: 32, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
