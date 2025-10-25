import { RocketLaunchIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

import { DashboardShell } from "@/components/layout/DashboardShell";

const highlights = [
  {
    title: "Set your vision",
    description:
      "Define milestone targets for hitting your 10M exit. Track revenue, runway, and hiring plans in one place.",
    icon: RocketLaunchIcon,
  },
  {
    title: "Stay investor ready",
    description:
      "Monitor compliance, diligence, and key metrics as you prepare for fundraising conversations.",
    icon: ShieldCheckIcon,
  },
];

export default function HomePage() {
  return (
    <DashboardShell title="Welcome back" subtitle="Your strategic command center for the 10M exit">
      {highlights.map((item) => (
        <article
          key={item.title}
          className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 group-hover:bg-primary-200 dark:bg-primary-900/40 dark:text-primary-200">
            <item.icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
            {item.title}
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
          <div className="mt-auto pt-6 text-sm font-medium text-primary-600 dark:text-primary-300">
            Explore blueprint →
          </div>
        </article>
      ))}
    </DashboardShell>
  );
}
