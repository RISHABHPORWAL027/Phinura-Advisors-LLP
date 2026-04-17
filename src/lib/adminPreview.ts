import type { SiteDetails } from "../services/types";

export const ADMIN_PREVIEW_STORAGE_KEY = "phinura_cms_admin_preview_v1";

/**
 * Draft is stored in localStorage (not sessionStorage) so a tab opened via window.open()
 * can read the same payload — sessionStorage is scoped per top-level tab.
 */
export function storeAdminPreviewDraft(details: SiteDetails): void {
  localStorage.setItem(ADMIN_PREVIEW_STORAGE_KEY, JSON.stringify(details));
}

export function readAdminPreviewDraft(): string | null {
  return localStorage.getItem(ADMIN_PREVIEW_STORAGE_KEY);
}

export function clearAdminPreviewDraft(): void {
  try {
    localStorage.removeItem(ADMIN_PREVIEW_STORAGE_KEY);
  } catch {
    // ignore
  }
}
