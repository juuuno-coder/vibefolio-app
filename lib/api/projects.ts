import { fetchAPI } from "./client";

export interface Project {
  project_id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  genre: string | null;
  field: string | null;
  tags: string[];
  source_url: string | null;
  visibility: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  user?: {
    id: string;
    display_name: string;
    avatar_url: string | null;
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
}): Promise<ProjectsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.genre) query.set("genre", params.genre);
  if (params.field) query.set("field", params.field);
  if (params.sort) query.set("sort", params.sort);
  if (params.search) query.set("search", params.search);

  return fetchAPI<ProjectsResponse>(`/projects?${query.toString()}`);
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
