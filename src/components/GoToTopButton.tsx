import { ChevronUp } from 'lucide-react';
import { useEffect, useState, type JSX } from 'react';

import { cn } from '../lib/cn';

/** Past promo + sticky header fold — hides control while still in top “landing” scroll band */
const SHOW_AFTER_SCROLL_Y = 120;

export function GoToTopButton(): JSX.Element {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = (): void => {
      setVisible(window.scrollY > SHOW_AFTER_SCROLL_Y);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      aria-hidden={visible ? undefined : true}
      tabIndex={visible ? 0 : -1}
      onClick={() => {
        const reduceMotion =
          typeof window.matchMedia !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({
          top: 0,
          behavior: reduceMotion ? 'auto' : 'smooth',
        });
      }}
      className={cn(
        'fixed bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))]',
        'right-[max(1.25rem,env(safe-area-inset-right,0px))] z-[45]',
        'md:bottom-8 md:right-8',
        'inline-flex size-12 shrink-0 items-center justify-center',
        'rounded-[10px] border border-[#E0E0E0] bg-jl-white',
        'text-jl-black shadow-card',
        'transition-[background-color,border-color,opacity,transform] duration-200 motion-reduce:transition-colors motion-reduce:duration-0 hover:border-[#BDBDBD] hover:bg-jl-gray',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-jl-white',
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100 active:translate-y-px'
          : 'pointer-events-none translate-y-2 opacity-0 motion-reduce:translate-y-0',
      )}
    >
      <ChevronUp className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
    </button>
  );
}
