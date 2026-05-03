/**
 * Content hooks — TanStack Query wrappers around contentService.
 * One unified ContentItem powers featured, live grid, and watch page.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contentService } from "@/services";
import type { CreateContentPayload, UpdateContentPayload } from "@/types/api";

export const contentKeys = {
  all: ["content"] as const,
  featured: () => [...contentKeys.all, "featured"] as const,
  liveNow: () => [...contentKeys.all, "live-now"] as const,
  byCategory: (id: string) => [...contentKeys.all, "category", id] as const,
  detail: (id: string) => [...contentKeys.all, "detail", id] as const,
};

export function useFeaturedContent() {
  return useQuery({
    queryKey: contentKeys.featured(),
    queryFn: () => contentService.featured(),
    staleTime: 60_000,
  });
}

export function useLiveNow() {
  return useQuery({
    queryKey: contentKeys.liveNow(),
    queryFn: () => contentService.liveNow(),
    staleTime: 30_000,
  });
}

export function useContentByCategory(categoryId: string | null) {
  return useQuery({
    queryKey: contentKeys.byCategory(categoryId ?? ""),
    queryFn: () => contentService.byCategory(categoryId as string),
    enabled: !!categoryId,
    staleTime: 30_000,
  });
}

export function useContentItem(id: string) {
  return useQuery({
    queryKey: contentKeys.detail(id),
    queryFn: () => contentService.getById(id),
    enabled: !!id,
  });
}

export function useCreateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateContentPayload) => contentService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKeys.all }),
  });
}

export function useUpdateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; payload: UpdateContentPayload }) =>
      contentService.update(input.id, input.payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKeys.all }),
  });
}

export function useDeleteContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contentService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKeys.all }),
  });
}
