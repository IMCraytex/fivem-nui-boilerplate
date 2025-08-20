import { useUiComponent } from './context/NuiContext';
import { fetchNui } from './utils/fetchNui';
import { useState, useEffect, useRef } from 'react';
import './DeathScreenUI.css';

const DeathScreenUI = () => {
  const { isVisible, data } = useUiComponent('deathscreen');
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState<string | null>(null);
  const [disabledTimers, setDisabledTimers] = useState<{ [key: string]: number }>({
    local: 5 * 60
  });
  const [helpText, setHelpText] = useState<string>('');
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const listener = (event: MessageEvent<any>) => {
      if (event.data?.type === 'responded') {
        setHelpText('Help is on the way');
        setDisabledTimers((prev) => ({ ...prev, local: 10 * 60 }));
      }
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);

  useEffect(() => {
    if (!holding) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setProgress(0);
      startRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const pct = Math.min((elapsed / 2500) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        fetchNui('deathscreenAction', { action: holding });
        setHolding(null);
        setDisabledTimers((prev) => ({ ...prev, [holding]: holding === 'local' ? prev.local : 50 }));
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [holding]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisabledTimers((prev) => {
        const updated: { [key: string]: number } = {};
        Object.entries(prev).forEach(([key, time]) => {
          if (time > 1) updated[key] = time - 1;
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      if (holding) return;
      if (e.key.toLowerCase() === 'e' && !disabledTimers['call']) setHolding('call');
      if (e.key.toLowerCase() === 'g' && data?.allowLocal !== false && !disabledTimers['local'])
        setHolding('local');
    };
    const upHandler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e' && holding === 'call') setHolding(null);
      if (e.key.toLowerCase() === 'g' && holding === 'local') setHolding(null);
    };
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [holding, disabledTimers, data]);

  if (!isVisible) return null;

  const DeathButton = ({ action, label }: { action: string; label: string }) => {
    const disabled = disabledTimers[action] > 0;

    return (
      <button
        className={`death-btn ${disabled ? 'disabled' : ''}`}
        onMouseDown={() => !disabled && setHolding(action)}
        onMouseUp={() => setHolding(null)}
        onMouseLeave={() => setHolding(null)}
        disabled={disabled}
      >
        <span className="btn-label">
          {label}
          {disabled && disabledTimers[action] > 0
            ? ` (${Math.floor(disabledTimers[action] / 60)}:${String(disabledTimers[action] % 60).padStart(2, '0')})`
            : ''}
        </span>
        {holding === action && !disabled && (
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        )}
      </button>
    );
  };

  return (
    <div className="deathscreen-ui">
      {helpText && <div className="help-text">{helpText}</div>}
      <h1 className="death-title">You are incapacitated</h1>
      <div className="buttons-container">
        <DeathButton action="call" label="[E] Call Medics" />
        {data?.allowLocal !== false && <DeathButton action="local" label="[G] Take Local Medics" />}
      </div>
    </div>
  );
};

export default DeathScreenUI;
