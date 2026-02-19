import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { extractUrl, createProject } from "@/lib/api/projects";
import { GENRE_CATEGORIES, FIELD_CATEGORIES } from "@/lib/constants";
import {
  Link2,
  Sparkles,
  Check,
  AlertCircle,
  Upload,
} from "lucide-react-native";
import { pickImage } from "@/lib/imagePicker";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function QuickPostScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Extracted data (editable)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [genre, setGenre] = useState("");
  const [field, setField] = useState("");

  const [step, setStep] = useState<"url" | "edit" | "category">("url");

  const handleAnalyze = async () => {
    if (!url.trim()) {
      Alert.alert("오류", "URL을 입력해주세요");
      return;
    }

    if (!user) {
      router.push("/(auth)/login");
      return;
    }

    setAnalyzing(true);
    try {
      const result = await extractUrl(url.trim());
      setTitle(result.title || "");
      setDescription(result.ai_description || result.description || "");
      setThumbnailUrl(result.thumbnail_url);
      setSourceUrl(result.source_url);
      setStep("edit");
    } catch (e: any) {
      Alert.alert("분석 실패", e.message || "URL을 분석할 수 없습니다");
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      Alert.alert("오류", "제목은 필수입니다");
      return;
    }

    setSubmitting(true);
    try {
      await createProject({
        title: title.trim(),
        description: description.trim(),
        thumbnail_url: thumbnailUrl || undefined,
        source_url: sourceUrl || undefined,
        genre: genre || undefined,
        field: field || undefined,
      });
      Alert.alert("게시 완료!", "프로젝트가 등록되었습니다.", [
        { text: "확인", onPress: () => router.replace("/(tabs)") },
      ]);
    } catch (e: any) {
      Alert.alert("실패", e.message || "게시할 수 없습니다");
    } finally {
      setSubmitting(false);
    }
  };

  // Step indicator
  const steps = ["URL", "수정", "카테고리"];
  const stepIndex = step === "url" ? 0 : step === "edit" ? 1 : 2;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step Indicator */}
        <View className="flex-row items-center justify-center mb-6 gap-2">
          {steps.map((s, i) => (
            <View key={s} className="flex-row items-center">
              <View
                className="w-7 h-7 rounded-full items-center justify-center"
                style={{
                  backgroundColor: i <= stepIndex ? "#16A34A" : "#e2e8f0",
                }}
              >
                <Text
                  className="text-xs font-bold"
                  style={{ color: i <= stepIndex ? "#fff" : "#94a3b8" }}
                >
                  {i + 1}
                </Text>
              </View>
              <Text
                className="text-xs ml-1 font-medium"
                style={{ color: i <= stepIndex ? "#16A34A" : "#94a3b8" }}
              >
                {s}
              </Text>
              {i < steps.length - 1 && (
                <View
                  className="w-8 h-0.5 mx-2"
                  style={{
                    backgroundColor: i < stepIndex ? "#16A34A" : "#e2e8f0",
                  }}
                />
              )}
            </View>
          ))}
        </View>

        {/* Step 1: URL Input */}
        {step === "url" && (
          <View>
            <Text className="text-xl font-black text-slate-900 mb-1">
              Quick Post
            </Text>
            <Text className="text-sm text-slate-400 mb-6">
              프로젝트 URL을 입력하면 AI가 자동으로 분석합니다
            </Text>

            <View className="flex-row items-center bg-slate-50 rounded-xl border border-slate-200 px-4 h-14 mb-4">
              <Link2 size={20} color="#94a3b8" />
              <TextInput
                className="flex-1 ml-3 text-base text-slate-900"
                placeholder="https://your-project.com"
                placeholderTextColor="#94a3b8"
                value={url}
                onChangeText={setUrl}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Pressable
              onPress={handleAnalyze}
              disabled={analyzing}
              className="h-14 rounded-full flex-row items-center justify-center gap-2"
              style={{
                backgroundColor: analyzing ? "#86efac" : "#16A34A",
                shadowColor: "#16A34A",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: analyzing ? 0 : 0.3,
                shadowRadius: 12,
                elevation: analyzing ? 0 : 6,
              }}
            >
              <Sparkles size={20} color="#ffffff" />
              <Text className="text-white font-bold text-base">
                {analyzing ? "분석 중..." : "AI 분석"}
              </Text>
            </Pressable>

            {analyzing && (
              <View className="mt-6">
                <LoadingSpinner message="AI가 URL을 분석하고 있습니다..." />
              </View>
            )}
          </View>
        )}

        {/* Step 2: Edit */}
        {step === "edit" && (
          <View>
            <Text className="text-lg font-bold text-slate-900 mb-4">
              내용 확인 및 수정
            </Text>

            {/* Thumbnail Preview */}
            {thumbnailUrl ? (
              <Pressable
                onPress={async () => {
                  const url = await pickImage();
                  if (url) setThumbnailUrl(url);
                }}
              >
                <Image
                  source={{ uri: thumbnailUrl }}
                  className="w-full rounded-2xl mb-4"
                  style={{ aspectRatio: 4 / 3 }}
                  contentFit="cover"
                />
                <Text className="text-xs text-slate-400 text-center -mt-3 mb-3">
                  탭하여 이미지 변경
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={async () => {
                  const url = await pickImage();
                  if (url) setThumbnailUrl(url);
                }}
                className="w-full rounded-2xl mb-4 bg-slate-50 items-center justify-center border-2 border-dashed border-slate-200"
                style={{ aspectRatio: 4 / 3 }}
              >
                <Upload size={24} color="#94a3b8" />
                <Text className="text-sm text-slate-400 mt-2">
                  탭하여 이미지 업로드
                </Text>
              </Pressable>
            )}

            {/* Title */}
            <Text className="text-sm font-semibold text-slate-500 mb-1">
              제목
            </Text>
            <TextInput
              className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 mb-3"
              value={title}
              onChangeText={setTitle}
              placeholder="프로젝트 제목"
              placeholderTextColor="#94a3b8"
            />

            {/* Description */}
            <Text className="text-sm font-semibold text-slate-500 mb-1">
              설명
            </Text>
            <TextInput
              className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 mb-4"
              value={description}
              onChangeText={setDescription}
              placeholder="프로젝트 설명"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              style={{ minHeight: 120 }}
            />

            <Pressable
              onPress={() => setStep("category")}
              className="h-14 rounded-full items-center justify-center"
              style={{ backgroundColor: "#16A34A" }}
            >
              <Text className="text-white font-bold text-base">다음</Text>
            </Pressable>

            <Pressable
              onPress={() => setStep("url")}
              className="mt-3 items-center"
            >
              <Text className="text-slate-400 text-sm">이전</Text>
            </Pressable>
          </View>
        )}

        {/* Step 3: Category */}
        {step === "category" && (
          <View>
            <Text className="text-lg font-bold text-slate-900 mb-4">
              카테고리 선택
            </Text>

            <Text className="text-sm font-semibold text-slate-500 mb-2">
              장르
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-5">
              {GENRE_CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.value}
                  onPress={() =>
                    setGenre(genre === cat.value ? "" : cat.value)
                  }
                  className="px-3.5 py-2 rounded-full"
                  style={{
                    backgroundColor:
                      genre === cat.value ? "#16A34A" : "#f8fafc",
                    borderWidth: 1,
                    borderColor:
                      genre === cat.value ? "#16A34A" : "#e2e8f0",
                  }}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: genre === cat.value ? "#fff" : "#64748b",
                    }}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text className="text-sm font-semibold text-slate-500 mb-2">
              분야
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              {FIELD_CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.value}
                  onPress={() =>
                    setField(field === cat.value ? "" : cat.value)
                  }
                  className="px-3.5 py-2 rounded-full"
                  style={{
                    backgroundColor:
                      field === cat.value ? "#16A34A" : "#f8fafc",
                    borderWidth: 1,
                    borderColor:
                      field === cat.value ? "#16A34A" : "#e2e8f0",
                  }}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: field === cat.value ? "#fff" : "#64748b",
                    }}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={handlePublish}
              disabled={submitting}
              className="h-14 rounded-full flex-row items-center justify-center gap-2"
              style={{
                backgroundColor: submitting ? "#86efac" : "#16A34A",
                shadowColor: "#16A34A",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: submitting ? 0 : 0.3,
                shadowRadius: 12,
                elevation: submitting ? 0 : 6,
              }}
            >
              <Check size={20} color="#ffffff" />
              <Text className="text-white font-bold text-base">
                {submitting ? "게시 중..." : "게시하기"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setStep("edit")}
              className="mt-3 items-center"
            >
              <Text className="text-slate-400 text-sm">이전</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
