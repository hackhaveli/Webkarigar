import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminBlogForm } from '@/components/admin/AdminBlogForm';

const ADMIN_EMAILS = ['coderrohit2927@gmail.com'];

export default async function NewAdminBlogPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');
  if (!ADMIN_EMAILS.includes(session.user.email)) redirect('/dashboard');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <AdminBlogForm isEditing={false} />
    </div>
  );
}
