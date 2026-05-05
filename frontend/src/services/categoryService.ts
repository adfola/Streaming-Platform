/**
 * Category service — /v1/categories.
 */
import { apiGet } from "./apiClient";
import type { Category } from "@/types/api";

export const categoryService = {
  /** GET /v1/categories */
  list: (): Promise<Category[]> => apiGet<Category[]>("/categories"),

  /** GET /v1/categories/{id} */
  getById: (id: string): Promise<Category> =>
    apiGet<Category>(`/categories/${id}`),

  /** GET /v1/categories/slug/{slug} */
  getBySlug: (slug: string): Promise<Category> =>
    apiGet<Category>(`/categories/slug/${encodeURIComponent(slug)}`),
};
