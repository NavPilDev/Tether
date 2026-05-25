"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  DollarSign,
  User,
  Link2,
  Settings,
  Bell,
  ChevronRight,
  Camera,
  Play,
  AtSign,
  Zap,
  Clock,
  Menu,
  X,
  Search,
  SlidersHorizontal,
} from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const mock = {
  user: { handle: "@sarahcreates", name: "Sarah Kim", initials: "SK" },
  stats: [
    { label: "Open gigs", value: "8", icon: Briefcase, hint: "Matched to your niche" },
    { label: "Active jobs", value: "3", icon: Zap, hint: "In progress", urgent: true },
    { label: "Pending payout", value: "$340", icon: DollarSign, hint: "Awaiting release" },
  ],
  notification: {
    brand: "FlowMind AI",
    type: "Short-form video",
    amount: "$200",
  },
  gigs: [
    {
      id: 1,
      brand: "FlowMind AI",
      brandInitials: "FA",
      niche: "Productivity",
      contentType: "Short-form video",
      platform: "tiktok",
      pay: "$200",
      deadline: "Jul 15",
      isNew: true,
    },
    {
      id: 2,
      brand: "GreenBlend",
      brandInitials: "GB",
      niche: "Health & Wellness",
      contentType: "Carousel",
      platform: "instagram",
      pay: "$150",
      deadline: "Jul 18",
      isNew: true,
    },
    {
      id: 3,
      brand: "StudyStack",
      brandInitials: "SS",
      niche: "Education",
      contentType: "Talking head",
      platform: "tiktok",
      pay: "$125",
      deadline: "Jul 22",
      isNew: false,
    },
    {
      id: 4,
      brand: "PeakForm",
      brandInitials: "PF",
      niche: "Fitness",
      contentType: "Short-form video",
      platform: "instagram",
      pay: "$175",
      deadline: "Jul 25",
      isNew: false,
    },
    {
      id: 5,
      brand: "Codekey",
      brandInitials: "CK",
      niche: "Tech",
      contentType: "Tutorial",
      platform: "twitter",
      pay: "$90",
      deadline: "Jul 28",
      isNew: false,
    },
  ],
};

const platformIcons: Record<string, React.ReactNode> = {
  tiktok: <Play size={11} fill="currentColor" />,
  instagram: <Camera size={11} />,
  twitter: <AtSign size={11} />,
};

const platformLabels: Record<string, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  twitter: "Twitter",
};

const platformColors: Record<string, string> = {
  tiktok: "#000000",
  instagram: "#E1306C",
  twitter: "#1DA1F2",
};

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true, section: "discover" },
  { icon: Search, label: "Browse Gigs", section: "discover" },
  { icon: Briefcase, label: "My Jobs", badge: "3", section: "discover" },
  { icon: User, label: "My Profile", section: "profile" },
  { icon: Link2, label: "My Tethers", section: "profile" },
  { icon: DollarSign, label: "Earnings", section: "profile" },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const discover = navItems.filter((n) => n.section === "discover");
  const profile = navItems.filter((n) => n.section === "profile");

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
          Discover
        </p>
        <ul className="space-y-0.5">
          {discover.map((item) => (
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
                    : { color: "var(--color-text-secondary)" }
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
          Profile
        </p>
        <ul className="space-y-0.5">
          {profile.map((item) => (
            <li key={item.label}>
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <item.icon size={16} />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
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
              {mock.user.handle}
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
            background: stat.urgent ? "var(--color-teal-50)" : "var(--color-teal-50)",
          }}
        >
          <stat.icon
            size={14}
            style={{ color: "var(--color-teal-600)" }}
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

// ─── Gig Card ────────────────────────────────────────────────────────────────

function GigCard({ gig, index }: { gig: (typeof mock.gigs)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -1 }}
      className="p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-all"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Brand avatar */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-semibold shrink-0"
        style={{
          background: "var(--color-teal-50)",
          color: "var(--color-teal-800)",
        }}
      >
        {gig.brandInitials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p
            className="text-sm font-medium truncate"
            style={{ color: "var(--color-text-primary)" }}
          >
            {gig.brand}
          </p>
          {gig.isNew && (
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
              style={{
                background: "var(--color-teal-50)",
                color: "var(--color-teal-800)",
              }}
            >
              New
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {gig.contentType}
          </span>
          <span style={{ color: "var(--color-border-strong)" }}>·</span>
          <div
            className="flex items-center gap-1 text-xs"
            style={{ color: platformColors[gig.platform] }}
          >
            {platformIcons[gig.platform]}
            <span>{platformLabels[gig.platform]}</span>
          </div>
          <span style={{ color: "var(--color-border-strong)" }}>·</span>
          <span className="text-xs flex items-center gap-1" style={{ color: "var(--color-text-tertiary)" }}>
            <Clock size={10} />
            Due {gig.deadline}
          </span>
        </div>
      </div>

      {/* Pay + CTA */}
      <div className="flex items-center gap-3 shrink-0">
        <p
          className="text-base font-semibold"
          style={{ color: "var(--color-success)" }}
        >
          {gig.pay}
        </p>
        <button
          className="hidden sm:block text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
          style={{
            background: "var(--color-teal-400)",
            color: "white",
          }}
        >
          View gig
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function CreatorDashboard() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div
      className="flex h-full"
      data-theme="creator"
      style={{ background: "var(--color-bg)" }}
    >
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
              data-theme="creator"
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
          <div className="ml-auto">
            <Bell size={18} style={{ color: "var(--color-text-secondary)" }} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="px-5 md:px-10 py-8 max-w-3xl"
        >
          {/* ── Header ── */}
          <div className="mb-8">
            <h1
              className="text-2xl md:text-3xl font-medium tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Good morning, {mock.user.name.split(" ")[0]}
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
              <span style={{ color: "var(--color-teal-800)", fontWeight: 500 }}>
                {mock.gigs.filter((g) => g.isNew).length} new gigs
              </span>{" "}
              matched to your niche today
            </p>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {mock.stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>

          {/* ── Notification strip ── */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl p-4 mb-6 flex items-center gap-3"
            style={{
              background: "var(--color-teal-50)",
              border: "1px solid var(--color-teal-100)",
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "var(--color-teal-400)", color: "white" }}
            >
              <Zap size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: "var(--color-teal-900)" }}>
                You've been approved for{" "}
                <span className="font-semibold">{mock.notification.brand}</span>
              </p>
              <p className="text-xs" style={{ color: "var(--color-teal-800)" }}>
                {mock.notification.type} · {mock.notification.amount}
              </p>
            </div>
            <button
              className="text-xs font-semibold flex items-center gap-1 shrink-0"
              style={{ color: "var(--color-teal-800)" }}
            >
              View job <ChevronRight size={12} />
            </button>
          </motion.div>

          {/* ── Gig Feed ── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                Matched gigs
              </h3>
              <button
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
                style={{
                  border: "1px solid var(--color-border-strong)",
                  color: "var(--color-text-secondary)",
                }}
              >
                <SlidersHorizontal size={12} />
                Filter
              </button>
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {["All", "TikTok", "Instagram", "Twitter", "$100+"].map((f, i) => (
                <button
                  key={f}
                  className="text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 transition-colors"
                  style={
                    i === 0
                      ? {
                          background: "var(--color-teal-400)",
                          color: "white",
                        }
                      : {
                          background: "var(--color-surface)",
                          color: "var(--color-text-secondary)",
                          border: "1px solid var(--color-border)",
                        }
                  }
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {mock.gigs.map((gig, i) => (
                <GigCard key={gig.id} gig={gig} index={i} />
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
