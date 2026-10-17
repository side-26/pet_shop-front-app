'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { useDetectMobileViewport } from '@/hooks/use-detect-mobile-viewport';

function useRevealOnView<TElement extends HTMLElement>() {
  const elementRef = useRef<TElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || isInView) return;

    if (!('IntersectionObserver' in window)) {
      const animationFrame = requestAnimationFrame(() => setIsInView(true));
      return () => cancelAnimationFrame(animationFrame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setIsInView(true);
        observer.disconnect();
      },
      { threshold: 0.2 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isInView]);

  return { elementRef, isInView };
}

type RevealSectionProps = Readonly<{
  children: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
}>;

export function RevealSection({ children, className, id, labelledBy }: RevealSectionProps) {
  const { elementRef, isInView } = useRevealOnView<HTMLElement>();

  return (
    <section
      ref={elementRef}
      id={id}
      aria-labelledby={labelledBy}
      className={cn('tw:fade-in', className)}
      data-reveal-in-view={isInView || undefined}
    >
      {children}
    </section>
  );
}

export function RevealItem({
  children,
  className,
}: Readonly<{ children: ReactNode; className?: string }>) {
  return <div className={cn('tw:fade-in', className)}>{children}</div>;
}

export function ParallaxMedia({
  children,
  className,
}: Readonly<{ children: ReactNode; className?: string }>) {
  const isMobileViewport = useDetectMobileViewport();
  const prefersReducedMotion = useReducedMotion();

  if (isMobileViewport || prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return <ActiveParallaxMedia className={className}>{children}</ActiveParallaxMedia>;
}

function ActiveParallaxMedia({
  children,
  className,
}: Readonly<{ children: ReactNode; className?: string }>) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: mediaRef,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <motion.div ref={mediaRef} className={cn('tw:will-change-transform', className)} style={{ y }}>
      {children}
    </motion.div>
  );
}
