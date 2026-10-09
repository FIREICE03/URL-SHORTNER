import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { createShortUrl } from '../api/shortUrl.api'
import { useSelector } from 'react-redux'
import { queryClient } from '../main'

// Slugs end up in the path of /:id, so keep them URL-safe
const SLUG_PATTERN = /^[A-Za-z0-9_-]+$/

const UrlForm = () => {
  
  const [url, setUrl] = useState("https://www.google.com")
  const [shortUrl, setShortUrl] = useState()
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)
  const [customSlug, setCustomSlug] = useState("")
  const [isCustomMode, setIsCustomMode] = useState(false)
  const {isAuthenticated} = useSelector((state) => state.auth)

  // Custom URLs are only honoured by the backend for logged-in users
  const customBlocked = isCustomMode && !isAuthenticated

  const handleModeChange = (custom) => {
    if (custom === isCustomMode) return
    setIsCustomMode(custom)
    setCustomSlug("")   // never let a stale slug leak into the other mode
    setError(null)
  }

  const handleSubmit = async () => {
    let slug
    if (isCustomMode) {
      slug = customSlug.trim()
      if (!slug) {
        setError("Please enter a custom slug")
        return
      }
      if (!SLUG_PATTERN.test(slug)) {
        setError("Custom slug can only contain letters, numbers, hyphens and underscores")
        return
      }
    }

    try{
      const shortUrl = await createShortUrl(url,slug)
      setShortUrl(shortUrl)
      queryClient.invalidateQueries({queryKey: ['userUrls']})
      setError(null)
    }catch(err){
      setError(err.message)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            Enter your URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onInput={(event)=>setUrl(event.target.value)}
            placeholder="https://example.com"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-md border border-gray-300 overflow-hidden" role="group" aria-label="URL mode">
          <button
            type="button"
            onClick={() => handleModeChange(false)}
            aria-pressed={!isCustomMode}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors duration-200 ${
              !isCustomMode ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Normal URL
          </button>
          <button
            type="button"
            onClick={() => handleModeChange(true)}
            aria-pressed={isCustomMode}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors duration-200 ${
              isCustomMode ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Custom URL
          </button>
        </div>

        {isCustomMode && (
          <div>
            <label htmlFor="customSlug" className="block text-sm font-medium text-gray-700 mb-1">
              Custom slug
            </label>
            <input
              type="text"
              id="customSlug"
              value={customSlug}
              onChange={(event) => setCustomSlug(event.target.value)}
              placeholder="Enter custom slug"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {customBlocked && (
          <div className="p-3 bg-yellow-100 text-yellow-800 rounded-md text-sm">
            Please <Link to="/auth" search={{ mode: 'login' }} className="underline font-medium">log in</Link> to create a custom URL.
          </div>
        )}

        <button
          onClick={handleSubmit}
          type="submit"
          disabled={customBlocked}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >{isCustomMode ? 'Shorten with custom URL' : 'Shorten URL'}
        </button>
         {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {shortUrl && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Your shortened URL:</h2>
            <div className="flex items-center">
              <input
                type="text"
                readOnly
                value={shortUrl}
                className="flex-1 p-2 border border-gray-300 rounded-l-md bg-gray-50"
              />
               <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-r-md transition-colors duration-200 ${
                  copied 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
  )
}

export default UrlForm