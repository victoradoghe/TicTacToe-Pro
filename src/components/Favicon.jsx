import { useEffect } from 'react'

const Favicon = () => {
  useEffect(() => {
    // Create the SVG favicon
    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="3em" viewBox="0 0 48 48">
        <g fill="none" stroke="#764ba2" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
          <circle cx="22.331" cy="21.684" r="1.169" />
          <circle cx="29.694" cy="17.622" r="1.169" />
          <path d="m15.4 36.776l8.112-30.111a2.924 2.924 0 0 1 3.582-2.063l11.288 3.041a2.923 2.923 0 0 1 2.061 3.581l-8.11 30.11a2.925 2.925 0 0 1-3.584 2.064l-11.287-3.04a2.923 2.923 0 0 1-2.061-3.582M26.998 16.34l-3.332 12.38m8.994-11.057L29.315 30.09m-8.399-5.544l12.329 3.321M22.76 18.631l12.094 3.258m-7.678-.352l1.854 3.428m.7-2.79l-3.263 1.998m4.553 4.458l1.96 3.406m.735-2.73l-3.357 1.973" />
          <circle cx="23.883" cy="16.056" r="1.169" />
        </g>
        <circle cx="13.72" cy="18.87" r="1.169" fill="none" stroke="#764ba2" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
        <path fill="none" stroke="#764ba2" stroke-linecap="round" stroke-linejoin="round" d="M10.724 16.746c1.34-1.463 4.092-1.805 5.41 0m-6.726-1.95c2.225-2.442 6.498-2.637 8.43 0" stroke-width="1.5" />
        <path fill="none" stroke="#764ba2" stroke-linecap="round" stroke-linejoin="round" d="M7.459 13.09c2.778-3.49 8.912-3.427 12.329 0M9.652 8.459l6.968 12.068" stroke-width="1.5" />
      </svg>
    `

    // Convert SVG to data URL
    const svgBlob = new Blob([svgIcon], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)

    // Remove any existing favicon links
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]')
    existingFavicons.forEach(link => link.remove())

    // Create multiple favicon links for different sizes and devices
    const faviconSizes = [
      { rel: 'icon', sizes: '16x16' },
      { rel: 'icon', sizes: '32x32' },
      { rel: 'icon', sizes: '48x48' },
      { rel: 'icon', sizes: '96x96' },
      { rel: 'icon', sizes: '192x192' },
      { rel: 'apple-touch-icon', sizes: '180x180' },
      { rel: 'icon', sizes: '512x512' }
    ]

    faviconSizes.forEach(({ rel, sizes }) => {
      const link = document.createElement('link')
      link.rel = rel
      link.sizes = sizes
      link.href = url
      link.type = 'image/svg+xml'
      document.head.appendChild(link)
    })

    // Add default favicon without sizes
    const defaultFavicon = document.createElement('link')
    defaultFavicon.rel = 'icon'
    defaultFavicon.href = url
    defaultFavicon.type = 'image/svg+xml'
    document.head.appendChild(defaultFavicon)

    // Add theme color for mobile browsers
    const themeColor = document.querySelector('meta[name="theme-color"]')
    if (!themeColor) {
      const meta = document.createElement('meta')
      meta.name = 'theme-color'
      meta.content = '#764ba2'
      document.head.appendChild(meta)
    }

    // Cleanup function
    return () => {
      URL.revokeObjectURL(url)
      // Remove all favicon links we created
      const createdFavicons = document.querySelectorAll('link[rel*="icon"]')
      createdFavicons.forEach(link => {
        if (link.href === url) {
          link.remove()
        }
      })
    }
  }, [])

  return null // This component doesn't render anything
}

export default Favicon
