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
  Bell,
  Zap,
  Bot,
  Video,
  AlignLeft,
  ImageIcon,
  TrendingUp,
  Clock,
  DollarSign,
  Star,
} from "lucide-react";
import TetherLogo from "@/components/ui/TetherLogo";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const CONTENT_TYPE_META: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  "short-form-video": { label: "Short-form video", icon: Video, color: "#7C3AED", bg: "#EDE9FE" },
  "carousel":         { label: "Carousel",          icon: ImageIcon, color: "#0EA5E9", bg: "#E0F2FE" },
  "text-post":        { label: "Text post",          icon: AlignLeft, color: "#10B981", bg: "#D1FAE5" },
  "tutorial":         { label: "Tutorial",           icon: Play,      color: "#F59E0B", bg: "#FEF3C7" },
};

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
    budget: 3000,
    spent: 1240,
  },
  stats: [
    {
      label: "Posts Today",
      value: "3",
      sub: "Next at 2:00 PM",
      icon: FileText,
      gradient: "linear-gradient(135deg, #00D4AA 0%, #00A888 100%)",
      iconBg: "rgba(255,255,255,0.25)",
    },
    {
      label: "Approvals Waiting",
      value: "2",
      sub: "Creator submissions",
      icon: CheckSquare,
      gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
      iconBg: "rgba(255,255,255,0.25)",
      urgent: true,
    },
    {
      label: "Days Remaining",
      value: "67",
      sub: "Campaign ends Aug 30",
      icon: Calendar,
      gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
      iconBg: "rgba(255,255,255,0.25)",
    },
  ],
  todayPosts: [
    {
      time: "10:00 AM",
      platform: "tiktok",
      title: "3 productivity hacks you're missing",
      contentType: "short-form-video",
      assignment: "ugc" as const,
      creator: { name: "Maya Chen", handle: "@mayacreates", initials: "MC", niche: "Tech", match: 98 },
    },
    {
      time: "2:00 PM",
      platform: "instagram",
      title: "Behind the scenes: building FlowMind",
      contentType: "carousel",
      assignment: "auto" as const,
    },
    {
      time: "6:30 PM",
      platform: "twitter",
      title: "Hot take: async work is the future",
      contentType: "text-post",
      assignment: "auto" as const,
    },
    {
      time: "8:00 PM",
      platform: "tiktok",
      title: "Why your morning routine is wrong",
      contentType: "short-form-video",
      assignment: "ugc" as const,
      creator: { name: "Jordan Lee", handle: "@jlee.vid", initials: "JL", niche: "Lifestyle", match: 92 },
    },
  ],
  creators: [
    { name: "Maya Chen", handle: "@mayacreates", initials: "MC", niche: "Tech", followers: "12.4K", match: 98, status: "active" as const },
    { name: "Jordan Lee", handle: "@jlee.vid", initials: "JL", niche: "Productivity", followers: "8.5K", match: 94, status: "pending" as const },
    { name: "Alex Park", handle: "@alex.creates", initials: "AP", niche: "SaaS", followers: "22.1K", match: 89, status: "invited" as const },
  ],
  platforms: [
    { name: "TikTok", posts: 12, color: "#000000", icon: "tiktok" },
    { name: "Instagram", posts: 9, color: "#E1306C", icon: "instagram" },
    { name: "Twitter", posts: 15, color: "#1DA1F2", icon: "twitter" },
  ],
  aiInsight: "Your TikTok posts are getting 2× more engagement than Instagram this week. Consider shifting 1–2 scheduled Instagram posts to TikTok.",
};

const platformIcons: Record<string, React.ElementType> = {
  tiktok: Play,
  instagram: Camera,
  twitter: AtSign,
  linkedin: Globe,
};

const platformColors: Record<string, string> = {
  tiktok: "#000000",
  instagram: "#E1306C",
  twitter: "#1DA1F2",
  linkedin: "#0A66C2",
};

const platformNames: Record<string, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  twitter: "Twitter",
  linkedin: "LinkedIn",
};

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true, badge: undefined },
  { icon: Megaphone, label: "Campaigns", active: false, badge: undefined },
  { icon: Calendar, label: "Calendar", active: false, badge: "3" },
  { icon: FileText, label: "Scripts", active: false, badge: undefined },
  { icon: BarChart2, label: "Analytics", active: false, badge: undefined },
  { icon: Users, label: "Creators", active: false, badge: undefined },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: "#0B1437" }}>
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5">
        <TetherLogo iconSize={28} wordmarkColor="white" />
        {onClose && (
          <button onClick={onClose} className="text-white/40 hover:text-white/70 transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Workspace
        </p>

        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
                style={
                  item.active
                    ? {
                        background: "rgba(0,212,170,0.15)",
                        color: "#00D4AA",
                        fontWeight: 500,
                      }
                    : { color: "rgba(255,255,255,0.5)" }
                }
              >
                <item.icon size={16} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: "rgba(0,212,170,0.2)", color: "#00D4AA" }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>

        <p className="px-3 mt-6 mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Create
        </p>
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
          style={{ color: "#00D4AA", fontWeight: 500 }}
        >
          <Plus size={16} />
          New campaign
        </button>
      </nav>

      {/* Promo card */}
      <div className="mx-4 mb-4 p-4 rounded-2xl" style={{ background: "linear-gradient(135deg, #00D4AA22 0%, #7C3AED22 100%)", border: "1px solid rgba(0,212,170,0.15)" }}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} color="#00D4AA" />
          <p className="text-xs font-semibold text-white/90">TetherAI</p>
        </div>
        <p className="text-[11px] text-white/50 leading-relaxed">
          Your campaign has been live for 23 days. TetherAI is optimizing posting times.
        </p>
      </div>

      {/* User */}
      <div className="px-4 pb-5 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 px-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: "linear-gradient(135deg, #00D4AA, #00A888)", color: "white" }}
          >
            {mock.user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-white">{mock.user.name}</p>
            <p className="text-[11px] truncate text-white/40">{mock.user.company}</p>
          </div>
          <Settings size={14} className="text-white/30 shrink-0" />
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ stat }: { stat: (typeof mock.stats)[0] }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{ background: stat.gradient }}
    >
      {/* Decorative circle */}
      <div
        className="absolute -right-4 -top-4 w-24 h-24 rounded-full"
        style={{ background: "rgba(255,255,255,0.08)" }}
      />
      <div
        className="absolute -right-2 top-8 w-16 h-16 rounded-full"
        style={{ background: "rgba(255,255,255,0.06)" }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            {stat.label}
          </p>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: stat.iconBg }}
          >
            <stat.icon size={16} color="white" />
          </div>
        </div>
        <p className="text-4xl font-bold text-white tracking-tight leading-none mb-1">
          {stat.value}
        </p>
        <p className="text-xs text-white/60 mt-1">{stat.sub}</p>
      </div>
    </motion.div>
  );
}

// ─── Schedule Item ────────────────────────────────────────────────────────────

function ScheduleItem({ post, index }: { post: (typeof mock.todayPosts)[0]; index: number }) {
  const PlatformIcon = platformIcons[post.platform];
  const ct = CONTENT_TYPE_META[post.contentType];
  const ContentIcon = ct.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ x: 2 }}
      className="flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all group"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Platform dot + time */}
      <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: platformColors[post.platform] + "15", color: platformColors[post.platform] }}
        >
          <PlatformIcon size={14} />
        </div>
        <p className="text-[10px] font-medium whitespace-nowrap" style={{ color: "var(--color-text-tertiary)" }}>
          {post.time}
        </p>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Badges row */}
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${platformColors[post.platform]}15`, color: platformColors[post.platform] }}
          >
            {platformNames[post.platform]}
          </span>
          <span
            className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: ct.bg, color: ct.color }}
          >
            <ContentIcon size={9} />
            {ct.label}
          </span>
        </div>
        <p className="text-sm font-medium leading-snug truncate" style={{ color: "var(--color-text-primary)" }}>
          {post.title}
        </p>
      </div>

      {/* Assignment */}
      <div className="shrink-0 flex flex-col items-end gap-1">
        {post.assignment === "ugc" && post.creator ? (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ background: "var(--color-teal-50)", border: "1px solid var(--color-border)" }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
              style={{ background: "var(--color-teal-400)", color: "white" }}
            >
              {post.creator.initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-semibold leading-tight" style={{ color: "var(--color-teal-800)" }}>
                {post.creator.name}
              </p>
              <p className="text-[9px]" style={{ color: "var(--color-text-tertiary)" }}>
                {post.creator.handle}
              </p>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
          >
            <Bot size={11} color="#10B981" />
            <p className="text-[10px] font-semibold" style={{ color: "#065F46" }}>
              Auto-post
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Creator Card (right panel) ───────────────────────────────────────────────

function CreatorSpotlightCard({ creator }: { creator: (typeof mock.creators)[0] }) {
  const statusConfig = {
    active:  { label: "Active gig",  bg: "#D1FAE5", color: "#065F46" },
    pending: { label: "Pending",     bg: "#FEF3C7", color: "#92400E" },
    invited: { label: "Invited",     bg: "#EDE9FE", color: "#4C1D95" },
  };
  const s = statusConfig[creator.status];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={{ background: "linear-gradient(135deg, var(--color-teal-400), var(--color-teal-600))", color: "white" }}
      >
        {creator.initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight truncate" style={{ color: "var(--color-text-primary)" }}>
          {creator.name}
        </p>
        <p className="text-[11px]" style={{ color: "var(--color-text-tertiary)" }}>
          {creator.handle} · {creator.followers}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <div className="flex items-center gap-1">
          <Star size={10} fill="#F59E0B" color="#F59E0B" />
          <span className="text-[10px] font-bold" style={{ color: "var(--color-text-secondary)" }}>
            {creator.match}%
          </span>
        </div>
        <span
          className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
          style={{ background: s.bg, color: s.color }}
        >
          {s.label}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function FounderDashboard() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const progress = (mock.campaign.postsPublished / mock.campaign.totalPosts) * 100;
  const budgetProgress = (mock.campaign.spent / mock.campaign.budget) * 100;

  return (
    <div className="flex h-full" style={{ background: "#F7FAFC" }}>
      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 h-full">
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
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-64 md:hidden"
            >
              <Sidebar onClose={() => setMobileNavOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* Mobile top bar */}
        <div
          className="flex items-center gap-3 px-4 py-3 md:hidden sticky top-0 z-30"
          style={{ background: "white", borderBottom: "1px solid var(--color-border)" }}
        >
          <button onClick={() => setMobileNavOpen(true)}>
            <Menu size={20} style={{ color: "var(--color-text-secondary)" }} />
          </button>
          <TetherLogo iconSize={22} />
          <div className="ml-auto flex items-center gap-3">
            <Bell size={18} style={{ color: "var(--color-text-secondary)" }} />
          </div>
        </div>

        {/* Top bar (desktop) */}
        <div
          className="hidden md:flex items-center justify-between px-8 py-4 sticky top-0 z-30"
          style={{ background: "rgba(247,250,252,0.9)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--color-border)" }}
        >
          <div>
            <p className="text-xs font-medium" style={{ color: "var(--color-text-tertiary)" }}>
              Good morning, {mock.user.name.split(" ")[0]} 👋
            </p>
            <h1
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-jakarta), sans-serif" }}
            >
              {today}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
              style={{ background: "var(--color-teal-400)", color: "white" }}
            >
              <Plus size={14} />
              New Campaign
            </button>
            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center relative"
              style={{ background: "white", border: "1px solid var(--color-border)" }}
            >
              <Bell size={16} style={{ color: "var(--color-text-secondary)" }} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: "#EF4444" }}
              />
            </button>
          </div>
        </div>

        {/* ── Page body ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex-1 p-5 md:p-8"
        >
          {/* Campaign context strip */}
          <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
            Day <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>{mock.campaign.day}</span> of{" "}
            <span className="font-semibold" style={{ color: "var(--color-teal-600)" }}>{mock.campaign.name}</span>
            {" "}· {mock.campaign.postsPublished} posts published
          </p>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {mock.stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>

          {/* ── Two-column body ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* ── Left / Main column (2/3) ── */}
            <div className="xl:col-span-2 flex flex-col gap-6">

              {/* Campaign progress card */}
              <div
                className="rounded-2xl p-6"
                style={{ background: "white", border: "1px solid var(--color-border)" }}
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: "var(--color-text-tertiary)" }}
                      >
                        Active Campaign
                      </span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "#D1FAE5", color: "#065F46" }}
                      >
                        ● Live
                      </span>
                    </div>
                    <h2
                      className="text-xl font-bold tracking-tight"
                      style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-jakarta), sans-serif" }}
                    >
                      {mock.campaign.name}
                    </h2>
                    <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                      {mock.campaign.tagline}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="text-sm font-semibold px-4 py-2 rounded-xl"
                      style={{ background: "var(--color-teal-400)", color: "white" }}
                    >
                      Open campaign
                    </motion.button>
                    <button
                      className="hidden sm:block text-sm font-medium px-4 py-2 rounded-xl"
                      style={{ border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
                    >
                      Calendar
                    </button>
                  </div>
                </div>

                {/* Dual progress: posts + budget */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--color-text-tertiary)" }}>
                      <span>Content published</span>
                      <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                        {mock.campaign.postsPublished}/{mock.campaign.totalPosts}
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--color-teal-50)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, var(--color-teal-400), var(--color-teal-600))" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--color-text-tertiary)" }}>
                      <span>Budget used</span>
                      <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                        ${mock.campaign.spent.toLocaleString()}/${mock.campaign.budget.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "#EDE9FE" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${budgetProgress}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, #7C3AED, #6D28D9)" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Schedule */}
              <div
                className="rounded-2xl p-6"
                style={{ background: "white", border: "1px solid var(--color-border)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3
                      className="text-base font-bold"
                      style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-jakarta), sans-serif" }}
                    >
                      Today's schedule
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                      {mock.todayPosts.length} posts · {mock.todayPosts.filter((p) => p.assignment === "ugc").length} by creators · {mock.todayPosts.filter((p) => p.assignment === "auto").length} auto-posted
                    </p>
                  </div>
                  <button
                    className="flex items-center gap-1 text-xs font-semibold"
                    style={{ color: "var(--color-teal-600)" }}
                  >
                    View all <ChevronRight size={12} />
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {mock.todayPosts.map((post, i) => (
                    <ScheduleItem key={i} post={post} index={i} />
                  ))}
                </div>

                {/* Legend */}
                <div
                  className="flex items-center gap-4 mt-4 pt-4 flex-wrap"
                  style={{ borderTop: "1px solid var(--color-border)" }}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-teal-400)" }} />
                    <span className="text-[11px]" style={{ color: "var(--color-text-tertiary)" }}>UGC creator handles post</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: "#10B981" }} />
                    <span className="text-[11px]" style={{ color: "var(--color-text-tertiary)" }}>Tether auto-posts on your behalf</span>
                  </div>
                </div>
              </div>

              {/* TetherAI Insight */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl p-6"
                style={{
                  background: "linear-gradient(135deg, #EDE9FE 0%, #F5F3FF 100%)",
                  border: "1px solid #C4B5FD",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: "var(--color-ai)" }}
                  >
                    <Sparkles size={18} color="white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: "var(--color-ai)" }}
                      >
                        TetherAI Insight
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#3B0764" }}>
                      {mock.aiInsight}
                    </p>
                    <button
                      className="mt-3 text-xs font-semibold flex items-center gap-1"
                      style={{ color: "var(--color-ai)" }}
                    >
                      Adjust campaign <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ── Right panel (1/3) ── */}
            <div className="xl:col-span-1 flex flex-col gap-6">

              {/* Creator Spotlight */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "white", border: "1px solid var(--color-border)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3
                      className="text-base font-bold"
                      style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-jakarta), sans-serif" }}
                    >
                      Creator spotlight
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                      Matched to this campaign
                    </p>
                  </div>
                  <button className="text-xs font-semibold flex items-center gap-1" style={{ color: "var(--color-teal-600)" }}>
                    All <ChevronRight size={12} />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {mock.creators.map((creator) => (
                    <CreatorSpotlightCard key={creator.handle} creator={creator} />
                  ))}
                </div>
              </div>

              {/* Platform breakdown */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "white", border: "1px solid var(--color-border)" }}
              >
                <h3
                  className="text-base font-bold mb-4"
                  style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-jakarta), sans-serif" }}
                >
                  Platform breakdown
                </h3>
                <div className="flex flex-col gap-3">
                  {mock.platforms.map((p) => {
                    const PIcon = platformIcons[p.icon];
                    const maxPosts = Math.max(...mock.platforms.map((x) => x.posts));
                    return (
                      <div key={p.name}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-lg flex items-center justify-center"
                              style={{ background: p.color + "15", color: p.color }}
                            >
                              <PIcon size={12} />
                            </div>
                            <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
                              {p.name}
                            </span>
                          </div>
                          <span className="text-xs font-bold" style={{ color: "var(--color-text-primary)" }}>
                            {p.posts} posts
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(p.posts / maxPosts) * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                            className="h-full rounded-full"
                            style={{ background: p.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick stats */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "linear-gradient(135deg, #0B1437 0%, #1a2654 100%)" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={14} color="#00D4AA" />
                  <p className="text-xs font-bold uppercase tracking-widest text-white/60">
                    This week
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Posts out", value: "18" },
                    { label: "Creator gigs", value: "5" },
                    { label: "Avg. engagement", value: "4.8%" },
                    { label: "Budget left", value: "$1,760" },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <p className="text-lg font-bold text-white leading-none">{item.value}</p>
                      <p className="text-[10px] mt-1 text-white/40">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
