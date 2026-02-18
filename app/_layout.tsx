import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth/AuthContext";
import "../global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#f8fafc" },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" options={{ presentation: "modal" }} />
          <Stack.Screen
            name="project/[id]"
            options={{ headerShown: true, headerTitle: "", headerBackTitle: "Back" }}
          />
          <Stack.Screen
            name="recruit/[id]"
            options={{ headerShown: true, headerTitle: "", headerBackTitle: "Back" }}
          />
          <Stack.Screen
            name="user/[id]"
            options={{ headerShown: true, headerTitle: "", headerBackTitle: "Back" }}
          />
          <Stack.Screen
            name="project/quick-post"
            options={{ headerShown: true, headerTitle: "Quick Post", headerBackTitle: "Back" }}
          />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}
