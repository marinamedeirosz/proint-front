import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  redirect,
  Outlet,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { Toaster } from '../components/ui/sonner'
import Header from '../components/Header'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
  isAuthenticated: boolean
  isAuthLoading: boolean
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: ({ context, location }) => {
    // Allow access to login page without authentication
    if (location.pathname === '/login') {
      return
    }
    
    // Redirect to login if not authenticated
    if (!context.isAuthenticated && !context.isAuthLoading) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'SGCEC',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  component: RootComponent,
  shellComponent: RootDocument,
})

function RootComponent() {
  const routerState = useRouterState()
  const isLoginPage = routerState.location.pathname === '/login'

  return (
    <div className="flex flex-col h-screen">
      {!isLoginPage && <Header />}
      <main className={isLoginPage ? "h-full overflow-auto" : "flex-1 overflow-auto"}>
        <Outlet />
      </main>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
