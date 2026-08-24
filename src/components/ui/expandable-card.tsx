'use client';

import {
    createContext,
    useCallback,
    useContext,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type ComponentProps,
    type CSSProperties,
} from 'react';

import { Button, } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*                                   Context                                  */
/* -------------------------------------------------------------------------- */

interface ExpandableCardContextValue {
    isExpanded: boolean;
    contentId: string;
    toggle: () => void;
}

const ExpandableCardContext =
    createContext<ExpandableCardContextValue | null>(null);

const useExpandableCard = () => {
    const context = useContext(ExpandableCardContext);

    if (!context) {
        throw new Error(
            'ExpandableCard compound components must be used inside ExpandableCard.Root.',
        );
    }

    return context;
};

/* -------------------------------------------------------------------------- */
/*                                    Root                                    */
/* -------------------------------------------------------------------------- */

interface ExpandableCardRootProps extends ComponentProps<typeof Card> {
    defaultExpanded?: boolean;
}

const ExpandableCardRoot = ({
    children,
    defaultExpanded = false,
    className,
    ...props
}: ExpandableCardRootProps) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const contentId = useId();

    const toggle = useCallback(() => {
        setIsExpanded((previous) => !previous);
    }, []);

    const contextValue = useMemo<ExpandableCardContextValue>(
        () => ({
            isExpanded,
            contentId,
            toggle,
        }),
        [isExpanded, contentId, toggle],
    );

    return (
        <ExpandableCardContext.Provider value={contextValue}>
            <Card

                className={cn(
                    'tw:relative tw:overflow-hidden tw:gap-0 tw:pb-0',
                    className,
                )}
                {...props}
            >
                {children}
            </Card>
        </ExpandableCardContext.Provider>
    );
};

/* -------------------------------------------------------------------------- */
/*                                   Content                                  */
/* -------------------------------------------------------------------------- */

interface ExpandableCardContentProps
    extends ComponentProps<typeof CardContent> {
    collapsedHeight: number;

    /**
     * Height of the bottom fade while collapsed.
     */
    fadeHeight?: number;

    /**
     * Disables the gradient fade.
     */
    showFade?: boolean;
}

const ExpandableCardContent = ({
    children,
    collapsedHeight,
    fadeHeight = 72,
    showFade = true,
    className,
    style,
    ...props
}: ExpandableCardContentProps) => {
    const { isExpanded, contentId } = useExpandableCard();

    const contentRef = useRef<HTMLDivElement>(null);
    const [expandedHeight, setExpandedHeight] = useState(collapsedHeight);

    useLayoutEffect(() => {
        const element = contentRef.current;

        if (!element) {
            return;
        }

        const updateHeight = () => {
            setExpandedHeight(element.scrollHeight);
        };

        updateHeight();

        const resizeObserver = new ResizeObserver(updateHeight);

        resizeObserver.observe(element);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    const height = isExpanded
        ? Math.max(expandedHeight + 16, collapsedHeight)
        : collapsedHeight;

    return (
        <div
            id={contentId}
            className={cn(
                'tw:relative',
                'tw:overflow-hidden tw:flex-none',
                'tw:transition-[height]',
                'tw:duration-300',
                'tw:ease-in-out',
            )}
            style={{
                height,
            }}
        >
            <CardContent
                ref={contentRef}
                className={cn('tw:relative', className)}
                style={style}
                {...props}
            >
                {children}
            </CardContent>

            {showFade && (
                <div
                    aria-hidden="true"
                    className={cn(
                        'tw:pointer-events-none',
                        'tw:absolute tw:inset-x-0 tw:bottom-0',
                        'tw:bg-linear-to-t',
                        'tw:from-background tw:via-background/80 tw:to-transparent',
                        'tw:transition-opacity tw:duration-200',
                        isExpanded
                            ? 'tw:opacity-0'
                            : 'tw:opacity-100',
                    )}
                    style={
                        {
                            height: fadeHeight,
                        } satisfies CSSProperties
                    }
                />
            )}
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*                                   Trigger                                  */
/* -------------------------------------------------------------------------- */

type ExpandableCardTriggerProps = ComponentProps<typeof Button> & {
    expandedLabel?: React.ReactNode;
    collapsedLabel?: React.ReactNode;
};

const ExpandableCardTrigger = ({
    children,
    expandedLabel,
    collapsedLabel,
    className,
    onClick,
    ...props
}: ExpandableCardTriggerProps) => {
    const { isExpanded, contentId, toggle } = useExpandableCard();

    const content =
        children ??
        (isExpanded
            ? expandedLabel ?? 'Show less'
            : collapsedLabel ?? 'Show more');

    return (
        <CardAction
            className={cn(
                'tw:relative tw:z-10',
                'tw:w-full',
                'tw:bg-white',
                'tw:px-3 tw:py-1.5',
            )}
        >
            <Button
                type="button"
                variant="flat"
                aria-expanded={isExpanded}
                aria-controls={contentId}
                className={cn('tw:w-full', className)}
                onClick={(event) => {
                    onClick?.(event);

                    if (!event.defaultPrevented) {
                        toggle();
                    }
                }}
                {...props}
            >
                {content}
            </Button>
        </CardAction>
    );
};

/* -------------------------------------------------------------------------- */
/*                                   Export                                   */
/* -------------------------------------------------------------------------- */

export const ExpandableCard = {
    Root: ExpandableCardRoot,
    Content: ExpandableCardContent,
    Trigger: ExpandableCardTrigger,
};