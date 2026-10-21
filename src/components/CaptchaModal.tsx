import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useModalBehavior } from '../hooks/useModalBehavior';
import type { CaptchaChallenge } from '../types';
import { CheckIcon, CloseIcon } from './icons';

interface Props {
  busy: boolean;
  onClose: () => void;
  onVerified: () => Promise<void>;
}

function createChallenge(): CaptchaChallenge {
  const left = Math.floor(Math.random() * 8) + 2;
  const right = Math.floor(Math.random() * 8) + 2;
  return {
    prompt: `What is ${left} + ${right}?`,
    answer: String(left + right),
    id: Date.now() + Math.random(),
  };
}

export default function CaptchaModal({ busy, onClose, onVerified }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const verifiedTimer = useRef<number>();
  const [challenge, setChallenge] = useState(createChallenge);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  useModalBehavior(dialogRef, onClose);
  useEffect(() => () => window.clearTimeout(verifiedTimer.current), []);

  function refreshChallenge() {
    if (busy || verified) return;
    setChallenge(createChallenge());
    setAnswer('');
    setError('');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || verified) return;
    if (answer.trim() !== challenge.answer) {
      setError('Incorrect verification code. Please try again.');
      setChallenge(createChallenge());
      setAnswer('');
      return;
    }

    setError('');
    setVerified(true);
    verifiedTimer.current = window.setTimeout(() => {
      void onVerified();
    }, 650);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        className="absolute inset-0 animate-fade-in bg-ink/45 backdrop-blur-sm"
        onClick={() => {
          if (!busy && !verified) onClose();
        }}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="captcha-heading"
        tabIndex={-1}
        className="relative w-full max-w-md animate-modal-in rounded-t-[2rem] bg-white p-6 shadow-lift outline-none sm:rounded-[2rem] sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={busy || verified}
          aria-label="Close verification"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-paper text-ink transition hover:bg-line disabled:opacity-50"
        >
          <CloseIcon width={18} height={18} />
        </button>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">One quick check</p>
        <h2 id="captcha-heading" className="mt-2 font-display text-2xl font-semibold tracking-tight">
          Verify your order
        </h2>
        <p className="mt-2 text-sm text-muted">Solve this simple check to confirm you’re ready for checkout.</p>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="rounded-2xl bg-paper px-5 py-4 text-center">
            <p className="text-xs font-medium text-muted">Your verification question</p>
            <p className="mt-1 font-display text-3xl font-semibold" aria-live="polite" key={challenge.id}>
              {challenge.prompt}
            </p>
          </div>
          <label htmlFor="captcha-answer" className="mt-5 block text-sm font-medium">
            Answer
          </label>
          <input
            id="captcha-answer"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={2}
            value={answer}
            onChange={(event) => {
              setAnswer(event.target.value.replace(/\D/g, '').slice(0, 2));
              setError('');
            }}
            disabled={busy || verified}
            aria-describedby={error ? 'captcha-error' : 'captcha-live-status'}
            aria-invalid={Boolean(error) || Boolean(answer && answer !== challenge.answer)}
            className="input mt-1.5 text-center text-lg tracking-[0.25em]"
            placeholder="••"
          />
          {error ? (
            <p id="captcha-error" role="alert" className="mt-2 text-sm font-medium text-danger">
              {error}
            </p>
          ) : (
            <p id="captcha-live-status" aria-live="polite" className="mt-2 min-h-5 text-sm text-leaf">
              {answer
                ? answer === challenge.answer
                  ? 'That’s right. You can verify your order.'
                  : 'That answer doesn’t match yet.'
                : ''}
            </p>
          )}

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row">
            <button type="button" onClick={refreshChallenge} disabled={busy || verified} className="btn btn-ghost flex-1">
              Refresh challenge
            </button>
            <button type="submit" disabled={busy || verified || !answer} className="btn btn-primary flex-1">
              {verified ? (
                <>
                  <CheckIcon width={18} height={18} /> Verified
                </>
              ) : busy ? (
                'Completing order…'
              ) : (
                'Verify & place order'
              )}
            </button>
          </div>
          {verified && <p className="mt-4 text-center text-sm font-medium text-leaf">Verification complete. Preparing your order…</p>}
        </form>
      </div>
    </div>
  );
}
