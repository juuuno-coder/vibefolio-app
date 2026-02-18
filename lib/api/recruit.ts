import { fetchAPI } from "./client";

export interface RecruitItem {
  id: number;
  title: string;
  description: string | null;
  type: "job" | "contest" | "event";
  company: string | null;
  location: string | null;
  salary: string | null;
  date: string | null;
  source_url: string | null;
  thumbnail: string | null;
  is_active: boolean;
  is_approved: boolean;
  tags: string[] | null;
  created_at: string;
}

export interface RecruitResponse {
  items: RecruitItem[];
  total: number;
  hasMore: boolean;
}

export async function getRecruitItems(params: {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
  sort?: string;
}): Promise<RecruitResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.type && params.type !== "all") query.set("type", params.type);
  if (params.search) query.set("search", params.search);
  if (params.sort) query.set("sort", params.sort);

  return fetchAPI<RecruitResponse>(`/recruit-items?${query.toString()}`);
}

export async function getRecruitItem(id: number): Promise<RecruitItem> {
  return fetchAPI<RecruitItem>(`/recruit-items/${id}`);
}
