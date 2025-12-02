
import { getSports } from '@/lib/api';
import Link from 'next/link';
import { Settings, Users, Activity, Database } from 'lucide-react';

export default async function AdminDashboard() {
    const sports = await getSports();

    return (
        <div className="flex min-h-screen bg-zinc-950">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                    <Settings className="text-blue-500" /> Admin Panel
                </h2>
                <nav className="flex flex-col gap-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-zinc-800 rounded-lg text-white">
                        <Activity size={18} /> Dashboard
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">
                        <Users size={18} /> Users
                    </Link>
                    <Link href="/admin/content" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">
                        <Database size={18} /> Content
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-zinc-400">Welcome, Admin</span>
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">A</div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                        <h3 className="text-zinc-400 text-sm font-medium mb-2">Total Sports</h3>
                        <p className="text-3xl font-bold">{sports.length}</p>
                    </div>
                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                        <h3 className="text-zinc-400 text-sm font-medium mb-2">Active Users</h3>
                        <p className="text-3xl font-bold">1,234</p>
                    </div>
                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                        <h3 className="text-zinc-400 text-sm font-medium mb-2">System Status</h3>
                        <p className="text-3xl font-bold text-green-500">Healthy</p>
                    </div>
                </div>

                <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                    <div className="p-6 border-b border-zinc-800">
                        <h3 className="font-bold">Available Sports</h3>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-zinc-950 text-zinc-400 text-sm">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Display Name</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sports.map((sport) => (
                                <tr key={sport.name} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50">
                                    <td className="p-4 font-medium">{sport.name}</td>
                                    <td className="p-4">{sport.displayName}</td>
                                    <td className="p-4"><span className="px-2 py-1 bg-green-900/30 text-green-500 rounded text-xs">Active</span></td>
                                    <td className="p-4">
                                        <button className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
