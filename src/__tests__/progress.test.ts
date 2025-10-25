import { describe, expect, it } from 'vitest';

import { calculateMilestoneProgress, calculateTaskProgress, summarizePortfolioProgress } from '../domain/progress';
import type { Milestone, Task } from '../types';

describe('task and milestone progress calculations', () => {
  it('calculates weighted task progress with precision', () => {
    const tasks: Task[] = [
      { id: 't1', title: 'Complete UI audit', status: 'done', weight: 3 },
      { id: 't2', title: 'Draft onboarding flow', status: 'in_progress', weight: 1 },
      { id: 't3', title: 'Add analytics hooks', status: 'todo', weight: 1 }
    ];

    const summary = calculateTaskProgress(tasks);

    expect(summary.weighted).toBe(true);
    expect(summary.completed).toBe(1);
    expect(summary.total).toBe(3);
    expect(summary.completionRate).toBeCloseTo(0.6, 2);
  });

  it('detects overdue milestones when work remains', () => {
    const referenceDate = new Date('2024-05-10T00:00:00Z');
    const milestone: Milestone = {
      id: 'm1',
      title: 'Private beta',
      status: 'in_progress',
      targetDate: '2024-05-08T00:00:00Z',
      tasks: [
        { id: 't1', title: 'Invite cohort', status: 'done' },
        { id: 't2', title: 'Collect surveys', status: 'in_progress' }
      ]
    };

    const summary = calculateMilestoneProgress(milestone, referenceDate);

    expect(summary.overdue).toBe(true);
    expect(summary.daysRemaining).toBeLessThan(0);
    expect(summary.completionRate).toBeCloseTo(0.5, 2);
  });

  it('aggregates milestone portfolio insights', () => {
    const referenceDate = new Date('2024-05-10T00:00:00Z');
    const milestones: Milestone[] = [
      {
        id: 'm1',
        title: 'Alpha release',
        status: 'completed',
        targetDate: '2024-05-01T00:00:00Z',
        tasks: [
          { id: 't1', title: 'Ship core features', status: 'done' }
        ]
      },
      {
        id: 'm2',
        title: 'Billing launch',
        status: 'in_progress',
        targetDate: '2024-05-20T00:00:00Z',
        tasks: [
          { id: 't2', title: 'Stripe integration', status: 'in_progress' },
          { id: 't3', title: 'Pricing research', status: 'todo' }
        ]
      }
    ];

    const summary = summarizePortfolioProgress(milestones, referenceDate);

    expect(summary.milestones).toHaveLength(2);
    expect(summary.tasksRemaining).toBe(2);
    expect(summary.completedMilestones).toBe(1);
    expect(summary.averageCompletion).toBeGreaterThan(0.5);
  });
});
