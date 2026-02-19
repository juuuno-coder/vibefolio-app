import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/lib/auth/AuthContext";
import {
  registerForPushNotifications,
  savePushToken,
} from "@/lib/notifications";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import "../global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

function PushNotificationHandler() {
  const { user } = useAuth();
  const router = useRouter();
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    if (!user) return;

    // Register push token when user logs in
    registerForPushNotifications().then((token) => {
      if (token) savePushToken(token);
    });

    // Handle notification tap (deep link to content)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response: Notifications.NotificationResponse) => {
        const data = response.notification.request.content.data as Record<string, string>;
        if (data?.url) {
          router.push(data.url as string);
        } else if (data?.projectId) {
          router.push(`/project/${data.projectId}`);
        } else if (data?.recruitId) {
          router.push(`/recruit/${data.recruitId}`);
        }
      });

    return () => {
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [user, router]);

  return null;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar style="dark" />
        <PushNotificationHandler />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#ffffff" },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" options={{ presentation: "modal" }} />
          <Stack.Screen
            name="project/[id]"
            options={{
              headerShown: true,
              headerTitle: "",
              headerBackTitle: "뒤로",
              headerTintColor: "#16A34A",
              headerStyle: { backgroundColor: "#ffffff" },
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="recruit/[id]"
            options={{
              headerShown: true,
              headerTitle: "",
              headerBackTitle: "뒤로",
              headerTintColor: "#16A34A",
              headerStyle: { backgroundColor: "#ffffff" },
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="user/[id]"
            options={{
              headerShown: true,
              headerTitle: "",
              headerBackTitle: "뒤로",
              headerTintColor: "#16A34A",
              headerStyle: { backgroundColor: "#ffffff" },
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="project/quick-post"
            options={{
              headerShown: true,
              headerTitle: "Quick Post",
              headerBackTitle: "뒤로",
              headerTintColor: "#16A34A",
              headerStyle: { backgroundColor: "#ffffff" },
              headerShadowVisible: false,
              headerTitleStyle: { fontWeight: "700", color: "#0f172a" },
            }}
          />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}
