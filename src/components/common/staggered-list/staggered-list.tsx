import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

import styles from './staggered-list.module.css';

export const animatedStaggeredListItemClassName = 'animated-staggered-list-item';

export type AnimatedStaggeredListProps = Readonly<ComponentPropsWithoutRef<'section'>>;

export function AnimatedStaggeredList({
  children,
  className,
  ...props
}: AnimatedStaggeredListProps) {
  return (
    <section className={cn(styles.list, className)} {...props}>
      {children}
    </section>
  );
}
