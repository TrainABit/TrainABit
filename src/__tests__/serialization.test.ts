import { describe, expect, it } from 'vitest';

import { deserializeAppState, serializeAppState } from '../domain/serialization';
import { initialAppState } from '../state/appState';

describe('state export/import helpers', () => {
  it('round-trips state with defensive cloning', () => {
    const serialized = serializeAppState(initialAppState);
    const restored = deserializeAppState(serialized);

    expect(restored).toEqual(initialAppState);
    expect(restored).not.toBe(initialAppState);

    restored.tasks[0].title = 'mutated';
    expect(initialAppState.tasks[0].title).not.toBe('mutated');
  });

  it('rejects mismatched shapes', () => {
    const payload = JSON.stringify({ version: 1, payload: { ...initialAppState, tasks: [{ bad: 'data' }] } });
    expect(() => deserializeAppState(payload)).toThrow('Serialized tasks are invalid');
  });

  it('enforces version compatibility', () => {
    const payload = JSON.stringify({ version: 2, payload: initialAppState });
    expect(() => deserializeAppState(payload)).toThrow();
  });
});
