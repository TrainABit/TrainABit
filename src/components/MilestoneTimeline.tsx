import { useMemo } from 'react';

import { calculateMilestoneProgress } from '../domain/progress';
import type { Milestone } from '../types';

export interface MilestoneTimelineProps {
  milestones: Milestone[];
  onMilestoneStatusChange?: (milestoneId: string, status: Milestone['status']) => void;
  referenceDate?: Date;
}

export const MilestoneTimeline = ({
  milestones,
  onMilestoneStatusChange,
  referenceDate = new Date()
}: MilestoneTimelineProps) => {
  const summaries = useMemo(
    () => milestones.map((milestone) => calculateMilestoneProgress(milestone, referenceDate)),
    [milestones, referenceDate]
  );

  return (
    <section aria-label="Milestone timeline">
      <h2>Milestone Timeline</h2>
      <ol>
        {summaries.map((summary, index) => {
          const completionPercent = Math.round(summary.completionRate * 100);
          const milestone = milestones[index];
          const isComplete = completionPercent === 100;

          return (
            <li key={summary.milestoneId}>
              <article aria-labelledby={`milestone-${summary.milestoneId}`}>
                <h3 id={`milestone-${summary.milestoneId}`}>{summary.label}</h3>
                <p>
                  Due date: <time dateTime={summary.dueDate}>{new Date(summary.dueDate).toLocaleDateString()}</time>
                </p>
                <div
                  role="progressbar"
                  aria-label={`${summary.label} progress`}
                  aria-valuenow={completionPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuetext={`${completionPercent}% complete`}
                  data-testid={`progress-${summary.milestoneId}`}
                >
                  {completionPercent}% complete
                </div>
                {summary.overdue && !isComplete ? (
                  <p role="alert">Overdue by {Math.abs(summary.daysRemaining)} days</p>
                ) : (
                  <p>{summary.remaining} tasks remaining</p>
                )}
                <button
                  type="button"
                  onClick={() => onMilestoneStatusChange?.(summary.milestoneId, 'completed')}
                  disabled={isComplete}
                >
                  {isComplete ? 'Completed' : 'Mark complete'}
                </button>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
};
