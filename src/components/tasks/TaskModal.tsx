import { Fragment, useEffect } from 'react'
import { Dialog, Transition, Listbox } from '@headlessui/react'
import { useForm, Controller } from 'react-hook-form'
import { XMarkIcon, CheckIcon, ChevronUpDownIcon, TrashIcon } from '@heroicons/react/24/outline'
import { usePlanStore } from '../../store/usePlanStore'
import type { Task, TaskStatus, PlanId } from '../../types'

interface TaskFormData {
  title: string
  description: string
  status: TaskStatus
  dueDate: string
  assignee: string
  percentComplete: number
  milestoneId: string
  priority: 'high' | 'medium' | 'low'
}

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task?: Task | null
  planId: PlanId
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'done', label: 'Done' },
]

const priorityOptions = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export function TaskModal({ isOpen, onClose, task, planId }: TaskModalProps) {
  const { plans, createTask, updateTask, deleteTask } = usePlanStore((state) => ({
    plans: state.plans,
    createTask: state.createTask,
    updateTask: state.updateTask,
    deleteTask: state.deleteTask,
  }))

  const plan = plans[planId]
  const milestoneOptions = [
    { value: '', label: 'No milestone' },
    ...plan.milestones.map((m) => ({ value: m.id, label: m.title })),
  ]

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      title: '',
      description: '',
      status: 'backlog',
      dueDate: '',
      assignee: '',
      percentComplete: 0,
      milestoneId: '',
      priority: 'medium',
    },
  })

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        dueDate: task.dueDate || '',
        assignee: task.assignee || '',
        percentComplete: task.percentComplete,
        milestoneId: task.milestoneId || '',
        priority: task.priority || 'medium',
      })
    } else {
      reset({
        title: '',
        description: '',
        status: 'backlog',
        dueDate: '',
        assignee: '',
        percentComplete: 0,
        milestoneId: '',
        priority: 'medium',
      })
    }
  }, [task, reset])

  const onSubmit = (data: TaskFormData) => {
    if (task) {
      updateTask(planId, task.id, {
        title: data.title,
        description: data.description,
        status: data.status,
        dueDate: data.dueDate || undefined,
        assignee: data.assignee || undefined,
        percentComplete: data.percentComplete,
        milestoneId: data.milestoneId || undefined,
        priority: data.priority,
      })
    } else {
      createTask(planId, {
        title: data.title,
        description: data.description,
        status: data.status,
        dueDate: data.dueDate || undefined,
        assignee: data.assignee || undefined,
        percentComplete: data.percentComplete,
        milestoneId: data.milestoneId || undefined,
        priority: data.priority,
        order: 0,
      })
    }
    onClose()
  }

  const handleDelete = () => {
    if (task && confirm('Are you sure you want to delete this task?')) {
      deleteTask(planId, task.id)
      onClose()
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-slate-800 p-6 text-left shadow-xl transition-all">
                <div className="mb-6 flex items-start justify-between">
                  <Dialog.Title as="h3" className="text-xl font-bold text-white">
                    {task ? 'Edit Task' : 'Create Task'}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-md text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-200">
                      Title *
                    </label>
                    <input
                      id="title"
                      {...register('title', { required: 'Title is required' })}
                      className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Enter task title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-200">
                      Description
                    </label>
                    <textarea
                      id="description"
                      {...register('description')}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Enter task description"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-slate-200">
                        Status
                      </label>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Listbox value={field.value} onChange={field.onChange}>
                            <div className="relative mt-1">
                              <Listbox.Button className="relative w-full cursor-pointer rounded-md border border-slate-600 bg-slate-700 py-2 pl-3 pr-10 text-left text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                                <span className="block truncate">
                                  {statusOptions.find((o) => o.value === field.value)?.label}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon className="h-5 w-5 text-slate-400" />
                                </span>
                              </Listbox.Button>
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-700 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                                  {statusOptions.map((option) => (
                                    <Listbox.Option
                                      key={option.value}
                                      value={option.value}
                                      className={({ active }) =>
                                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                          active ? 'bg-primary/20 text-white' : 'text-slate-200'
                                        }`
                                      }
                                    >
                                      {({ selected }) => (
                                        <>
                                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                            {option.label}
                                          </span>
                                          {selected && (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                              <CheckIcon className="h-5 w-5" />
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </Listbox>
                        )}
                      />
                    </div>

                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-slate-200">
                        Priority
                      </label>
                      <Controller
                        name="priority"
                        control={control}
                        render={({ field }) => (
                          <Listbox value={field.value} onChange={field.onChange}>
                            <div className="relative mt-1">
                              <Listbox.Button className="relative w-full cursor-pointer rounded-md border border-slate-600 bg-slate-700 py-2 pl-3 pr-10 text-left text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                                <span className="block truncate">
                                  {priorityOptions.find((o) => o.value === field.value)?.label}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon className="h-5 w-5 text-slate-400" />
                                </span>
                              </Listbox.Button>
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-700 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                                  {priorityOptions.map((option) => (
                                    <Listbox.Option
                                      key={option.value}
                                      value={option.value}
                                      className={({ active }) =>
                                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                          active ? 'bg-primary/20 text-white' : 'text-slate-200'
                                        }`
                                      }
                                    >
                                      {({ selected }) => (
                                        <>
                                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                            {option.label}
                                          </span>
                                          {selected && (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                              <CheckIcon className="h-5 w-5" />
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </Listbox>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="assignee" className="block text-sm font-medium text-slate-200">
                        Assignee
                      </label>
                      <input
                        id="assignee"
                        {...register('assignee')}
                        className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Enter assignee name"
                      />
                    </div>

                    <div>
                      <label htmlFor="dueDate" className="block text-sm font-medium text-slate-200">
                        Due Date
                      </label>
                      <input
                        id="dueDate"
                        type="date"
                        {...register('dueDate')}
                        className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="percentComplete" className="block text-sm font-medium text-slate-200">
                        Percent Complete
                      </label>
                      <input
                        id="percentComplete"
                        type="number"
                        min="0"
                        max="100"
                        {...register('percentComplete', {
                          valueAsNumber: true,
                          min: { value: 0, message: 'Must be at least 0' },
                          max: { value: 100, message: 'Must be at most 100' },
                        })}
                        className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      {errors.percentComplete && (
                        <p className="mt-1 text-sm text-red-400">{errors.percentComplete.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="milestoneId" className="block text-sm font-medium text-slate-200">
                        Milestone
                      </label>
                      <Controller
                        name="milestoneId"
                        control={control}
                        render={({ field }) => (
                          <Listbox value={field.value} onChange={field.onChange}>
                            <div className="relative mt-1">
                              <Listbox.Button className="relative w-full cursor-pointer rounded-md border border-slate-600 bg-slate-700 py-2 pl-3 pr-10 text-left text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                                <span className="block truncate">
                                  {milestoneOptions.find((o) => o.value === field.value)?.label}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon className="h-5 w-5 text-slate-400" />
                                </span>
                              </Listbox.Button>
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-700 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                                  {milestoneOptions.map((option) => (
                                    <Listbox.Option
                                      key={option.value}
                                      value={option.value}
                                      className={({ active }) =>
                                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                          active ? 'bg-primary/20 text-white' : 'text-slate-200'
                                        }`
                                      }
                                    >
                                      {({ selected }) => (
                                        <>
                                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                            {option.label}
                                          </span>
                                          {selected && (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                              <CheckIcon className="h-5 w-5" />
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </Listbox>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-slate-700 pt-6">
                    {task ? (
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="flex items-center gap-2 rounded-lg border border-red-500/50 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <TrashIcon className="h-5 w-5" />
                        Delete
                      </button>
                    ) : (
                      <div />
                    )}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-800"
                      >
                        {task ? 'Save Changes' : 'Create Task'}
                      </button>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
