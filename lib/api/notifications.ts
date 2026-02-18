import { fetchAPI } from "./client";

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  action_label?: string;
  action_url?: string;
  created_at: string;
  sender_id?: string;
}

export async function getNotifications(
  limit = 50,
  offset = 0
): Promise<{ notifications: AppNotification[] }> {
  return fetchAPI(`/notifications?limit=${limit}&offset=${offset}`);
}

export async function markNotificationRead(
  notificationId: string
): Promise<void> {
  await fetchAPI("/notifications", {
    method: "PUT",
    body: JSON.stringify({ notificationId }),
  });
}

export async function markAllNotificationsRead(): Promise<void> {
  await fetchAPI("/notifications", {
    method: "PUT",
    body: JSON.stringify({ markAllRead: true }),
  });
}
