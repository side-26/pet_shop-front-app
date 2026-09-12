'use client';

import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

const groupVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
  },
};

type RevealSectionProps = Readonly<{
  children: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
}>;

export function RevealSection({ children, className, id, labelledBy }: RevealSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      aria-labelledby={labelledBy}
      className={className}
      initial={prefersReducedMotion ? false : 'hidden'}
      whileInView={prefersReducedMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.16 }}
      variants={groupVariants}
    >
      {children}
    </motion.section>
  );
}

export function RevealItem({
  children,
  className,
}: Readonly<{ children: ReactNode; className?: string }>) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

export function HeroSequence({
  children,
  className,
}: Readonly<{ children: ReactNode; className?: string }>) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? false : 'hidden'}
      animate={prefersReducedMotion ? undefined : 'visible'}
      variants={groupVariants}
    >
      {children}
    </motion.div>
  );
}

export function ParallaxMedia({
  children,
  className,
}: Readonly<{ children: ReactNode; className?: string }>) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: mediaRef,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <motion.div
      ref={mediaRef}
      className={cn(!prefersReducedMotion && 'tw:will-change-transform', className)}
      style={prefersReducedMotion ? undefined : { y }}
    >
      {children}
    </motion.div>
  );
}
