import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition, Listbox } from '@headlessui/react'
import { useForm, Controller } from 'react-hook-form'
import { XMarkIcon, CheckIcon, ChevronUpDownIcon, TrashIcon } from '@heroicons/react/24/outline'
import { usePlanStore } from '../../store/usePlanStore'
import type { Milestone, PlanId, MilestoneStatus } from '../../types'

interface MilestoneFormData {
  title: string
  targetDate: string
  status: MilestoneStatus
  notes: string
  completionThreshold: number
  manualProgress?: number | null
  taskIds: string[]
}

interface MilestoneModalProps {
  isOpen: boolean
  onClose: () => void
  milestone?: Milestone | null
  planId: PlanId
}

const statusOptions: { value: MilestoneStatus; label: string }[] = [
  { value: 'not-started', label: 'Not Started' },
  { value: 'tracking', label: 'Tracking' },
  { value: 'at-risk', label: 'At Risk' },
  { value: 'complete', label: 'Complete' },
]

export function MilestoneModal({ isOpen, onClose, milestone, planId }: MilestoneModalProps) {
  const { plans, createMilestone, updateMilestone, deleteMilestone } = usePlanStore((state) => ({
    plans: state.plans,
    createMilestone: state.createMilestone,
    updateMilestone: state.updateMilestone,
    deleteMilestone: state.deleteMilestone,
  }))

  const plan = plans[planId]
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([])
  const [useStatusOverride, setUseStatusOverride] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MilestoneFormData>({
    defaultValues: {
      title: '',
      targetDate: '',
      status: 'not-started',
      notes: '',
      completionThreshold: 100,
      manualProgress: null,
      taskIds: [],
    },
  })

  useEffect(() => {
    if (milestone) {
      reset({
        title: milestone.title,
        targetDate: milestone.targetDate,
        status: milestone.statusOverride ?? milestone.status,
        notes: milestone.notes || '',
        completionThreshold: milestone.completionThreshold || 100,
        manualProgress: milestone.manualProgress ?? null,
        taskIds: milestone.taskIds,
      })
      setSelectedTaskIds(milestone.taskIds)
      setUseStatusOverride(Boolean(milestone.statusOverride))
    } else {
      reset({
        title: '',
        targetDate: '',
        status: 'not-started',
        notes: '',
        completionThreshold: 100,
        manualProgress: null,
        taskIds: [],
      })
      setSelectedTaskIds([])
      setUseStatusOverride(false)
    }
  }, [milestone, reset])

  const onSubmit = (data: MilestoneFormData) => {
    const manualProgressValue = data.manualProgress === null ? undefined : data.manualProgress
    if (milestone) {
      updateMilestone(planId, milestone.id, {
        title: data.title,
        targetDate: data.targetDate,
        status: milestone.status,
        notes: data.notes || undefined,
        completionThreshold: data.completionThreshold,
        manualProgress: manualProgressValue,
        statusOverride: useStatusOverride ? data.status : undefined,
        taskIds: selectedTaskIds,
      })
    } else {
      createMilestone(planId, {
        title: data.title,
        targetDate: data.targetDate,
        status: useStatusOverride ? data.status : 'not-started',
        notes: data.notes || undefined,
        completionThreshold: data.completionThreshold,
        manualProgress: manualProgressValue,
        statusOverride: useStatusOverride ? data.status : undefined,
        taskIds: selectedTaskIds,
      })
    }
    onClose()
  }

  const handleDelete = () => {
    if (milestone && confirm('Are you sure you want to delete this milestone?')) {
      deleteMilestone(planId, milestone.id)
      onClose()
    }
  }

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    )
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
                    {milestone ? 'Edit Milestone' : 'Create Milestone'}
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
                      placeholder="Enter milestone title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="targetDate" className="block text-sm font-medium text-slate-200">
                        Target Date *
                      </label>
                      <input
                        id="targetDate"
                        type="date"
                        {...register('targetDate', { required: 'Target date is required' })}
                        className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      {errors.targetDate && (
                        <p className="mt-1 text-sm text-red-400">{errors.targetDate.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-slate-200">
                        Status Override
                      </label>
                      <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                        <span>{useStatusOverride ? 'Manual status in effect' : 'Automatically calculated'}</span>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={useStatusOverride}
                            onChange={(event) => setUseStatusOverride(event.target.checked)}
                            className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-primary focus:ring-primary"
                          />
                          <span>Enable manual override</span>
                        </label>
                      </div>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Listbox value={field.value} onChange={field.onChange} disabled={!useStatusOverride}>
                            <div className="relative mt-1">
                              <Listbox.Button
                                className={`relative w-full rounded-md border border-slate-600 py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-1 ${
                                  useStatusOverride
                                    ? 'cursor-pointer bg-slate-700 text-white focus:border-primary focus:ring-primary'
                                    : 'cursor-not-allowed bg-slate-800 text-slate-500'
                                }`}
                              >
                                <span className="block truncate">
                                  {statusOptions.find((o) => o.value === field.value)?.label}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon className="h-5 w-5 text-slate-400" />
                                </span>
                              </Listbox.Button>
                              {useStatusOverride && (
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
                              )}
                            </div>
                          </Listbox>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="completionThreshold" className="block text-sm font-medium text-slate-200">
                        Completion Threshold (%)
                      </label>
                      <input
                        id="completionThreshold"
                        type="number"
                        min="0"
                        max="100"
                        {...register('completionThreshold', {
                          valueAsNumber: true,
                          min: { value: 0, message: 'Must be at least 0' },
                          max: { value: 100, message: 'Must be at most 100' },
                        })}
                        className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      {errors.completionThreshold && (
                        <p className="mt-1 text-sm text-red-400">{errors.completionThreshold.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="manualProgress" className="block text-sm font-medium text-slate-200">
                        Manual Progress (%)
                      </label>
                      <input
                        id="manualProgress"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Auto"
                        {...register('manualProgress', {
                          setValueAs: (value) => (value === '' ? null : Number(value)),
                          min: { value: 0, message: 'Must be at least 0' },
                          max: { value: 100, message: 'Must be at most 100' },
                        })}
                        className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        Leave blank to calculate from linked tasks.
                      </p>
                      {errors.manualProgress && (
                        <p className="mt-1 text-sm text-red-400">{errors.manualProgress.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-slate-200">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      {...register('notes')}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Add any notes or context about this milestone"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200">
                      Linked Tasks ({selectedTaskIds.length})
                    </label>
                    <div className="mt-2 max-h-64 space-y-2 overflow-y-auto rounded-md border border-slate-600 bg-slate-700 p-3">
                      {plan.tasks.length === 0 ? (
                        <p className="text-sm text-slate-400">No tasks available</p>
                      ) : (
                        plan.tasks.map((task) => (
                          <label
                            key={task.id}
                            className="flex cursor-pointer items-center gap-3 rounded-md bg-slate-800 p-2 hover:bg-slate-800/60"
                          >
                            <input
                              type="checkbox"
                              checked={selectedTaskIds.includes(task.id)}
                              onChange={() => toggleTaskSelection(task.id)}
                              className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-primary focus:ring-primary"
                            />
                            <div className="flex-1">
                              <span className="text-sm text-white">{task.title}</span>
                              <span className="ml-2 text-xs text-slate-400">
                                {task.percentComplete}%
                              </span>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-slate-700 pt-6">
                    {milestone ? (
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
                        {milestone ? 'Save Changes' : 'Create Milestone'}
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
