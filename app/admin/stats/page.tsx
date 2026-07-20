import { redirect } from 'next/navigation';

// Old stats page — redirected to new admin dashboard
export default function AdminStatsRedirect() {
  redirect('/admin');
}
