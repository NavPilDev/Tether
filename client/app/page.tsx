"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FounderDashboard from "@/components/founder/FounderDashboard";
import CreatorDashboard from "@/components/creator/CreatorDashboard";

type Persona = "founder" | "creator";

export default function PrototypePage() {
  const [persona, setPersona] = useState<Persona>("founder");

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* ── Prototype Banner ── */}
      <div
        className="shrink-0 flex items-center justify-center gap-3 py-2 px-4 z-50"
        style={{ background: "#1A1A2E", borderBottom: "1px solid #2D2D4E" }}
      >
        <span className="text-xs" style={{ color: "#9494B8" }}>
          Prototype
        </span>

        {/* Toggle pill */}
        <div
          className="relative flex items-center rounded-full p-0.5"
          style={{ background: "#2D2D4E" }}
        >
          {/* Sliding background */}
          <motion.div
            layout
            layoutId="persona-pill"
            className="absolute top-0.5 bottom-0.5 rounded-full"
            style={{
              background: persona === "founder" ? "#00D4AA" : "#C026D3",
              left: persona === "founder" ? "2px" : "50%",
              right: persona === "founder" ? "50%" : "2px",
            }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
          />

          {(["founder", "creator"] as Persona[]).map((p) => (
            <button
              key={p}
              onClick={() => setPersona(p)}
              className="relative z-10 px-4 py-1.5 text-xs font-medium rounded-full transition-colors capitalize"
              style={{
                color: persona === p ? "white" : "#9494B8",
              }}
            >
              {p === "founder" ? "Founder" : "Creator"}
            </button>
          ))}
        </div>

        <span className="text-xs hidden sm:block" style={{ color: "#4A4A6A" }}>
          Toggle to preview both user experiences
        </span>
      </div>

      {/* ── Dashboard Views ── */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {persona === "founder" ? (
            <motion.div
              key="founder"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-0 overflow-auto"
            >
              <FounderDashboard />
            </motion.div>
          ) : (
            <motion.div
              key="creator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-0 overflow-auto"
            >
              <CreatorDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
