import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Calendar, MapPin, Building2 } from "lucide-react-native";
import dayjs from "dayjs";
import type { RecruitItem } from "@/lib/api/recruit";

interface Props {
  item: RecruitItem;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

function getDDay(dateStr: string | null): { text: string; isExpired: boolean } {
  if (!dateStr) return { text: "상시", isExpired: false };
  const diff = dayjs(dateStr).diff(dayjs(), "day");
  if (diff < 0) return { text: "마감", isExpired: true };
  if (diff === 0) return { text: "D-Day", isExpired: false };
  return { text: `D-${diff}`, isExpired: false };
}

function getTypeBadge(type: string) {
  switch (type) {
    case "job":
      return { label: "채용", color: "#3b82f6" };
    case "contest":
      return { label: "공모전", color: "#8b5cf6" };
    default:
      return { label: "이벤트", color: "#f59e0b" };
  }
}

export function RecruitCard({ item, isBookmarked, onToggleBookmark }: Props) {
  const router = useRouter();
  const dday = getDDay(item.date);
  const badge = getTypeBadge(item.type);

  return (
    <Pressable
      onPress={() => router.push(`/recruit/${item.id}`)}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 mb-3"
    >
      {item.thumbnail && (
        <Image
          source={{ uri: item.thumbnail }}
          className="w-full h-36"
          contentFit="cover"
          transition={200}
        />
      )}
      <View className="p-3">
        <View className="flex-row items-center gap-2 mb-1">
          <View
            className="px-2 py-0.5 rounded-full"
            style={{ backgroundColor: badge.color + "20" }}
          >
            <Text
              className="text-xs font-bold"
              style={{ color: badge.color }}
            >
              {badge.label}
            </Text>
          </View>
          <View
            className="px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: dday.isExpired ? "#fee2e2" : "#ecfdf5",
            }}
          >
            <Text
              className="text-xs font-bold"
              style={{ color: dday.isExpired ? "#ef4444" : "#10b981" }}
            >
              {dday.text}
            </Text>
          </View>
        </View>

        <Text className="text-base font-bold text-slate-900 mt-1" numberOfLines={2}>
          {item.title}
        </Text>

        {item.company && (
          <View className="flex-row items-center gap-1 mt-1.5">
            <Building2 size={13} color="#94a3b8" />
            <Text className="text-sm text-slate-500">{item.company}</Text>
          </View>
        )}

        {item.date && (
          <View className="flex-row items-center gap-1 mt-1">
            <Calendar size={13} color="#94a3b8" />
            <Text className="text-sm text-slate-400">
              ~ {dayjs(item.date).format("YYYY.MM.DD")}
            </Text>
          </View>
        )}

        {item.location && (
          <View className="flex-row items-center gap-1 mt-1">
            <MapPin size={13} color="#94a3b8" />
            <Text className="text-sm text-slate-400">{item.location}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
