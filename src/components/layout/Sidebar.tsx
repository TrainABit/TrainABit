"use client";

import {
  Bars3Icon,
  CalendarDaysIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";

import { useAppStore } from "@/store/useAppStore";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Milestones", href: "/milestones", icon: CalendarDaysIcon },
  { name: "Financial", href: "/financial", icon: CurrencyDollarIcon },
  { name: "Metrics", href: "/metrics", icon: ChartBarIcon },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-white transition-all duration-300 dark:bg-gray-900",
        "border-r border-gray-200 dark:border-gray-700",
        sidebarCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
        {!sidebarCollapsed && (
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">10M Exit Planner</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <Bars3Icon className="h-6 w-6" /> : <XMarkIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-2 py-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={clsx(
              "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
              "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
              "dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
            )}
            title={sidebarCollapsed ? item.name : undefined}
          >
            <item.icon
              className={clsx("h-6 w-6 flex-shrink-0", !sidebarCollapsed && "mr-3")}
              aria-hidden="true"
            />
            {!sidebarCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
