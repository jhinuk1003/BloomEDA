"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Petal {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  duration: number;
  delay: number;
  color: string;
}

export function BotanicalBackground() {
  const shouldReduceMotion = useReducedMotion();
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Generate gentle petals
    const colors = ["#F5D6CC", "#E3D5C5", "#FCEEE9", "#DCE6DC", "#F0E0D6"];
    const generated: Petal[] = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 14 + 10,
      rotation: Math.random() * 360,
      duration: Math.random() * 12 + 16,
      delay: Math.random() * 6,
      color: colors[i % colors.length],
    }));
    setPetals(generated);
  }, []);

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-60">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            top: `${petal.y}%`,
            width: petal.size,
            height: petal.size * 1.5,
          }}
          animate={{
            y: [0, 40, 90, 160],
            x: [0, 15, -10, 25],
            rotate: [petal.rotation, petal.rotation + 90, petal.rotation + 180, petal.rotation + 270],
            opacity: [0, 0.4, 0.6, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path
              d="M10 0C16 10 20 20 10 30C0 20 4 10 10 0Z"
              fill={petal.color}
              fillOpacity="0.8"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
