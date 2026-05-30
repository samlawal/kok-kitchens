"use client";

import { motion } from "framer-motion";

// ── Animated Pot + Steam (Made Fresh) ────────────────────
export function FlameIcon({ animated = true }: { animated?: boolean }) {
  if (!animated) {
    return (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Pot body */}
        <path d="M8 22h24v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-8z" fill="#f97316" opacity="0.15" stroke="none" />
        <path d="M8 22h24v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-8z" />
        {/* Lid */}
        <path d="M6 22h28" />
        <path d="M18 22v-2h4v2" />
        {/* Handles */}
        <path d="M8 26H5" />
        <path d="M32 26h3" />
        {/* Static steam */}
        <path d="M15 16c0-3 2-4 0-7" opacity="0.4" />
        <path d="M20 15c0-3 2-4 0-7" opacity="0.3" />
        <path d="M25 16c0-3 2-4 0-7" opacity="0.4" />
      </svg>
    );
  }

  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Pot body */}
      <path d="M8 22h24v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-8z" fill="#f97316" opacity="0.12" stroke="none" />
      <path d="M8 22h24v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-8z" />
      {/* Lid with gentle rattle */}
      <motion.g
        animate={{ y: [0, -1.5, 0], rotate: [0, 0.8, -0.5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "20px 22px" }}
      >
        <path d="M6 22h28" />
        <path d="M18 22v-2h4v2" />
      </motion.g>
      {/* Handles */}
      <path d="M8 26H5" />
      <path d="M32 26h3" />
      {/* Rising steam wisps */}
      <motion.path
        d="M14 16 Q12 12 14 8"
        strokeWidth="1.5" fill="none"
        animate={{ y: [2, -6], opacity: [0, 0.5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.path
        d="M20 15 Q22 11 20 7"
        strokeWidth="1.5" fill="none"
        animate={{ y: [2, -7], opacity: [0, 0.55, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
      />
      <motion.path
        d="M26 16 Q28 12 26 8"
        strokeWidth="1.5" fill="none"
        animate={{ y: [2, -5], opacity: [0, 0.45, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
      />
    </svg>
  );
}

// ── Animated Delivery (Fast Delivery) ────────────────────
export function DeliveryIcon({ animated = true }: { animated?: boolean }) {
  if (!animated) {
    return (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="14" width="24" height="14" rx="2" fill="#f97316" stroke="none" opacity="0.15" />
        <rect x="2" y="14" width="24" height="14" rx="2" />
        <path d="M26 18h5l4 5v5h-9V18z" />
        <circle cx="11" cy="30" r="3" fill="#f97316" />
        <circle cx="31" cy="30" r="3" fill="#f97316" />
        <line x1="2" y1="10" x2="12" y2="10" opacity="0.5" />
        <line x1="4" y1="6" x2="10" y2="6" opacity="0.3" />
      </svg>
    );
  }

  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Truck body */}
      <motion.g
        animate={{ x: [0, 1, -0.5, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="2" y="14" width="24" height="14" rx="2" fill="#f97316" stroke="none" opacity="0.15" />
        <rect x="2" y="14" width="24" height="14" rx="2" />
        <path d="M26 18h5l4 5v5h-9V18z" />
        {/* Wheels */}
        <motion.circle
          cx="11" cy="30" r="3" fill="#f97316"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "11px 30px" }}
        />
        <motion.circle
          cx="31" cy="30" r="3" fill="#f97316"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "31px 30px" }}
        />
        {/* Wheel spokes */}
        <motion.line x1="11" y1="27" x2="11" y2="33" stroke="white" strokeWidth="1"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "11px 30px" }}
        />
        <motion.line x1="31" y1="27" x2="31" y2="33" stroke="white" strokeWidth="1"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "31px 30px" }}
        />
      </motion.g>
      {/* Speed lines */}
      <motion.line
        x1="-2" y1="18" x2="6" y2="18"
        stroke="#f97316" strokeWidth="1.5" opacity="0.4"
        animate={{ x: [8, -6], opacity: [0, 0.5, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.line
        x1="-4" y1="22" x2="4" y2="22"
        stroke="#f97316" strokeWidth="1.5" opacity="0.3"
        animate={{ x: [6, -8], opacity: [0, 0.4, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
      />
      <motion.line
        x1="-1" y1="26" x2="5" y2="26"
        stroke="#f97316" strokeWidth="1.5" opacity="0.3"
        animate={{ x: [7, -5], opacity: [0, 0.35, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
      />
    </svg>
  );
}

// ── Animated Cloche (Event Catering) ─────────────────────
export function ClocheIcon({ animated = true }: { animated?: boolean }) {
  if (!animated) {
    return (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 28h32" />
        <path d="M8 28c0-8 5.4-14 12-14s12 6 12 14" fill="#f97316" opacity="0.15" stroke="none" />
        <path d="M8 28c0-8 5.4-14 12-14s12 6 12 14" />
        <circle cx="20" cy="12" r="2" fill="#f97316" />
        <path d="M4 28v3a1 1 0 001 1h30a1 1 0 001-1v-3" />
        <path d="M16 8c-1-2 0-4 2-5" opacity="0.3" />
        <path d="M20 7c0-2.5 1-4 3-5" opacity="0.3" />
      </svg>
    );
  }

  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Base plate */}
      <path d="M4 28h32" />
      <path d="M4 28v3a1 1 0 001 1h30a1 1 0 001-1v-3" />

      {/* Dome — lifts and settles */}
      <motion.g
        animate={{
          y: [0, -3, 0],
          rotate: [0, 1, -0.5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.4, 1],
        }}
        style={{ transformOrigin: "20px 28px" }}
      >
        <path
          d="M8 28c0-8 5.4-14 12-14s12 6 12 14"
          fill="#f97316" opacity="0.12" stroke="none"
        />
        <path d="M8 28c0-8 5.4-14 12-14s12 6 12 14" />
        <motion.circle
          cx="20" cy="12" r="2" fill="#f97316"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.g>

      {/* Steam wisps — appear when dome lifts */}
      <motion.path
        d="M16 8 Q14 4 16 1"
        stroke="#f97316" strokeWidth="1.5" fill="none"
        animate={{
          y: [4, -4],
          opacity: [0, 0.5, 0],
          pathLength: [0, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 0.2 }}
      />
      <motion.path
        d="M20 7 Q21 3 20 0"
        stroke="#f97316" strokeWidth="1.5" fill="none"
        animate={{
          y: [4, -5],
          opacity: [0, 0.6, 0],
          pathLength: [0, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
      />
      <motion.path
        d="M24 8 Q26 4 24 1"
        stroke="#f97316" strokeWidth="1.5" fill="none"
        animate={{
          y: [4, -3],
          opacity: [0, 0.4, 0],
          pathLength: [0, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
      />
    </svg>
  );
}
