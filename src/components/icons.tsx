import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps): IconProps => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  ...props,
});

export const CartIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6h15l-1.5 9h-12z" />
    <path d="M6 6 5 3H2" />
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="18" cy="20" r="1.5" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base({ strokeWidth: 3, ...p })}>
    <path d="m5 12.5 4.500 4.500L19 7.500" />
  </svg>
);

export const InfoIcon = (p: IconProps) => (
  <svg {...base({ strokeWidth: 3, ...p })}>
    <path d="M12 8v.01M12 12v5" />
  </svg>
);

export const TrashIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
  </svg>
);

export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.500-3.500" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const ArrowLeftIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const LeafIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 4C9 4 4 10 4 17c0 1 .2 2 .5 3C6 14 10 10 16 8c-4 3-7 7-8.500 12 .8.2 1.600.3 2.500.3C17 20.300 21 14 20 4z" />
  </svg>
);

export const SpinnerIcon = (p: IconProps) => (
  <svg {...base({ className: 'animate-spin', ...p })}>
    <path d="M12 3a9 9 0 1 0 9 9" />
  </svg>
);
