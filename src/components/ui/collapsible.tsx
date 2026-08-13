'use client';

import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';

function Collapsible(props: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger(props: CollapsiblePrimitive.Trigger.Props) {
  return <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />;
}

function CollapsibleContent(props: CollapsiblePrimitive.Panel.Props) {
  const reduceMotion = useReducedMotion();

  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-content"
      keepMounted
      render={(renderProps, state) => (
        <motion.div
          {...(renderProps as unknown as HTMLMotionProps<'div'>)}
          initial={false}
          animate={{ height: state.open ? 'auto' : 0, opacity: state.open ? 1 : 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          style={{ overflow: 'hidden' }}
        />
      )}
      {...props}
    />
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
