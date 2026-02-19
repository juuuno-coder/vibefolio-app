import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Calendar, MapPin, ChevronRight } from "lucide-react-native";
import dayjs from "dayjs";
import type { RecruitItem } from "@/lib/api/recruit";

interface Props {
  item: RecruitItem;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

function getDDay(dateStr: string | null): {
  text: string;
  isExpired: boolean;
  isDDay: boolean;
} {
  if (!dateStr) return { text: "상시", isExpired: false, isDDay: false };
  const diff = dayjs(dateStr).diff(dayjs(), "day");
  if (diff < 0) return { text: "마감", isExpired: true, isDDay: false };
  if (diff === 0) return { text: "D-DAY", isExpired: false, isDDay: true };
  return { text: `D-${diff}`, isExpired: false, isDDay: false };
}

function getTypeBadge(type: string) {
  switch (type) {
    case "job":
      return { label: "채용", bg: "#eff6ff", text: "#2563eb", icon: "💼" };
    case "contest":
      return { label: "공모전", bg: "#f5f3ff", text: "#7c3aed", icon: "🏆" };
    default:
      return { label: "이벤트", bg: "#ecfdf5", text: "#16a34a", icon: "🎉" };
  }
}

export function RecruitCard({ item }: Props) {
  const router = useRouter();
  const dday = getDDay(item.date);
  const badge = getTypeBadge(item.type);

  return (
    <Pressable
      onPress={() => router.push(`/recruit/${item.id}`)}
      className="bg-white rounded-2xl overflow-hidden mb-3 flex-row"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {/* Thumbnail */}
      <View className="relative">
        {item.thumbnail ? (
          <Image
            source={{ uri: item.thumbnail }}
            className="h-full"
            style={{ width: 110, aspectRatio: 3 / 4 }}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View
            className="bg-slate-100 items-center justify-center"
            style={{ width: 110, height: "100%", minHeight: 140 }}
          >
            <Text className="text-2xl">{badge.icon}</Text>
          </View>
        )}
        {/* D-Day badge on thumbnail */}
        <View
          className="absolute top-2 left-2 px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: dday.isExpired
              ? "#cbd5e1"
              : dday.isDDay
                ? "#ef4444"
                : "#0f172a",
          }}
        >
          <Text className="text-[10px] font-bold text-white">{dday.text}</Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 p-3 justify-between">
        <View>
          {/* Type badge + company */}
          <View className="flex-row items-center gap-2 mb-1.5">
            <View
              className="px-2 py-0.5 rounded"
              style={{ backgroundColor: badge.bg }}
            >
              <Text
                className="text-[10px] font-bold"
                style={{ color: badge.text }}
              >
                {badge.label}
              </Text>
            </View>
            {item.company && (
              <Text
                className="text-[11px] font-bold text-green-600"
                numberOfLines={1}
              >
                {item.company}
              </Text>
            )}
          </View>

          {/* Title */}
          <Text
            className="text-[14px] font-bold text-slate-900 leading-[18px]"
            numberOfLines={2}
          >
            {item.title}
          </Text>

          {/* Description preview */}
          {item.description && (
            <Text className="text-[11px] text-slate-400 mt-1" numberOfLines={1}>
              {item.description}
            </Text>
          )}
        </View>

        {/* Footer meta */}
        <View className="flex-row items-center mt-2 gap-3">
          {item.date && (
            <View className="flex-row items-center gap-1">
              <Calendar size={11} color="#94a3b8" />
              <Text className="text-[10px] text-slate-400">
                ~{dayjs(item.date).format("MM.DD")}
              </Text>
            </View>
          )}
          {item.location && (
            <View className="flex-row items-center gap-1">
              <MapPin size={11} color="#94a3b8" />
              <Text
                className="text-[10px] text-slate-400"
                numberOfLines={1}
              >
                {item.location}
              </Text>
            </View>
          )}
          <View className="flex-1" />
          <ChevronRight size={14} color="#cbd5e1" />
        </View>
      </View>
    </Pressable>
  );
}
