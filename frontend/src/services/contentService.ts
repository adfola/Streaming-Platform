/**
 * Content service — /v1/content/*
 * Normalizes backend ServiceContentDto → ContentItem.
 */
import { apiDelete, apiGet, apiPost, apiPut } from "./apiClient";
import type {
  ContentItem,
  CreateContentPayload,
  ServiceContentDto,
  UpdateContentPayload,
} from "@/types/api";

const FALLBACK_THUMB =
  "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80";
const FALLBACK_AVATAR =
  "https://api.dicebear.com/9.x/initials/svg?seed=Host&backgroundColor=2563eb";
const FALLBACK_STREAM =
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

function slugify(s?: string | null): string {
  return (s ?? "general").toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function mapContent(dto: ServiceContentDto): ContentItem {
  const hostName = dto.broadcasterName ?? "Unknown host";
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? undefined,
    subtitle: dto.categoryName ?? undefined,
    thumbnailUrl: dto.thumbnailUrl || FALLBACK_THUMB,
    streamUrl: dto.streamUrl || FALLBACK_STREAM,
    categoryId: dto.categoryId,
    categorySlug: slugify(dto.categoryName),
    host: {
      id: dto.userId,
      name: hostName,
      avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(hostName)}&backgroundColor=2563eb,7c3aed,db2777`,
    },
    viewerCount: dto.viewerCount ?? 0,
    isLive: dto.isLive,
    isFeatured: dto.isFeatured,
    tags: [],
    createdAt: dto.createdAt,
  };
}

async function safeList(path: string): Promise<ContentItem[]> {
  try {
    const list = await apiGet<ServiceContentDto[]>(path);
    return list.map(mapContent);
  } catch {
    return [];
  }
}

export const contentService = {
  /** GET /v1/content/featured */
  featured: (): Promise<ContentItem[]> => safeList("/content/featured"),

  /** GET /v1/content/live-now */
  liveNow: (): Promise<ContentItem[]> => safeList("/content/live-now"),

  /** GET /v1/content/category/{categoryId} */
  byCategory: (categoryId: string): Promise<ContentItem[]> =>
    safeList(`/content/category/${categoryId}`),

  /** GET /v1/content/{id} */
  getById: async (id: string): Promise<ContentItem> => {
    const dto = await apiGet<ServiceContentDto>(`/content/${id}`);
    return mapContent(dto);
  },

  /** POST /v1/content */
  create: async (payload: CreateContentPayload): Promise<ContentItem> => {
    const body: Partial<ServiceContentDto> = {
      title: payload.title,
      description: payload.description,
      thumbnailUrl: payload.thumbnailUrl,
      streamUrl: payload.streamUrl,
      categoryId: payload.categoryId,
      type: "live",
      isLive: true,
      isFeatured: false,
      viewerCount: 0,
      broadcasterName: payload.hostName,
    };
    const dto = await apiPost<ServiceContentDto, Partial<ServiceContentDto>>(
      "/content",
      body,
    );
    return mapContent(dto);
  },

  /** PUT /v1/content/{id} */
  update: async (
    id: string,
    payload: UpdateContentPayload,
  ): Promise<ContentItem> => {
    const body: Partial<ServiceContentDto> = {
      title: payload.title,
      description: payload.description,
      thumbnailUrl: payload.thumbnailUrl,
      streamUrl: payload.streamUrl,
      categoryId: payload.categoryId,
      broadcasterName: payload.hostName,
    };
    const dto = await apiPut<ServiceContentDto, Partial<ServiceContentDto>>(
      `/content/${id}`,
      body,
    );
    return mapContent(dto);
  },

  /** DELETE /v1/content/{id} */
  remove: (id: string): Promise<void> => apiDelete<void>(`/content/${id}`),
};
