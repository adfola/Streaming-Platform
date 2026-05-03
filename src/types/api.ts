/**
 * Shared API types — aligned with the .NET backend at /v1.
 * All service calls and hooks consume these interfaces.
 */

/** ───── Auth ───── */
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
}

/** Raw backend shape returned by /v1/auth/{login,signup}. */
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthUser;
}

/** ───── Catalog ───── */
export interface Host {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  /** Lucide icon name (matches Sidebar/CategoryChips renderer) */
  icon?: string;
  color?: string;
  description?: string;
  iconUrl?: string | null;
  displayOrder?: number;
}

/** ───── Content / Streams ───── */
export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  subtitle?: string;
  thumbnailUrl: string;
  /** HLS playlist URL (.m3u8) */
  streamUrl: string;
  categoryId: string;
  categorySlug: string;
  host: Host;
  viewerCount: number;
  isLive: boolean;
  isFeatured?: boolean;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

/** Raw DTO from backend /v1/content/* endpoints. */
export interface ServiceContentDto {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  streamUrl?: string | null;
  type: string;
  viewerCount: number;
  isLive: boolean;
  isFeatured: boolean;
  createdAt: string;
  broadcasterName?: string | null;
  categoryName?: string | null;
}

/** Payload for POST /v1/content (matches ServiceContentDto, partial). */
export interface CreateContentPayload {
  title: string;
  description?: string;
  thumbnailUrl: string;
  streamUrl: string;
  categoryId: string;
  tags: string[];
  hostName: string;
}

/** Payload for PUT /v1/content/{id} */
export type UpdateContentPayload = Partial<CreateContentPayload>;

/** ───── Chat (mock for now, backend can replace later) ───── */
export interface ChatMessage {
  id: string;
  user: string;
  avatarUrl: string;
  message: string;
  timestamp: number;
  color?: string;
}
