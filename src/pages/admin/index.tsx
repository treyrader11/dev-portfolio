import AdminLayout from "@/features/admin/components/admin-layout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { GetServerSideProps } from "next";

const sections = [
  {
    title: "Profile & Hero",
    href: "/admin/profile",
    description: "Edit name, designation, hero text, about section, social links",
  },
  {
    title: "Experiences",
    href: "/admin/experiences",
    description: "Manage work history and timeline entries",
  },
  {
    title: "Projects",
    href: "/admin/projects",
    description: "Add, edit, or remove portfolio projects",
  },
  {
    title: "Skills",
    href: "/admin/skills",
    description: "Manage displayed technologies and tools",
  },
  {
    title: "References",
    href: "/admin/references",
    description: "Edit testimonials and references",
  },
  {
    title: "Jira Tickets",
    href: "/admin/jira",
    description: "View Jira tickets and track time",
  },
  {
    title: "Invoices",
    href: "/admin/invoices",
    description: "Generate and manage invoices from tracked time",
  },
  {
    title: "Settings",
    href: "/admin/settings",
    description: "SEO meta descriptions, CTA text, tag colors, Jira config",
  },
];

interface Props {
  counts: {
    experiences: number;
    projects: number;
    skills: number;
    references: number;
    configs: number;
    timeEntries: number;
    invoices: number;
  };
}

export default function AdminDashboard({ counts }: Props) {
  return (
    <AdminLayout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Experiences" count={counts.experiences} />
        <StatCard label="Projects" count={counts.projects} />
        <StatCard label="Skills" count={counts.skills} />
        <StatCard label="References" count={counts.references} />
        <StatCard label="Time Entries" count={counts.timeEntries} />
        <StatCard label="Invoices" count={counts.invoices} />
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow h-full">
              <h2 className="text-lg font-semibold text-gray-900">
                {section.title}
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {section.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Seed button */}
      {counts.experiences === 0 &&
        counts.projects === 0 &&
        counts.skills === 0 && (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900">
              Database is empty
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Seed the database with your existing portfolio content to get
              started.
            </p>
            <button
              onClick={async () => {
                const res = await fetch("/api/admin/seed", { method: "POST" });
                if (res.ok) {
                  window.location.reload();
                }
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Seed Database
            </button>
          </div>
        )}
    </AdminLayout>
  );
}

function StatCard({ label, count }: { label: string; count: number }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session?.user?.isAdmin) {
    return { redirect: { destination: "/admin/signin", permanent: false } };
  }

  const [experiences, projects, skills, references, configs, timeEntries, invoices] =
    await Promise.all([
      prisma.experience.count(),
      prisma.project.count(),
      prisma.skill.count(),
      prisma.reference.count(),
      prisma.siteConfig.count(),
      prisma.timeEntry.count(),
      prisma.invoice.count(),
    ]);

  return {
    props: {
      counts: { experiences, projects, skills, references, configs, timeEntries, invoices },
    },
  };
};
