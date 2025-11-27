import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle, Shield, User } from 'lucide-react'
import { useAuth } from '../contexts/auth.context'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-slate-400">
            You are now logged in to your dashboard
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-cyan-500/10 rounded-lg">
                <User className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Profile</h2>
            </div>
            <div className="space-y-2 text-slate-300">
              <p>
                <span className="text-slate-400">Name:</span> {user?.name}
              </p>
              <p>
                <span className="text-slate-400">Email:</span> {user?.email}
              </p>
              <p>
                <span className="text-slate-400">ID:</span> {user?.id}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Status</h2>
            </div>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Active Session</span>
              </div>
              <p className="text-slate-400 text-sm">
                Your authentication is valid
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Security</h2>
            </div>
            <div className="space-y-2 text-slate-300">
              <p className="text-sm">This page is protected</p>
              <p className="text-slate-400 text-sm">
                Only authenticated users can access this content
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Protected Content
          </h2>
          <p className="text-slate-300 mb-4">
            This is a protected route that requires authentication. The{' '}
            <code className="bg-slate-800 px-2 py-1 rounded text-cyan-400">
              ProtectedRoute
            </code>{' '}
            component wraps this content and ensures only authenticated users
            can access it.
          </p>
          <p className="text-slate-400 text-sm">
            To create more protected routes, simply wrap your route component
            with the ProtectedRoute component as shown in this example.
          </p>
        </div>
      </div>
    </div>
  )
}
