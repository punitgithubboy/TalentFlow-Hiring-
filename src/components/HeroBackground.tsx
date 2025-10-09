import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export const HeroBackground = () => {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const y3 = useTransform(scrollY, [0, 300], [0, -150]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800" />
      
      {/* Animated Gradient Overlay */}
      <motion.div
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)
          `,
        }}
        animate={{
          background: [
            `radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.3) 0%, transparent 50%),
             radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
             radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)`,
            `radial-gradient(circle at 30% 10%, rgba(99, 102, 241, 0.2) 0%, transparent 50%),
             radial-gradient(circle at 70% 90%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
             radial-gradient(circle at 60% 40%, rgba(6, 182, 212, 0.25) 0%, transparent 50%)`,
            `radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.3) 0%, transparent 50%),
             radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
             radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)`,
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating Blobs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"
        style={{ y: y1 }}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 rounded-full blur-3xl"
        style={{ y: y2 }}
        animate={{
          x: [0, -80, 0],
          y: [0, 30, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-full blur-3xl"
        style={{ y: y3 }}
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 10,
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Light Rays */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%),
            linear-gradient(-45deg, transparent 30%, rgba(255, 255, 255, 0.01) 50%, transparent 70%)
          `,
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Vignette Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-slate-900/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/10 via-transparent to-slate-900/10" />
    </div>
  );
};
