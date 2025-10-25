import { Fragment, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePlanStore } from '../../store/usePlanStore'

type SidebarComponent = (props: { onCollapseRequest?: () => void }) => JSX.Element

interface AppLayoutProps {
  sidebar: SidebarComponent
  headerTitle?: string
  headerSubtitle?: string
  children: ReactNode
}

export function AppLayout({ sidebar: Sidebar, headerTitle, headerSubtitle, children }: AppLayoutProps) {
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = usePlanStore((state) => ({
    sidebarOpen: state.sidebarOpen,
    setSidebarOpen: state.setSidebarOpen,
    toggleSidebar: state.toggleSidebar,
  }))

  // Close the sidebar when transitioning to desktop layout to avoid stale state
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mq = window.matchMedia('(min-width: 768px)')
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setSidebarOpen(false)
      }
    }

    if (mq.matches) {
      setSidebarOpen(false)
    }

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handleChange)
    } else {
      mq.addListener(handleChange)
    }

    return () => {
      if (typeof mq.removeEventListener === 'function') {
        mq.removeEventListener('change', handleChange)
      } else {
        mq.removeListener(handleChange)
      }
    }
  }, [setSidebarOpen])

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="flex min-h-screen">
        {/* Mobile sidebar */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-slate-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1">
                  <div className="flex grow flex-col bg-surface shadow-xl">
                    <div className="absolute right-0 top-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-slate-300" aria-hidden="true" />
                      </button>
                    </div>
                    <Sidebar onCollapseRequest={() => setSidebarOpen(false)} />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true" />
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden w-80 border-r border-slate-800 md:block">
          <Sidebar />
        </div>

        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-800 bg-surface px-4 py-4 md:hidden">
            <div>
              <h1 className="text-lg font-semibold text-white">{headerTitle ?? 'Plans overview'}</h1>
              {headerSubtitle && <p className="text-sm text-slate-400">{headerSubtitle}</p>}
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-slate-700 p-2 text-slate-300 hover:border-slate-500 hover:text-white"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </header>

          <main className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:px-10">
              <div className="mx-auto w-full max-w-6xl space-y-8">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
