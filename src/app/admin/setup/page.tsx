import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { claimAdmin } from './actions'

export default async function AdminSetupPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check if admin already exists
    const existingAdmins = await db.select().from(profiles).where(eq(profiles.role, 'admin'))
    const isInitialized = existingAdmins.length > 0

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h1 className="mb-6 text-2xl font-bold text-gray-900">System Setup</h1>

                {isInitialized ? (
                    <div className="rounded-md bg-yellow-50 p-4 text-yellow-800">
                        <p className="font-medium">System already initialized.</p>
                        <p className="mt-2 text-sm">An administrator account already exists. Please contact support if you lost access.</p>
                        <a href="/" className="mt-4 block text-blue-600 hover:underline">Go Home</a>
                    </div>
                ) : (
                    <div>
                        <p className="mb-4 text-gray-600">
                            Welcome to the first-time setup. Please enter the Master Secret Key to claim the Administrator role.
                        </p>
                        <form action={claimAdmin} className="space-y-4">
                            <div>
                                <label htmlFor="masterKey" className="block text-sm font-medium text-gray-700">Master Secret Key</label>
                                <input
                                    type="password"
                                    name="masterKey"
                                    id="masterKey"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    placeholder="Enter your secret key"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Claim Admin Role
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}
