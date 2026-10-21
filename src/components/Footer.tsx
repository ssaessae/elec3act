import { STORE } from '../config/store';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>
          <span className="font-display font-semibold text-ink">{STORE.name}</span> · {STORE.tagline}
        </p>
        <p>{STORE.footerNote}</p>
      </div>
    </footer>
  );
}
