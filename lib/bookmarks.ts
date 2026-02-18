import { supabase } from "./supabase";

export async function getUserBookmarks(userId: string): Promise<string[]> {
  const { data } = await supabase
    .from("bookmark")
    .select("project_id")
    .eq("user_id", userId);

  return (data || []).map((b) => b.project_id);
}

export async function toggleBookmark(projectId: string): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다");

  const { data: existing } = await supabase
    .from("bookmark")
    .select("id")
    .eq("user_id", user.id)
    .eq("project_id", projectId)
    .single();

  if (existing) {
    await supabase.from("bookmark").delete().eq("id", existing.id);
    return false;
  } else {
    await supabase
      .from("bookmark")
      .insert({ user_id: user.id, project_id: projectId });
    return true;
  }
}

export async function getUserRecruitBookmarks(
  userId: string
): Promise<number[]> {
  const { data } = await supabase
    .from("recruit_bookmark")
    .select("recruit_item_id")
    .eq("user_id", userId);

  return (data || []).map((b) => b.recruit_item_id);
}

export async function toggleRecruitBookmark(
  itemId: number
): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다");

  const { data: existing } = await supabase
    .from("recruit_bookmark")
    .select("id")
    .eq("user_id", user.id)
    .eq("recruit_item_id", itemId)
    .single();

  if (existing) {
    await supabase.from("recruit_bookmark").delete().eq("id", existing.id);
    return false;
  } else {
    await supabase
      .from("recruit_bookmark")
      .insert({ user_id: user.id, recruit_item_id: itemId });
    return true;
  }
}
