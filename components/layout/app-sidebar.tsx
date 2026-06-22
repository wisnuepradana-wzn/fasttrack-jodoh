
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AppSidebar({
  isAdmin = false
}: {
  isAdmin?: boolean;
}) {
  const currentPath = usePathname();

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white lg:sticky lg:top-0 lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-200 px-6 py-5">
          <p className="text-sm font-semibold text-slate-950">Panduan Fast Track</p>
          <p className="mt-1 text-xs text-slate-500">Akses Premium</p>
        </div>

        <nav className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = currentPath.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-2xl px-4 py-3 text-sm transition",
                    active
                      ? "bg-navy-900 text-white shadow-soft"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {isAdmin && (
            <div className="mt-6 border-t border-slate-200 pt-4">
              <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Admin
              </p>
              <Link
                href="/admin"
                className={cn(
                  "flex items-center rounded-2xl px-4 py-3 text-sm transition",
                  currentPath.startsWith("/admin")
                    ? "bg-navy-900 text-white shadow-soft"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                )}
              >
                Admin Dashboard
              </Link>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
}
