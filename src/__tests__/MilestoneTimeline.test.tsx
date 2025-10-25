import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { MilestoneTimeline } from '../components/MilestoneTimeline';
import type { Milestone } from '../types';

describe('MilestoneTimeline component', () => {
  const milestones: Milestone[] = [
    {
      id: 'm1',
      title: 'Public beta',
      status: 'in_progress',
      targetDate: '2024-05-20T00:00:00.000Z',
      tasks: [
        { id: 't1', title: 'Create waitlist', status: 'done' },
        { id: 't2', title: 'Setup feedback board', status: 'in_progress' }
      ]
    }
  ];

  it('renders milestone progress and notifies on completion', async () => {
    const user = userEvent.setup();
    const onMilestoneStatusChange = vi.fn();

    render(
      <MilestoneTimeline
        milestones={milestones}
        onMilestoneStatusChange={onMilestoneStatusChange}
        referenceDate={new Date('2024-05-10T00:00:00.000Z')}
      />
    );

    const progressBar = screen.getByRole('progressbar', { name: /complete/ });
    expect(progressBar).toHaveAttribute('aria-valuenow');

    const button = screen.getByRole('button', { name: /mark complete/i });
    await user.click(button);

    expect(onMilestoneStatusChange).toHaveBeenCalledWith('m1', 'completed');

    const milestoneItem = screen.getByRole('article', { name: /public beta/i });
    expect(within(milestoneItem).getByText(/tasks remaining/i)).toBeInTheDocument();
  });
});
