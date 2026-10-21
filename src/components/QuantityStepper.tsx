import { MinusIcon, PlusIcon } from './icons';

interface Props {
  quantity: number;
  max: number;
  label: string; // product name, used for screen-reader labels
  onChange: (next: number) => void;
  disabled?: boolean;
}

export default function QuantityStepper({ quantity, max, label, onChange, disabled = false }: Props) {
  const buttonClass =
    'grid h-8 w-8 place-items-center rounded-full text-ink transition hover:bg-paper active:scale-90 disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-line bg-white p-0.5">
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(quantity - 1)}
        disabled={disabled}
        aria-label={`Decrease quantity of ${label}`}
      >
        <MinusIcon width={16} height={16} />
      </button>
      <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(quantity + 1)}
        disabled={disabled || quantity >= max}
        aria-label={`Increase quantity of ${label}`}
      >
        <PlusIcon width={16} height={16} />
      </button>
    </div>
  );
}
