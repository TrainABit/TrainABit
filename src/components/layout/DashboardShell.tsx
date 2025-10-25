"use client";

import clsx from "clsx";
import { ReactNode } from "react";

import { Sidebar } from "@/components/layout/Sidebar";
import { useAppStore } from "@/store/useAppStore";

interface DashboardShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function DashboardShell({ title, subtitle, children }: DashboardShellProps) {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar />
      <main
        className={clsx(
          "flex-1 px-6 pb-12 pt-6 transition-all duration-300 sm:px-10",
          sidebarCollapsed ? "ml-16" : "ml-64",
        )}
      >
        <header className="mb-8 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Overview</p>
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">{title}</h2>
          {subtitle ? (
            <p className="text-base text-slate-600 dark:text-slate-300">{subtitle}</p>
          ) : null}
        </header>
        <section className="grid gap-6 md:grid-cols-2">{children}</section>
      </main>
    </div>
  );
}
