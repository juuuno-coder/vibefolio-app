import { fetchAPI } from "./client";

export interface Project {
  project_id: string;
  title: string;
  description: string | null;
  content_text: string | null;
  thumbnail_url: string | null;
  category_id: number | null;
  visibility: string;
  views_count: number;
  likes_count: number;
  created_at: string;
  user_id: string;
  custom_data: any;
  // Joined user info from API
  users?: {
    username: string;
    avatar_url: string;
    expertise: string | null;
  };
  User?: {
    username: string;
    avatar_url: string;
    expertise: string | null;
  };
}

// Raw API response shape
interface ProjectsAPIResponse {
  projects: Project[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  hasMore: boolean;
}

export async function getProjects(params: {
  page?: number;
  limit?: number;
  genre?: string;
  field?: string;
  sort?: string;
  search?: string;
  userId?: string;
}): Promise<ProjectsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.genre) query.set("category", params.genre);
  if (params.field) query.set("field", params.field);
  if (params.sort) query.set("sortBy", params.sort);
  if (params.search) query.set("search", params.search);
  if (params.userId) query.set("userId", params.userId);

  const raw = await fetchAPI<ProjectsAPIResponse>(
    `/projects?${query.toString()}`
  );
  return {
    projects: raw.projects || [],
    total: raw.metadata?.total || 0,
    hasMore: raw.metadata?.hasMore || false,
  };
}

export async function getProject(id: string): Promise<Project> {
  return fetchAPI<Project>(`/projects/${id}`);
}

export async function createProject(data: {
  title: string;
  description: string;
  thumbnail_url?: string;
  genre?: string;
  field?: string;
  tags?: string[];
  source_url?: string;
}): Promise<Project> {
  return fetchAPI<Project>("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function extractUrl(url: string): Promise<{
  title: string;
  description: string;
  ai_description: string;
  thumbnail_url: string | null;
  source_url: string;
  site_name: string | null;
}> {
  return fetchAPI("/projects/extract-url", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}
