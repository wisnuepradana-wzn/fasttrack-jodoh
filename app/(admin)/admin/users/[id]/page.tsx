import { requireAdminProfile } from "@/lib/auth";

export default async function AdminUserDetailPage() {
  await requireAdminProfile();
  return <div />;
}
