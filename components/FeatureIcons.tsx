"use client";

import { motion } from "framer-motion";

// ── Animated Flame (Made Fresh) ──────────────────────────
export function FlameIcon({ animated = true }: { animated?: boolean }) {
  if (!animated) {
    return (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path
          d="M20 4c0 0-8 8-8 16a8 8 0 0016 0c0-3-1.5-5.5-3-7.5 0 0-.5 3-3 4.5-1-3-2-6.5-2-13z"
          fill="#f97316"
        />
        <path
          d="M20 18c0 0-3 2.5-3 6a3 3 0 006 0c0-1.5-.8-2.5-1.5-3.5 0 0-.2 1.2-1.5 2-.3-1.2-.5-2.5-.5-4.5z"
          fill="#fbbf24"
        />
      </svg>
    );
  }

  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      {/* Outer flame */}
      <motion.path
        d="M20 4c0 0-8 8-8 16a8 8 0 0016 0c0-3-1.5-5.5-3-7.5 0 0-.5 3-3 4.5-1-3-2-6.5-2-13z"
        fill="#f97316"
        animate={{
          d: [
            "M20 4c0 0-8 8-8 16a8 8 0 0016 0c0-3-1.5-5.5-3-7.5 0 0-.5 3-3 4.5-1-3-2-6.5-2-13z",
            "M20 6c0 0-9 7-9 15a9 9 0 0018 0c0-3.5-2-6-3.5-8 0 0-1 3.5-3.5 4-0.5-2.5-1.5-5.5-2-11z",
            "M20 4c0 0-8 8-8 16a8 8 0 0016 0c0-3-1.5-5.5-3-7.5 0 0-.5 3-3 4.5-1-3-2-6.5-2-13z",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Inner flame */}
      <motion.path
        d="M20 18c0 0-3 2.5-3 6a3 3 0 006 0c0-1.5-.8-2.5-1.5-3.5 0 0-.2 1.2-1.5 2-.3-1.2-.5-2.5-.5-4.5z"
        fill="#fbbf24"
        animate={{
          d: [
            "M20 18c0 0-3 2.5-3 6a3 3 0 006 0c0-1.5-.8-2.5-1.5-3.5 0 0-.2 1.2-1.5 2-.3-1.2-.5-2.5-.5-4.5z",
            "M20 17c0 0-3.5 3-3.5 6.5a3.5 3.5 0 007 0c0-1.8-1-3-1.8-4 0 0-.3 1.5-1.7 2.2-.4-1.5-.8-3-.5-4.7z",
            "M20 18c0 0-3 2.5-3 6a3 3 0 006 0c0-1.5-.8-2.5-1.5-3.5 0 0-.2 1.2-1.5 2-.3-1.2-.5-2.5-.5-4.5z",
          ],
          opacity: [0.9, 1, 0.9],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Sparks */}
      <motion.circle
        cx="16" cy="10" r="1"
        fill="#fbbf24"
        animate={{ y: [0, -6, -12], opacity: [0, 0.8, 0], x: [-2, -4, -3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
      <motion.circle
        cx="24" cy="12" r="0.8"
        fill="#f97316"
        animate={{ y: [0, -8, -14], opacity: [0, 0.6, 0], x: [1, 3, 2] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
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
