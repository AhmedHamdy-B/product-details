import { ChevronUp } from 'lucide-react';
import { useEffect, useState, type JSX } from 'react';

import { useLocale } from '../i18n/useLocale';
import { goToTopButtonClass } from './variants/goToTopButton.variants';

/** Past promo + sticky header fold — hides control while still in top “landing” scroll band */
const SHOW_AFTER_SCROLL_Y = 120;
/** Hide near footer controls to avoid overlapping language/currency actions. */
const HIDE_BEFORE_PAGE_END_PX = 220;

export function GoToTopButton(): JSX.Element {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = (): void => {
      const scrollTop = window.scrollY;
      const viewportBottom = scrollTop + window.innerHeight;
      const pageBottom = document.documentElement.scrollHeight;
      const nearPageEnd = pageBottom - viewportBottom <= HIDE_BEFORE_PAGE_END_PX;

      setVisible(scrollTop > SHOW_AFTER_SCROLL_Y && !nearPageEnd);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      data-go-to-top-button="true"
      aria-label={t('gotoTop')}
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
      className={goToTopButtonClass({ visible })}
    >
      <ChevronUp className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
    </button>
  );
}
