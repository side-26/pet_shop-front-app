'use client';

import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.62,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
      delayChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
  },
};

type MotionSectionProps = Readonly<{
  children: ReactNode;
  className?: string;
  cacheSection?: string;
  labelledBy?: string;
  id?: string;
}>;

export function MotionSection({
  children,
  className,
  cacheSection,
  labelledBy,
  id,
}: MotionSectionProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      aria-labelledby={labelledBy}
      data-cache-section={cacheSection}
      className={className}
      initial={reducedMotion ? false : 'hidden'}
      whileInView={reducedMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.14 }}
      variants={sectionVariants}
    >
      {children}
    </motion.section>
  );
}

export function MotionItem({
  children,
  className,
}: Readonly<{ children: ReactNode; className?: string }>) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

export function HeroMotion({
  children,
  className,
}: Readonly<{ children: ReactNode; className?: string }>) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : 'hidden'}
      animate={reducedMotion ? undefined : 'visible'}
      variants={sectionVariants}
    >
      {children}
    </motion.div>
  );
}

export function ParallaxProductMedia({
  children,
  className,
}: Readonly<{ children: ReactNode; className?: string }>) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: mediaRef,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [32, -32]);

  return (
    <motion.div
      ref={mediaRef}
      className={cn(!reducedMotion && 'tw:will-change-transform', className)}
      style={reducedMotion ? undefined : { y }}
    >
      {children}
    </motion.div>
  );
}
