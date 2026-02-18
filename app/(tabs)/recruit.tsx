import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  RefreshControl,
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
  { key: "all", label: "All" },
  { key: "job", label: "Job" },
  { key: "contest", label: "Contest" },
  { key: "event", label: "Event" },
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
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      {/* Header */}
      <View className="px-4 py-3">
        <Text className="text-2xl font-black text-slate-900">Recruit</Text>
      </View>

      {/* Search */}
      <View className="px-4 mb-2">
        <View className="flex-row items-center bg-white rounded-xl border border-slate-200 px-3 h-11">
          <Search size={18} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-2 text-sm text-slate-900"
            placeholder="Search..."
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
              <X size={18} color="#94a3b8" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 mb-3 gap-2">
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full ${
              activeTab === tab.key ? "bg-indigo-500" : "bg-white border border-slate-200"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                activeTab === tab.key ? "text-white" : "text-slate-600"
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* List */}
      {isLoading ? (
        <LoadingSpinner message="Loading..." />
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <LoadingSpinner message="Loading more..." />
            ) : null
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-slate-400 text-base">No items found</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}
