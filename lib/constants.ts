export const API_BASE = "https://vibefolio.net/api";
export const BASE_URL = "https://vibefolio.net";

export const GENRE_CATEGORIES = [
  { value: "photo", label: "포토" },
  { value: "animation", label: "애니메이션" },
  { value: "graphic", label: "그래픽" },
  { value: "design", label: "디자인" },
  { value: "video", label: "비디오" },
  { value: "cinema", label: "시네마" },
  { value: "audio", label: "오디오" },
  { value: "3d", label: "3D" },
  { value: "text", label: "텍스트" },
  { value: "code", label: "코드" },
  { value: "webapp", label: "웹앱" },
  { value: "game", label: "게임" },
] as const;

export const FIELD_CATEGORIES = [
  { value: "developer", label: "개발" },
  { value: "designer", label: "디자인" },
  { value: "planner", label: "기획" },
  { value: "marketer", label: "마케팅" },
  { value: "creator", label: "크리에이터" },
  { value: "student", label: "학생" },
  { value: "other", label: "기타" },
] as const;
