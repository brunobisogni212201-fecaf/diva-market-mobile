import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateUserRole } from './actions'
import { ROLES } from '@/lib/auth/rbac'

export default async function AdminUsersPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Double check admin access (Middleware should catch this, but safe)
    const adminProfile = await db.query.profiles.findFirst({
        where: (profiles, { eq }) => eq(profiles.id, user.id),
        columns: { role: true }
    })

    if (adminProfile?.role !== 'admin') {
        redirect('/unauthorized')
    }

    const allUsers = await db.query.profiles.findMany({
        orderBy: (profiles, { desc }) => [desc(profiles.createdAt)]
    })

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">User Management</h1>

            <div className="rounded-md border shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {allUsers.map((profile) => (
                            <tr key={profile.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{profile.fullName || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{profile.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${profile.role === 'admin' ? 'bg-red-100 text-red-800' :
                                            profile.role === 'vendedora' ? 'bg-green-100 text-green-800' :
                                                profile.role === 'entregadora' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'}`}>
                                        {profile.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {/* Inline Form for Role Update */}
                                    <form action={async (formData) => {
                                        'use server'
                                        const newRole = formData.get('role') as string
                                        await updateUserRole(profile.id, newRole)
                                    }}>
                                        <select
                                            name="role"
                                            defaultValue={profile.role}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            onChange={(e) => {
                                                // We rely on the button to submit, but change handles immediate selection
                                            }}
                                        >
                                            {Object.values(ROLES).map((r) => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                        <button type="submit" className="ml-2 text-indigo-600 hover:text-indigo-900">Update</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
