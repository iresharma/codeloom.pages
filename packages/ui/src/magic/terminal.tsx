"use client";

import {
  Children,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, useInView } from "motion/react";

import { cn } from "../lib/utils";

type SequenceContextValue = {
  completeItem: (index: number) => void;
  activeIndex: number;
  sequenceStarted: boolean;
};

const SequenceContext = createContext<SequenceContextValue | null>(null);
const ItemIndexContext = createContext<number | null>(null);

export function AnimatedSpan({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const sequence = useContext(SequenceContext);
  const itemIndex = useContext(ItemIndexContext);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!sequence || itemIndex === null) return;
    if (!sequence.sequenceStarted || hasStarted) return;
    if (sequence.activeIndex === itemIndex) setHasStarted(true);
  }, [sequence, hasStarted, itemIndex]);

  const shouldAnimate = sequence ? hasStarted : true;

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
      transition={{ duration: 0.3, delay: sequence ? 0 : delay / 1000 }}
      className={cn("grid text-[13px] font-normal tracking-tight", className)}
      onAnimationComplete={() => {
        if (sequence && itemIndex !== null) sequence.completeItem(itemIndex);
      }}
    >
      {children}
    </motion.div>
  );
}

export function TypingAnimation({
  children,
  className,
  duration = 28,
}: {
  children: string;
  className?: string;
  duration?: number;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  const sequence = useContext(SequenceContext);
  const itemIndex = useContext(ItemIndexContext);

  useEffect(() => {
    if (!sequence || itemIndex === null) {
      setStarted(true);
      return;
    }
    if (sequence.sequenceStarted && !started && sequence.activeIndex === itemIndex) {
      setStarted(true);
    }
  }, [sequence, itemIndex, started]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const typingEffect = setInterval(() => {
      if (i < children.length) {
        setDisplayedText(children.slice(0, i + 1));
        i += 1;
      } else {
        clearInterval(typingEffect);
        if (sequence && itemIndex !== null) sequence.completeItem(itemIndex);
      }
    }, duration);
    return () => clearInterval(typingEffect);
  }, [children, duration, started, sequence, itemIndex]);

  return (
    <span className={cn("font-mono text-[13px] tracking-tight", className)}>
      {displayedText}
      {started && displayedText.length < children.length ? (
        <span className="ml-px inline-block h-3 w-[7px] translate-y-px bg-current" />
      ) : null}
    </span>
  );
}

export function Terminal({
  children,
  className,
  title = "codeloom",
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.3, once: true });
  const [activeIndex, setActiveIndex] = useState(0);

  const contextValue = useMemo(
    () => ({
      completeItem: (index: number) => {
        setActiveIndex((current) => (index === current ? current + 1 : current));
      },
      activeIndex,
      sequenceStarted: isInView,
    }),
    [activeIndex, isInView],
  );

  const wrappedChildren = useMemo(
    () =>
      Children.toArray(children).map((child, index) => (
        <ItemIndexContext.Provider key={index} value={index}>
          {child}
        </ItemIndexContext.Provider>
      )),
    [children],
  );

  return (
    <SequenceContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={cn(
          "relative z-0 flex w-full max-w-xl flex-col overflow-hidden rounded-xl border border-white/10 bg-black/70 text-left font-mono shadow-2xl backdrop-blur",
          className,
        )}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 truncate text-[11px] text-zinc-500">{title}</span>
        </div>
        <pre className="min-h-[280px] space-y-1 overflow-auto p-4 text-zinc-200">
          {wrappedChildren}
        </pre>
      </div>
    </SequenceContext.Provider>
  );
}
