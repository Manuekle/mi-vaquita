"use client";

import { motion } from "motion/react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.4, 
        ease: "easeOut"
      }}
      style={{ willChange: "opacity" }}
    >
      {children}
    </motion.div>
  );
}
