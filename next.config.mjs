/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // For Netlify deployment with Next.js plugin
  // output: 'standalone', // Commented out for Netlify Next.js plugin
}

export default config

