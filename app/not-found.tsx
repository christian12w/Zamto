import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-zamtoLight pt-20">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zamtoNavy mb-4 tracking-tight">404</h1>
          <p className="text-xl text-gray-700 mb-8">Page not found</p>
          <Link
            href="/"
            className="inline-block bg-zamtoGreen text-white px-6 py-3 rounded-lg font-semibold hover:bg-zamtoGreen/90 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  )
}