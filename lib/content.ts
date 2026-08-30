import { defaultContent } from "./seed";
import type { CmsContent, SiteSettings } from "./types";

function objectOrNull(value: unknown) {
  return value && typeof value === "object" ? value : null;
}

function arrayOrDefault<T>(value: unknown, fallback: T[]) {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function normalizeSettings(value: unknown): SiteSettings {
  const settings = objectOrNull(value) as Partial<SiteSettings> | null;
  if (!settings) {
    return defaultContent.settings;
  }

  return {
    contactEmail: settings.contactEmail ?? defaultContent.settings.contactEmail,
    bookingEmail: settings.bookingEmail ?? defaultContent.settings.bookingEmail,
    location: settings.location ?? defaultContent.settings.location,
    socials: arrayOrDefault(settings.socials, defaultContent.settings.socials)
  };
}

export function normalizeCmsContent(value: unknown): CmsContent {
  const content = objectOrNull(value) as Partial<CmsContent> | null;
  if (!content) {
    return defaultContent;
  }

  return {
    songs: arrayOrDefault(content.songs, defaultContent.songs),
    news: arrayOrDefault(content.news, defaultContent.news),
    plugins: arrayOrDefault(content.plugins, defaultContent.plugins),
    visuals: arrayOrDefault(content.visuals, defaultContent.visuals),
    members: arrayOrDefault(content.members, defaultContent.members),
    shows: arrayOrDefault(content.shows, defaultContent.shows),
    products: arrayOrDefault(content.products, defaultContent.products),
    settings: normalizeSettings(content.settings)
  };
}
