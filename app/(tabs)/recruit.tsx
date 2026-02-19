import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, X } from "lucide-react-native";
import { getRecruitItems, type RecruitItem } from "@/lib/api/recruit";
import { RecruitCard } from "@/components/ui/RecruitCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useState, useCallback } from "react";

const LIMIT = 20;
const TABS = [
  { key: "all", label: "전체" },
  { key: "job", label: "채용" },
  { key: "contest", label: "공모전" },
  { key: "event", label: "이벤트" },
];

export default function RecruitScreen() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["recruit", activeTab, search],
    queryFn: ({ pageParam = 1 }) =>
      getRecruitItems({
        page: pageParam,
        limit: LIMIT,
        type: activeTab,
        search,
        sort: "deadline",
      }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  });

  const items: RecruitItem[] =
    data?.pages.flatMap((page) => page.items) ?? [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleSearch = useCallback(() => {
    setSearch(searchInput.trim());
  }, [searchInput]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-3 pb-2">
        <Text className="text-xl font-black text-slate-900">연결하기</Text>
        <Text className="text-xs text-slate-400 mt-0.5">
          채용, 공모전, 이벤트를 한곳에서
        </Text>
      </View>

      {/* Search */}
      <View className="px-4 mb-2">
        <View
          className="flex-row items-center bg-slate-50 rounded-xl px-3.5 h-11"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.03,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          <Search size={16} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-2 text-sm text-slate-900"
            placeholder="검색어를 입력하세요..."
            placeholderTextColor="#94a3b8"
            value={searchInput}
            onChangeText={setSearchInput}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchInput.length > 0 && (
            <Pressable
              onPress={() => {
                setSearchInput("");
                setSearch("");
              }}
            >
              <X size={16} color="#94a3b8" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 mb-2"
        contentContainerStyle={{ gap: 8, paddingRight: 16 }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              className="px-4 py-2 rounded-full flex-row items-center gap-1.5"
              style={{
                backgroundColor: isActive ? "#0f172a" : "#f8fafc",
                borderWidth: isActive ? 0 : 1,
                borderColor: "#e2e8f0",
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: isActive ? "#ffffff" : "#64748b" }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Search result indicator */}
      {search && (
        <View className="flex-row items-center px-4 py-2 bg-green-50 mx-4 rounded-lg mb-2">
          <Text className="text-xs text-green-700 flex-1">
            "<Text className="font-bold">{search}</Text>" 검색 결과
          </Text>
          <Pressable
            onPress={() => {
              setSearch("");
              setSearchInput("");
            }}
          >
            <Text className="text-xs text-red-400 font-semibold">취소</Text>
          </Pressable>
        </View>
      )}

      {/* List */}
      {isLoading ? (
        <LoadingSpinner message="불러오는 중..." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View className="px-4">
              <RecruitCard item={item} />
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
              <LoadingSpinner message="더 불러오는 중..." />
            ) : !hasNextPage && items.length > 0 ? (
              <View className="py-8 items-center">
                <Text className="text-slate-300 text-sm">
                  모든 항목을 불러왔습니다
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-3xl mb-3">{"🔍"}</Text>
              <Text className="text-slate-400 text-base">
                검색 결과가 없습니다
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 4 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
