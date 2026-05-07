import { ChevronUp } from 'lucide-react';
import { useEffect, useState, type JSX } from 'react';

import { useLocale } from '../i18n/useLocale';
import { goToTopButtonClass } from './variants/goToTopButton.variants';

/** Past promo + sticky header fold — hides control while still in top “landing” scroll band */
const SHOW_AFTER_SCROLL_Y = 120;

export function GoToTopButton(): JSX.Element {
  const { t } = useLocale();
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
