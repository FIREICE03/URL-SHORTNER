import { getShortUrl } from "../dao/short_url.js"
import { createShortUrlWithoutUser, createShortUrlWithUser } from "../services/short_url.service.js"
import wrapAsync from "../utils/tryCatchWrapper.js"

export const createShortUrl = wrapAsync(async (req, res) => {
  const data = req.body
  let shortUrl

  if (req.user) {
    shortUrl = await createShortUrlWithUser(data.url, req.user._id, data.slug)
  } else {
    shortUrl = await createShortUrlWithoutUser(data.url)
  }

  const baseUrl = (process.env.APP_URL || "").replace(/\/$/, "")
  res.status(200).json({ shortUrl: `${baseUrl}/${shortUrl}` })
})

export const redirectFromShortUrl = wrapAsync(async (req, res) => {
  const { id } = req.params
  const url = await getShortUrl(id)
  if (!url) return res.redirect("/?error=not-found")
  res.redirect(url.full_url)
})

export const createCustomShortUrl = wrapAsync(async (req, res) => {
  const { url, slug } = req.body
  const shortUrl = await createShortUrlWithoutUser(url, slug)

  const baseUrl = (process.env.APP_URL || "").replace(/\/$/, "")
  res.status(200).json({ shortUrl: `${baseUrl}/${shortUrl}` })
})