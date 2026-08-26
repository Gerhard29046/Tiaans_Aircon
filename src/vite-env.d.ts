interface ImportMetaEnv {
  readonly VITE_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  turnstile?: {
    render(container: HTMLElement, options: Record<string, unknown>): string | number;
    remove(widgetId: string | number): void;
  };
}
