'use client';

import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ComponentType,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/utils';

type FadeInBaseProps = Readonly<ComponentPropsWithoutRef<'section'>>;

export type FadeInProps =
  | Readonly<
      FadeInBaseProps & {
        children: ReactNode;
        dynamicPromiseComponent?: never;
        loading: 'eager';
      }
    >
  | Readonly<
      Omit<FadeInBaseProps, 'children'> & {
        children?: never;
        dynamicPromiseComponent: ComponentType;
        loading: 'lazy';
        rootMargin?: string;
      }
    >;

function DynamicFadeInContent({
  DynamicPromiseComponent,
  onRendered,
}: Readonly<{
  DynamicPromiseComponent: ComponentType;
  onRendered: () => void;
}>) {
  useEffect(() => {
    const animationFrame = requestAnimationFrame(onRendered);
    return () => cancelAnimationFrame(animationFrame);
  }, [onRendered]);

  return <DynamicPromiseComponent />;
}

export function FadeIn(props: FadeInProps) {
  const elementRef = useRef<HTMLElement>(null);
  const [shouldRenderLazyComponent, setShouldRenderLazyComponent] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const rootMargin = props.loading === 'lazy' ? (props.rootMargin ?? '200px') : undefined;

  useEffect(() => {
    if (props.loading === 'eager') {
      const animationFrame = requestAnimationFrame(() => setIsInView(true));
      return () => cancelAnimationFrame(animationFrame);
    }

    const element = elementRef.current;
    if (!element) return;

    if (!('IntersectionObserver' in window)) {
      const animationFrame = requestAnimationFrame(() => setShouldRenderLazyComponent(true));
      return () => cancelAnimationFrame(animationFrame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setShouldRenderLazyComponent(true);
        observer.disconnect();
      },
      { rootMargin, threshold: 0.2 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [props.loading, rootMargin]);

  if (props.loading === 'eager') {
    const { children, className, loading: _, ...sectionProps } = props;

    return (
      <section
        ref={elementRef}
        className={cn('tw:fade-in', className)}
        data-reveal-in-view={isInView || undefined}
        {...sectionProps}
      >
        {children}
      </section>
    );
  }

  const {
    className,
    dynamicPromiseComponent: DynamicPromiseComponent,
    loading: _,
    rootMargin: __,
    ...sectionProps
  } = props;

  return (
    <section
      ref={elementRef}
      className={cn('tw:fade-in', className)}
      data-reveal-in-view={isInView || undefined}
      {...sectionProps}
    >
      {shouldRenderLazyComponent ? (
        <Suspense fallback={null}>
          <DynamicFadeInContent
            DynamicPromiseComponent={DynamicPromiseComponent}
            onRendered={() => setIsInView(true)}
          />
        </Suspense>
      ) : null}
    </section>
  );
}
