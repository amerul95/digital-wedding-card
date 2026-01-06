import { redirect } from 'next/navigation'

/**
 * Admin page redirects to admin dashboard
 */
export default function AdminPage() {
  redirect('/admin/dashboard')
}
