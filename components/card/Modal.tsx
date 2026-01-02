"use client";

import { motion } from "framer-motion";
import React from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ children, onClose }: ModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <motion.div
        className="relative z-10 w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-xl border border-rose-100"
        initial={{ scale: 0.95, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 10, opacity: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 20 }}
      >
        <button
          className="absolute right-3 top-3 text-rose-400 hover:text-rose-600"
          onClick={onClose}
          aria-label="Tutup"
        >
          ✕
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}





