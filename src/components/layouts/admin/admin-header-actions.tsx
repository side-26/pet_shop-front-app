'use client';

import { Ellipsis, ListFilter, Plus, RotateCcw } from 'lucide-react';
import { Fragment, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  type AdminHeaderAction,
  type AdminHeaderActions,
  useAdminLayoutContext,
} from '@/contexts/admin/layout/admin-layout-context';

const BUILT_IN_ACTION_KEYS = ['add-new-item', 'filter', 'reload'] as const;

type BuiltInActionKey = (typeof BUILT_IN_ACTION_KEYS)[number];

type ResolvedHeaderAction = Readonly<{
  action: () => void;
  icon: ReactNode;
  key: string;
  name: string;
  order: number;
  presentation: 'button' | 'icon';
}>;

const builtInActionDetails: Record<
  BuiltInActionKey,
  Readonly<{ icon: ReactNode; presentation: ResolvedHeaderAction['presentation'] }>
> = {
  'add-new-item': { icon: <Plus aria-hidden="true" />, presentation: 'button' },
  filter: { icon: <ListFilter aria-hidden="true" />, presentation: 'icon' },
  reload: { icon: <RotateCcw aria-hidden="true" />, presentation: 'icon' },
};

function isHeaderAction(value: AdminHeaderAction | number | undefined): value is AdminHeaderAction {
  return typeof value === 'object' && value !== null;
}

function getBuiltInActionName(key: BuiltInActionKey, entityName: string): string {
  if (key === 'add-new-item') return `Add new ${entityName}`;
  if (key === 'filter') return 'Filter';
  return 'Reload';
}

function resolveHeaderActions(
  headerActions: AdminHeaderActions,
  entityName: string,
): ReadonlyArray<ResolvedHeaderAction> {
  return Object.entries(headerActions)
    .flatMap(([key, configuration]) => {
      if (key === 'lastVisibleOrder' || !isHeaderAction(configuration)) return [];

      const builtInKey = BUILT_IN_ACTION_KEYS.find((candidate) => candidate === key);
      const builtInDetails = builtInKey ? builtInActionDetails[builtInKey] : undefined;

      return [
        {
          action: configuration.action,
          icon: configuration.icon ?? builtInDetails?.icon,
          key,
          name:
            configuration.name ?? (builtInKey ? getBuiltInActionName(builtInKey, entityName) : key),
          order: configuration.order,
          presentation: builtInDetails?.presentation ?? 'button',
        },
      ];
    })
    .sort((first, second) => first.order - second.order || first.key.localeCompare(second.key));
}

function VisibleHeaderAction({ action }: Readonly<{ action: ResolvedHeaderAction }>) {
  if (action.presentation === 'icon') {
    const button = (
      <Button iconOnly variant="tonal" aria-label={action.name} onClick={action.action}>
        {action.icon}
      </Button>
    );

    return action.key === 'filter' ? (
      <Tooltip>
        <TooltipTrigger render={button} />
        <TooltipContent>{action.name}</TooltipContent>
      </Tooltip>
    ) : (
      button
    );
  }

  return (
    <Button variant="tonal" onClick={action.action}>
      {action.icon ? <Fragment>{action.icon}</Fragment> : null}
      {action.name}
    </Button>
  );
}

export function AdminHeaderActions() {
  const { entityName, headerActions } = useAdminLayoutContext();
  const actions = resolveHeaderActions(headerActions, entityName);
  const visibleActions = actions.filter(({ order }) => order <= headerActions.lastVisibleOrder);
  const overflowActions = actions.filter(({ order }) => order > headerActions.lastVisibleOrder);

  if (actions.length === 0) return null;

  return (
    <div className="tw:flex tw:items-center tw:gap-2" data-slot="admin-header-actions">
      {visibleActions.map((action) => (
        <VisibleHeaderAction key={action.key} action={action} />
      ))}

      {overflowActions.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button iconOnly variant="tonal" aria-label="More header actions" />}
          >
            <Ellipsis aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {overflowActions.map((action) => (
                <DropdownMenuItem key={action.key} onClick={action.action}>
                  {action.icon}
                  {action.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}
