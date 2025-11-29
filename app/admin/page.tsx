import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Admin - Zamto Africa',
  description: 'Admin panel for Zamto Africa vehicle management',
}

export default function AdminPage() {
  // TinaCMS admin is built to /admin/index.html during build
  // This page redirects to the static admin file
  redirect('/admin/index.html')
}