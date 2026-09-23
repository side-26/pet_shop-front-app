import type { ComponentPropsWithoutRef } from 'react';

import type { MapPluginPosition } from '@/entities/map/map.dto';
import { cn } from '@/lib/utils';

const positionClassNames: Record<MapPluginPosition, string> = {
  'top-right': 'tw:right-3 tw:top-3',
  'top-left': 'tw:left-3 tw:top-3',
  'bottom-left': 'tw:bottom-3 tw:left-3',
  'bottom-right': 'tw:bottom-3 tw:right-3',
};

export type NeshanMapPluginWrapperProps = ComponentPropsWithoutRef<'div'> &
  Readonly<{
    /** The fixed map corner in which the plugin group is rendered. */
    position?: MapPluginPosition;
  }>;

/**
 * Positions one or more map plugins in a fixed corner of a relative map container.
 * Children stack vertically so controls in the same corner stay aligned.
 */
export function NeshanMapPluginWrapper({
  className,
  position = 'top-left',
  ...props
}: NeshanMapPluginWrapperProps) {
  return (
    <div
      {...props}
      className={cn(
        'tw:absolute tw:z-1 tw:flex tw:flex-col tw:items-stretch tw:gap-2',
        positionClassNames[position],
        className,
      )}
    />
  );
}
