import { useUiComponent } from './context/NuiContext';
import { fetchNui } from './utils/fetchNui';
import { useState, useEffect } from 'react';
import './InjuriesUI.css';

interface Injury {
  id: number;
  text: string;
}

const InjuriesUI = () => {
  const { isVisible, data, hide } = useUiComponent('injuries');
  const [injuries, setInjuries] = useState<Injury[]>([]);

  const readOnly = data?.readOnly ?? false;

  useEffect(() => {
    if (data?.injuries && Array.isArray(data.injuries)) {
      setInjuries(
        data.injuries.slice(0, 10).map((text: string, i: number) => ({
          id: i + 1,
          text: text.slice(0, 80),
        }))
      );
    }
  }, [data]);

  const addInjury = () => {
    if (readOnly || injuries.length >= 10) return;
    setInjuries((prev) => [
      ...prev,
      { id: prev.length > 0 ? prev[prev.length - 1].id + 1 : 1, text: '' },
    ]);
  };

  const removeInjury = (id: number) => {
    if (readOnly) return;
    setInjuries((prev) => prev.filter((inj) => inj.id !== id));
  };

  const updateInjury = (id: number, text: string) => {
    if (readOnly) return;
    setInjuries((prev) =>
      prev.map((inj) => (inj.id === id ? { ...inj, text: text.slice(0, 80) } : inj))
    );
  };

  const submitInjuries = () => {
    if (readOnly) return;
    fetchNui('submitInjuries', { injuries: injuries.map((i) => i.text) });
    hide();
  };

  if (!isVisible) return null;

  return (
    <div className="injuries-ui">
      <div className="container">
        <h2>Injuries</h2>

        <div className="injuries-list">
          {injuries.map((injury) => (
            <div key={injury.id} className="injury-row">
              <input
                type="text"
                value={injury.text}
                onChange={(e) => updateInjury(injury.id, e.target.value)}
                placeholder="Describe injury"
                maxLength={80}
                readOnly={readOnly}
              />
              {!readOnly && (
                <button onClick={() => removeInjury(injury.id)} className="delete-btn">
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>

        {!readOnly ? (
          <div className="buttons">
            <button onClick={addInjury} className="add-btn" disabled={injuries.length >= 10}>
              Add Injury
            </button>
            <div className="right-buttons">
              <button onClick={submitInjuries} className="submit-btn">
                Submit
              </button>
              <button onClick={hide} className="close-btn">
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="buttons">
            <button onClick={hide} className="close-btn">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InjuriesUI;
