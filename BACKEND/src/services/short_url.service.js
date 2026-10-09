import { generateNanoId } from "../utils/helper.js";
import urlSchema from "../models/short_url.model.js";
import { findExistingShortUrl, getCustomShortUrl, saveShortUrl } from "../dao/short_url.js";

export const createShortUrlWithoutUser = async (url, slug = null) => {
  if (slug) {
    const exists = await getCustomShortUrl(slug);
    if (exists) {
      if (!exists.user && exists.full_url === url) return exists.short_url;
      throw new Error("This custom url already exists");
    }
  } else {
    const existing = await findExistingShortUrl(url);
    if (existing) return existing.short_url;
  }

  const shortUrl = slug || generateNanoId(7);
  if (!shortUrl) throw new Error("Short URL not generated");
  await saveShortUrl(shortUrl, url);
  return shortUrl;
};

export const createShortUrlWithUser = async (url, userId, slug = null) => {
  if (slug) {
    const exists = await getCustomShortUrl(slug);
    if (exists) {
      if (String(exists.user) === String(userId) && exists.full_url === url) return exists.short_url;
      throw new Error("This custom url already exists");
    }
  } else {
    const existing = await findExistingShortUrl(url, userId);
    if (existing) return existing.short_url;
  }

  const shortUrl = slug || generateNanoId(7);
  await saveShortUrl(shortUrl, url, userId);
  return shortUrl;
};