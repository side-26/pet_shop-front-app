'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentProps,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { tv, type VariantProps } from 'tailwind-variants';

import { formatCountdown, getCountdownParts, normalizeCountdownSeconds } from './countdown.helpers';
import { cn } from '@/lib/utils';

const countdownVariants = tv({
  slots: {
    root: 'tw:inline-flex tw:items-center tw:font-mono tw:tabular-nums',
    digitGroup: 'tw:inline-flex tw:items-center',
    digit: [
      'tw:relative tw:isolate tw:grid tw:shrink-0 tw:place-items-center tw:overflow-hidden tw:rounded-md tw:border tw:font-semibold tw:leading-none tw:shadow-sm',
      'tw:[perspective:320px] tw:after:pointer-events-none tw:after:absolute tw:after:inset-x-0 tw:after:top-1/2 tw:after:border-t tw:after:border-current/15',
    ],
    digitFace: 'tw:col-start-1 tw:row-start-1 tw:grid tw:size-full tw:place-items-center',
    separator: 'tw:font-semibold tw:leading-none tw:opacity-75',
  },
  variants: {
    size: {
      xs: {
        root: 'tw:gap-1',
        digitGroup: 'tw:gap-0.5',
        digit: 'tw:h-6 tw:min-w-4 tw:px-0.5 tw:text-xs',
        separator: 'tw:text-xs',
      },
      sm: {
        root: 'tw:gap-1',
        digitGroup: 'tw:gap-0.5',
        digit: 'tw:h-8 tw:min-w-5 tw:px-0.5 tw:text-sm',
        separator: 'tw:text-sm',
      },
      md: {
        root: 'tw:gap-1.5',
        digitGroup: 'tw:gap-1',
        digit: 'tw:h-10 tw:min-w-7 tw:px-1 tw:text-lg',
        separator: 'tw:text-lg',
      },
      lg: {
        root: 'tw:gap-2',
        digitGroup: 'tw:gap-1',
        digit: 'tw:h-12 tw:min-w-8 tw:px-1.5 tw:text-xl',
        separator: 'tw:text-xl',
      },
      xl: {
        root: 'tw:gap-2',
        digitGroup: 'tw:gap-1.5',
        digit: 'tw:h-14 tw:min-w-10 tw:px-2 tw:text-2xl',
        separator: 'tw:text-2xl',
      },
    },
    color: {
      primary: {
        digit: 'tw:border-primary/40 tw:bg-primary-muted tw:text-primary-muted-foreground',
        separator: 'tw:text-primary',
      },
      secondary: {
        digit: 'tw:border-secondary/50 tw:bg-secondary-muted tw:text-secondary-muted-foreground',
        separator: 'tw:text-secondary-active',
      },
      info: {
        digit: 'tw:border-info/40 tw:bg-info-muted tw:text-info-muted-foreground',
        separator: 'tw:text-info',
      },
      success: {
        digit: 'tw:border-success/40 tw:bg-success-muted tw:text-success-muted-foreground',
        separator: 'tw:text-success',
      },
      warning: {
        digit: 'tw:border-warning/50 tw:bg-warning-muted tw:text-warning-muted-foreground',
        separator: 'tw:text-warning-active',
      },
      error: {
        digit: 'tw:border-error/40 tw:bg-error-muted tw:text-error-muted-foreground',
        separator: 'tw:text-error',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
});

type CountdownVariantProps = VariantProps<typeof countdownVariants>;

export type CountdownRef = {
  reset: () => void;
};

export type CountdownProps = Omit<ComponentProps<'div'>, 'children' | 'color'> &
  CountdownVariantProps & {
    seconds: number;
  };

type CountdownDigitProps = {
  value: string;
  className: string;
  faceClassName: string;
  reduceMotion: boolean;
};

type CountdownTimerState = {
  duration: number;
  remainingSeconds: number;
};

function CountdownDigit({ value, className, faceClassName, reduceMotion }: CountdownDigitProps) {
  return (
    <span aria-hidden="true" className={className}>
      <AnimatePresence initial={false}>
        <motion.span
          key={value}
          className={faceClassName}
          initial={
            reduceMotion ? false : { rotateX: -90, opacity: 0.35, transformOrigin: '50% 100%' }
          }
          animate={{ rotateX: 0, opacity: 1, transformOrigin: '50% 50%' }}
          exit={
            reduceMotion ? undefined : { rotateX: 90, opacity: 0.35, transformOrigin: '50% 0%' }
          }
          transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

type CountdownDigitGroupProps = {
  value: string;
  digitGroupClassName: string;
  digitClassName: string;
  faceClassName: string;
  reduceMotion: boolean;
};

function CountdownDigitGroup({
  value,
  digitGroupClassName,
  digitClassName,
  faceClassName,
  reduceMotion,
}: CountdownDigitGroupProps) {
  return (
    <span aria-hidden="true" className={digitGroupClassName}>
      {[...value].map((digit, index) => (
        <CountdownDigit
          key={index}
          value={digit}
          className={digitClassName}
          faceClassName={faceClassName}
          reduceMotion={reduceMotion}
        />
      ))}
    </span>
  );
}

const Countdown = forwardRef<CountdownRef, CountdownProps>(function Countdown(
  { seconds, size = 'md', color = 'primary', className, 'aria-label': ariaLabel, ...props },
  ref,
) {
  const duration = normalizeCountdownSeconds(seconds);
  const [timerState, setTimerState] = useState<CountdownTimerState>({
    duration,
    remainingSeconds: duration,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const deadlineRef = useRef(0);
  const reduceMotion = Boolean(useReducedMotion());

  const stopTimer = useCallback(() => {
    if (intervalRef.current === null) return;

    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  if (timerState.duration !== duration) {
    setTimerState({ duration, remainingSeconds: duration });
  }

  const scheduleTimer = useCallback(
    (nextDuration: number) => {
      stopTimer();

      if (nextDuration === 0) return;

      deadlineRef.current = Date.now() + nextDuration * 1000;
      intervalRef.current = setInterval(() => {
        const nextRemainingSeconds = Math.max(
          0,
          Math.ceil((deadlineRef.current - Date.now()) / 1000),
        );

        setTimerState((currentState) =>
          currentState.duration === nextDuration &&
          currentState.remainingSeconds === nextRemainingSeconds
            ? currentState
            : { duration: nextDuration, remainingSeconds: nextRemainingSeconds },
        );

        if (nextRemainingSeconds === 0) stopTimer();
      }, 250);
    },
    [stopTimer],
  );

  useEffect(() => {
    scheduleTimer(duration);

    return stopTimer;
  }, [duration, scheduleTimer, stopTimer]);

  useImperativeHandle(
    ref,
    () => ({
      reset: () => {
        setTimerState({ duration, remainingSeconds: duration });
        scheduleTimer(duration);
      },
    }),
    [duration, scheduleTimer],
  );

  const remainingSeconds =
    timerState.duration === duration ? timerState.remainingSeconds : duration;
  const parts = getCountdownParts(remainingSeconds);
  const formattedTime = formatCountdown(remainingSeconds);
  const styles = countdownVariants({ size, color });
  const digitGroupProps = {
    digitGroupClassName: styles.digitGroup(),
    digitClassName: styles.digit(),
    faceClassName: styles.digitFace(),
    reduceMotion,
  };

  return (
    <div
      {...props}
      role="timer"
      aria-atomic="true"
      aria-label={ariaLabel ?? `زمان باقی‌مانده: ${formattedTime}`}
      dir="ltr"
      data-slot="countdown"
      data-size={size}
      data-color={color}
      className={cn(styles.root(), className)}
    >
      {parts.hours !== null && (
        <>
          <CountdownDigitGroup value={parts.hours} {...digitGroupProps} />
          <span aria-hidden="true" className={styles.separator()}>
            :
          </span>
        </>
      )}
      <CountdownDigitGroup value={parts.minutes} {...digitGroupProps} />
      <span aria-hidden="true" className={styles.separator()}>
        :
      </span>
      <CountdownDigitGroup value={parts.seconds} {...digitGroupProps} />
    </div>
  );
});

export { Countdown, countdownVariants };
