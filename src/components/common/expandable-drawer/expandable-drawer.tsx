'use client';

import { forwardRef, useImperativeHandle, useRef, type ReactNode } from 'react';

import {
  ExpandableDrawerContent,
  type ExpandableDrawerContentProps,
  type ExpandableDrawerHandle,
} from './expandable-drawer-content';
import {
  ExpandableDrawerSection,
  type ExpandableDrawerSectionProps,
} from './expandable-drawer-section';

export interface ExpandableDrawerProps
  extends
    Omit<ExpandableDrawerSectionProps, 'children' | 'onShowMore' | 'color' | 'title'>,
    Omit<ExpandableDrawerContentProps, 'children'> {
  sectionChildren: ReactNode;
  drawerChildren: ReactNode;
}

/**
 * Connects a fixed-height mobile preview to its complete content in a swipeable drawer.
 */
export const ExpandableDrawer = forwardRef<ExpandableDrawerHandle, ExpandableDrawerProps>(
  function ExpandableDrawer(
    {
      sectionChildren,
      drawerChildren,
      collapsedHeight,
      showMoreLabel,
      disabled,
      title,
      description,
      color,
      ...sectionProps
    },
    ref,
  ) {
    const drawerRef = useRef<ExpandableDrawerHandle>(null);

    useImperativeHandle(
      ref,
      () => ({
        open: () => drawerRef.current?.open(),
        close: () => drawerRef.current?.close(),
        toggle: () => drawerRef.current?.toggle(),
      }),
      [],
    );

    return (
      <>
        <ExpandableDrawerSection
          {...sectionProps}
          collapsedHeight={collapsedHeight}
          showMoreLabel={showMoreLabel}
          disabled={disabled}
          onShowMore={() => drawerRef.current?.open()}
        >
          {sectionChildren}
        </ExpandableDrawerSection>
        <ExpandableDrawerContent
          ref={drawerRef}
          title={title}
          description={description}
          color={color}
        >
          {drawerChildren}
        </ExpandableDrawerContent>
      </>
    );
  },
);
