'use client';

import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  typography,
  typographyFallbackGroups,
  typographyGroups,
  type Typography,
  type TypographyGroup,
} from '@/configs/typography.constant';

import { cn } from '@/lib/utils';

type FitTextOwnProps<T extends ElementType> = {
  as?: T;
  variant: TypographyGroup;
  children: ReactNode;
  className?: string;
};

type FitTextProps<T extends ElementType> = FitTextOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof FitTextOwnProps<T>>;

export function FitText<T extends ElementType = 'div'>({
  as,
  variant,
  children,
  className,
  ...props
}: FitTextProps<T>) {
  const Component = (as ?? 'div') as ElementType;

  const ref = useRef<HTMLElement>(null);

  /**
   * Resolve the complete fallback chain.
   *
   * heading:
   * heading-1
   * heading-2
   * heading-3
   * title-l
   * title-m
   * ...
   */
  const levels = useMemo<readonly Typography[]>(() => {
    return typographyFallbackGroups[variant].flatMap((group) => typographyGroups[group]);
  }, [variant]);

  const [levelIndex, setLevelIndex] = useState(0);
  const [isTruncated, setIsTruncated] = useState(false);

  const currentLevel = levels[levelIndex] ?? levels[0];

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element || levels.length === 0) return;

    let frameId: number | undefined;

    /**
     * Remove every typography class that FitText
     * is responsible for.
     */
    const clearTypographyClasses = () => {
      for (const level of levels) {
        element.classList.remove(typography[level]);
      }
    };

    const fit = () => {
      clearTypographyClasses();

      let matchedIndex = levels.length - 1;
      let hasMatch = false;

      /**
       * Try from largest/preferred typography
       * toward the smallest fallback.
       */
      for (let index = 0; index < levels.length; index++) {
        const level = levels[index];
        const className = typography[level];

        element.classList.add(className);

        const fits = element.scrollWidth <= element.clientWidth;

        if (fits) {
          matchedIndex = index;
          hasMatch = true;
          break;
        }

        element.classList.remove(className);
      }

      /**
       * Ensure the final matching typography is
       * actually present in the DOM immediately.
       *
       * This avoids waiting for the React render
       * caused by setLevelIndex().
       */
      clearTypographyClasses();

      element.classList.add(typography[levels[matchedIndex]]);

      setLevelIndex((current) => (current === matchedIndex ? current : matchedIndex));
      setIsTruncated((current) => (current === !hasMatch ? current : !hasMatch));
    };

    /**
     * Schedule measurement after layout changes.
     */
    const scheduleFit = () => {
      if (frameId !== undefined) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(fit);
    };

    scheduleFit();

    const resizeObserver = new ResizeObserver(scheduleFit);

    resizeObserver.observe(element);

    /**
     * Custom fonts can change the rendered text width
     * after the first measurement.
     */
    document.fonts?.ready.then(scheduleFit);

    return () => {
      resizeObserver.disconnect();

      if (frameId !== undefined) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [children, levels]);

  if (!currentLevel) {
    return null;
  }

  return (
    <Component
      ref={ref}
      className={cn(
        typography[currentLevel],
        'tw:whitespace-nowrap',
        isTruncated && 'tw:truncate',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
