import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.list(),
    staleTime: 5 * 60_000,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: ["categories", "slug", slug],
    queryFn: () => categoryService.getBySlug(slug),
    enabled: !!slug,
  });
}
