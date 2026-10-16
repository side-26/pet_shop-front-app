'use client';

import { Suspense, type ComponentType } from 'react';

import {
  AnimatedStaggeredList,
  type AnimatedStaggeredListProps,
} from '@/components/common/staggered-list';

export type DynamicPromiseComponent = ComponentType;

export type LazyStaggeredListProps = Readonly<
  Omit<AnimatedStaggeredListProps, 'children'> & {
    dynamicPromiseComponent: DynamicPromiseComponent;
  }
>;

export function LazyStaggeredList({ dynamicPromiseComponent, ...props }: LazyStaggeredListProps) {
  const DynamicPromiseComponent = dynamicPromiseComponent;

  return (
    <Suspense fallback={null}>
      <AnimatedStaggeredList {...props}>
        <DynamicPromiseComponent />
      </AnimatedStaggeredList>
    </Suspense>
  );
}
