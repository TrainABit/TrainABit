import { describe, expect, it } from 'vitest';

import { appSelectors, initialAppState, updateTaskStatus } from '../state/appState';

describe('app state selectors', () => {
  it('derives progress metrics from state', () => {
    const progress = appSelectors.taskProgress(initialAppState);
    expect(progress.total).toBeGreaterThan(0);

    const milestones = appSelectors.milestonePortfolio(initialAppState);
    expect(milestones.milestones.length).toBe(initialAppState.milestones.length);
  });

  it('summarizes budgets across scenarios', () => {
    const planA = appSelectors.planADscr(initialAppState);
    const planB = appSelectors.planBRunway(initialAppState);
    const planC = appSelectors.planCAcquisitionSummary(initialAppState);

    expect(planA.ratio).toBeGreaterThan(0);
    expect(planB.runwayMonths).toBeGreaterThan(0);
    expect(planC.acquisitionCount).toBeGreaterThan(0);
  });

  it('derives KPI statuses', () => {
    const statuses = appSelectors.kpiStatuses(initialAppState);
    expect(statuses.length).toBe(initialAppState.kpis.length);
  });

  it('updates tasks immutably', () => {
    const updated = updateTaskStatus(initialAppState, 'task-2', 'done');

    const originalTask = initialAppState.tasks.find((task) => task.id === 'task-2');
    const updatedTask = updated.tasks.find((task) => task.id === 'task-2');

    expect(originalTask?.status).toBe('in_progress');
    expect(updatedTask?.status).toBe('done');
    expect(updated.lastUpdated).not.toBe(initialAppState.lastUpdated);
  });
});
