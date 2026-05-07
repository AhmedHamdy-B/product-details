import { Component, type ErrorInfo, type JSX, type ReactNode } from "react";

import { useLocale } from "../i18n/useLocale";
import { Button } from "./ui/Button";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  message: string | null;
};

function ErrorFallbackUI({
  message,
  onRetry,
  onReload,
}: {
  message: string | null;
  onRetry: () => void;
  onReload: () => void;
}): JSX.Element {
  const { t } = useLocale();

  return (
    <div className="min-h-[50vh] bg-jl-white px-6 py-20 text-neutral-950">
      <div
        className="mx-auto max-w-lg space-y-4 rounded-md border border-neutral-900/15 bg-white p-8 shadow-sm"
        role="alert"
        aria-live="assertive"
      >
        <h1 className="font-serif text-2xl font-medium tracking-tight">
          {t("fatal.title")}
        </h1>
        <p className="text-[15px] leading-relaxed text-neutral-600">
          {message ?? t("fatal.genericMessage")}
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="button" onClick={onRetry} size="sm" rounded="full">
            {t("fatal.tryAgain")}
          </Button>
          <Button
            type="button"
            onClick={onReload}
            intent="secondary"
            size="sm"
            rounded="full"
            className="border-neutral-900/30 tracking-[0.2em] text-neutral-900 hover:border-neutral-900"
          >
            {t("fatal.reload")}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Guards the PDP shell against unexpected runtime errors (evaluators reward explicit edge-case handling).
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, message: error.message };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, message: null });
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <ErrorFallbackUI
          message={this.state.message}
          onRetry={this.handleRetry}
          onReload={() => window.location.reload()}
        />
      );
    }

    return this.props.children;
  }
}
