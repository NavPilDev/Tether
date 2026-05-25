"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Megaphone,
  Calendar,
  FileText,
  BarChart2,
  Plus,
  Settings,
  CheckSquare,
  Users,
  Sparkles,
  ChevronRight,
  Camera,
  Play,
  AtSign,
  Globe,
  Menu,
  X,
} from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const mock = {
  user: { name: "Alex Johnson", company: "FlowMind AI", initials: "AJ" },
  campaign: {
    name: "Summer Launch 2025",
    tagline: "Productivity for modern teams",
    day: 23,
    totalDays: 90,
    postsPublished: 31,
    totalPosts: 90,
    daysLeft: 67,
  },
  stats: [
    { label: "Posts today", value: "3", icon: FileText, hint: "Next at 2:00 PM" },
    {
      label: "Approvals waiting",
      value: "2",
      icon: CheckSquare,
      hint: "Creator submissions",
      urgent: true,
    },
    {
      label: "Days remaining",
      value: "67",
      icon: Calendar,
      hint: "Campaign ends Aug 30",
    },
  ],
  todayPosts: [
    { time: "10:00 AM", platform: "tiktok", title: "3 productivity hacks you're missing" },
    { time: "2:00 PM", platform: "instagram", title: "Behind the scenes: building FlowMind" },
    { time: "6:30 PM", platform: "twitter", title: "Hot take: async work is the future" },
  ],
  aiInsight:
    "Your TikTok posts are getting 2× more engagement than Instagram this week. Consider shifting 1–2 scheduled Instagram posts to TikTok.",
};

const platformIcons: Record<string, React.ReactNode> = {
  tiktok: <Play size={12} fill="currentColor" />,
  instagram: <Camera size={12} />,
  twitter: <AtSign size={12} />,
  linkedin: <Globe size={12} />,
};

const platformColors: Record<string, string> = {
  tiktok: "#000000",
  instagram: "#E1306C",
  twitter: "#1DA1F2",
  linkedin: "#0A66C2",
};

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Megaphone, label: "Campaigns" },
  { icon: Calendar, label: "Calendar", badge: "3" },
  { icon: FileText, label: "Scripts" },
  { icon: BarChart2, label: "Analytics" },
  { icon: Users, label: "Creators" },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between px-5 py-5"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "var(--color-teal-400)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M5 4.5C5 3.12 6.12 2 7.5 2S10 3.12 10 4.5 8.88 7 7.5 7 5 5.88 5 4.5ZM6 11.5C6 10.12 7.12 9 8.5 9S11 10.12 11 11.5 9.88 14 8.5 14 6 12.88 6 11.5ZM7.5 7C6.4 7.6 5.5 8.7 5.5 10M8.5 9C9.6 8.4 10.5 7.3 10.5 6"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span
            className="font-semibold text-base tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            tether
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ color: "var(--color-text-tertiary)" }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p
          className="px-2 mb-2 text-[11px] font-medium uppercase tracking-widest"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          Workspace
        </p>

        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer"
                style={
                  item.active
                    ? {
                        background: "var(--color-teal-50)",
                        color: "var(--color-teal-800)",
                        fontWeight: 500,
                        borderLeft: "2px solid var(--color-teal-400)",
                        paddingLeft: "10px",
                      }
                    : {
                        color: "var(--color-text-secondary)",
                      }
                }
              >
                <item.icon size={16} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span
                    className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: "var(--color-teal-50)",
                      color: "var(--color-teal-800)",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>

        <p
          className="px-2 mt-6 mb-2 text-[11px] font-medium uppercase tracking-widest"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          Create
        </p>

        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer"
          style={{ color: "var(--color-teal-600)", fontWeight: 500 }}
        >
          <Plus size={16} />
          New campaign
        </button>
      </nav>

      {/* User */}
      <div
        className="px-3 py-4"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <div className="flex items-center gap-3 px-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
            style={{
              background: "var(--color-teal-50)",
              color: "var(--color-teal-800)",
            }}
          >
            {mock.user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium truncate"
              style={{ color: "var(--color-text-primary)" }}
            >
              {mock.user.name}
            </p>
            <p
              className="text-[11px] truncate"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {mock.user.company}
            </p>
          </div>
          <Settings size={15} style={{ color: "var(--color-text-tertiary)" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  stat,
}: {
  stat: { label: string; value: string; icon: React.ElementType; hint: string; urgent?: boolean };
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[11px] font-medium uppercase tracking-widest"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {stat.label}
        </span>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: stat.urgent ? "var(--color-warning-bg)" : "var(--color-teal-50)",
          }}
        >
          <stat.icon
            size={14}
            style={{ color: stat.urgent ? "var(--color-warning)" : "var(--color-teal-600)" }}
          />
        </div>
      </div>
      <div>
        <p
          className="text-3xl font-medium tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          {stat.value}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
          {stat.hint}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function FounderDashboard() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const progress = (mock.campaign.postsPublished / mock.campaign.totalPosts) * 100;
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex h-full" style={{ background: "var(--color-bg)" }}>
      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden md:flex md:flex-col w-60 shrink-0 h-full">
        <Sidebar />
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 md:hidden"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-60 md:hidden"
            >
              <Sidebar onClose={() => setMobileNavOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Content ── */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile top bar */}
        <div
          className="flex items-center gap-3 px-4 py-3 md:hidden sticky top-0 z-30"
          style={{
            background: "var(--color-surface)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <button onClick={() => setMobileNavOpen(true)}>
            <Menu size={20} style={{ color: "var(--color-text-secondary)" }} />
          </button>
          <span
            className="font-semibold text-base"
            style={{ color: "var(--color-text-primary)" }}
          >
            tether
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="px-5 md:px-10 py-8 max-w-5xl"
        >
          {/* ── Header ── */}
          <div className="mb-8">
            <p
              className="text-xs font-medium"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Good morning
            </p>
            <h1
              className="text-2xl md:text-3xl font-medium tracking-tight mt-0.5"
              style={{ color: "var(--color-text-primary)" }}
            >
              {today}
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
              Day {mock.campaign.day} of{" "}
              <span style={{ color: "var(--color-teal-800)", fontWeight: 500 }}>
                {mock.campaign.name}
              </span>{" "}
              · {mock.campaign.postsPublished} posts published
            </p>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {mock.stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>

          {/* ── Active Campaign Block ── */}
          <motion.div
            whileHover={{ y: -1 }}
            className="rounded-xl p-6 mb-6"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[11px] font-medium uppercase tracking-widest"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    Active Campaign
                  </span>
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: "var(--color-success-bg)",
                      color: "var(--color-success)",
                    }}
                  >
                    Live
                  </span>
                </div>
                <h2
                  className="text-lg font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {mock.campaign.name}
                </h2>
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  {mock.campaign.tagline}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  style={{
                    background: "var(--color-teal-400)",
                    color: "white",
                  }}
                >
                  Open campaign
                </button>
                <button
                  className="text-sm font-medium px-4 py-2 rounded-lg transition-colors hidden sm:block"
                  style={{
                    border: "1px solid var(--color-border-strong)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Calendar
                </button>
              </div>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--color-text-tertiary)" }}>
                <span>{mock.campaign.postsPublished} of {mock.campaign.totalPosts} posts published</span>
                <span>{mock.campaign.daysLeft} days left</span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "var(--color-teal-50)" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{ background: "var(--color-teal-400)" }}
                />
              </div>
            </div>
          </motion.div>

          {/* ── Today's Schedule ── */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3
                className="text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                Today's schedule
              </h3>
              <button
                className="text-xs flex items-center gap-1"
                style={{ color: "var(--color-teal-600)" }}
              >
                View calendar <ChevronRight size={12} />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {mock.todayPosts.map((post, i) => (
                <motion.button
                  key={i}
                  whileHover={{ y: -2 }}
                  className="flex-1 text-left p-4 rounded-xl transition-all cursor-pointer"
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center"
                      style={{
                        background: platformColors[post.platform] + "18",
                        color: platformColors[post.platform],
                      }}
                    >
                      {platformIcons[post.platform]}
                    </div>
                    <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                      {post.time}
                    </span>
                  </div>
                  <p
                    className="text-sm font-medium leading-snug"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {post.title}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* ── TetherAI Insight ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl p-5"
            style={{
              background: "var(--color-ai-bg)",
              border: "1px solid #C4B5FD",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: "var(--color-ai)", color: "white" }}
              >
                <Sparkles size={14} />
              </div>
              <div className="flex-1">
                <p
                  className="text-[11px] font-medium uppercase tracking-widest mb-1"
                  style={{ color: "var(--color-ai)" }}
                >
                  TetherAI Insight
                </p>
                <p className="text-sm" style={{ color: "#3B0764" }}>
                  {mock.aiInsight}
                </p>
                <button
                  className="mt-3 text-xs font-medium flex items-center gap-1"
                  style={{ color: "var(--color-ai)" }}
                >
                  Adjust campaign <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
