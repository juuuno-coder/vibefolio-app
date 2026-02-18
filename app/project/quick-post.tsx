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
} from "lucide-react-native";
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
      Alert.alert("Error", "Please enter a URL");
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
      Alert.alert("Analysis Failed", e.message || "Could not analyze the URL");
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Title is required");
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
      Alert.alert("Published!", "Your project has been posted.", [
        { text: "OK", onPress: () => router.replace("/(tabs)") },
      ]);
    } catch (e: any) {
      Alert.alert("Failed", e.message || "Could not publish");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step 1: URL Input */}
        {step === "url" && (
          <View>
            <Text className="text-xl font-black text-slate-900 mb-1">
              Quick Post
            </Text>
            <Text className="text-sm text-slate-400 mb-6">
              Paste your project URL and AI will create a post for you
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
              className={`h-14 rounded-xl flex-row items-center justify-center gap-2 ${
                analyzing ? "bg-indigo-300" : "bg-indigo-500"
              }`}
            >
              <Sparkles size={20} color="#ffffff" />
              <Text className="text-white font-bold text-base">
                {analyzing ? "Analyzing..." : "AI Analyze"}
              </Text>
            </Pressable>

            {analyzing && (
              <View className="mt-6">
                <LoadingSpinner message="AI is analyzing the URL..." />
              </View>
            )}
          </View>
        )}

        {/* Step 2: Edit */}
        {step === "edit" && (
          <View>
            <Text className="text-lg font-bold text-slate-900 mb-4">
              Review & Edit
            </Text>

            {/* Thumbnail Preview */}
            {thumbnailUrl ? (
              <Image
                source={{ uri: thumbnailUrl }}
                className="w-full h-48 rounded-xl mb-4"
                contentFit="cover"
              />
            ) : (
              <View className="w-full h-48 rounded-xl mb-4 bg-slate-100 items-center justify-center">
                <AlertCircle size={24} color="#94a3b8" />
                <Text className="text-sm text-slate-400 mt-2">
                  No thumbnail available
                </Text>
              </View>
            )}

            {/* Title */}
            <Text className="text-sm font-semibold text-slate-500 mb-1">
              Title
            </Text>
            <TextInput
              className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 mb-3"
              value={title}
              onChangeText={setTitle}
              placeholder="Project title"
              placeholderTextColor="#94a3b8"
            />

            {/* Description */}
            <Text className="text-sm font-semibold text-slate-500 mb-1">
              Description
            </Text>
            <TextInput
              className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 mb-4"
              value={description}
              onChangeText={setDescription}
              placeholder="Project description"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              style={{ minHeight: 120 }}
            />

            <Pressable
              onPress={() => setStep("category")}
              className="h-14 rounded-xl bg-indigo-500 items-center justify-center"
            >
              <Text className="text-white font-bold text-base">Next</Text>
            </Pressable>

            <Pressable
              onPress={() => setStep("url")}
              className="mt-3 items-center"
            >
              <Text className="text-slate-400 text-sm">Back</Text>
            </Pressable>
          </View>
        )}

        {/* Step 3: Category */}
        {step === "category" && (
          <View>
            <Text className="text-lg font-bold text-slate-900 mb-4">
              Select Category
            </Text>

            <Text className="text-sm font-semibold text-slate-500 mb-2">
              Genre
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {GENRE_CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.value}
                  onPress={() =>
                    setGenre(genre === cat.value ? "" : cat.value)
                  }
                  className={`px-3 py-2 rounded-lg ${
                    genre === cat.value
                      ? "bg-indigo-500"
                      : "bg-slate-100"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      genre === cat.value ? "text-white" : "text-slate-600"
                    }`}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text className="text-sm font-semibold text-slate-500 mb-2">
              Field
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              {FIELD_CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.value}
                  onPress={() =>
                    setField(field === cat.value ? "" : cat.value)
                  }
                  className={`px-3 py-2 rounded-lg ${
                    field === cat.value
                      ? "bg-indigo-500"
                      : "bg-slate-100"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      field === cat.value ? "text-white" : "text-slate-600"
                    }`}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={handlePublish}
              disabled={submitting}
              className={`h-14 rounded-xl flex-row items-center justify-center gap-2 ${
                submitting ? "bg-indigo-300" : "bg-indigo-500"
              }`}
            >
              <Check size={20} color="#ffffff" />
              <Text className="text-white font-bold text-base">
                {submitting ? "Publishing..." : "Publish"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setStep("edit")}
              className="mt-3 items-center"
            >
              <Text className="text-slate-400 text-sm">Back</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
