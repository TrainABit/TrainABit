import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TasksBoard } from '../components/TasksBoard';
import type { Task } from '../types';

describe('TasksBoard component', () => {
  const tasks: Task[] = [
    { id: '1', title: 'Draft release notes', status: 'done' },
    { id: '2', title: 'Validate forecast', status: 'todo' },
    { id: '3', title: 'Polish roadmap presentation', status: 'todo' }
  ];

  it('cycles task statuses and announces completion', async () => {
    const user = userEvent.setup();
    const onTasksChange = vi.fn();

    render(<TasksBoard initialTasks={tasks} onTasksChange={onTasksChange} />);

    expect(screen.getByRole('status')).toHaveTextContent('1 of 3 tasks complete');

    const buttons = screen.getAllByRole('button', { name: /advance status/i });
    await user.click(buttons[1]);

    expect(screen.getByTestId('status-2')).toHaveTextContent('in progress');
    expect(onTasksChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: '2', status: 'in_progress' })])
    );
  });
});
