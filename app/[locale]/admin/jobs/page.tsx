
"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiTrash2, FiEye, FiSlash } from "react-icons/fi";

interface Job {
    id: string;
    title: string;
    status: string;
    createdAt: string;
    budget: string;
    client: {
        name: string;
        email: string;
    };
    provider?: {
        name: string;
        email: string;
    };
}

export default function AdminJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await fetch("/api/admin/jobs");
            if (res.ok) {
                const data = await res.json();
                setJobs(data);
            }
        } catch (error) {
            console.error("Error fetching jobs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelJob = async (jobId: string) => {
        if (!confirm("Are you sure you want to cancel this job?")) return;

        try {
            const res = await fetch("/api/admin/jobs", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId, status: "CANCELLED" })
            });

            if (res.ok) {
                setJobs(jobs.map(job => job.id === jobId ? { ...job, status: "CANCELLED" } : job));
            }
        } catch (error) {
            console.error("Error cancelling job", error);
        }
    };

    const handleDeleteJob = async (jobId: string) => {
        if (!confirm("⚠️ WARNING: This will permanently delete the job from the database. Are you sure?")) return;

        try {
            const res = await fetch(`/api/admin/jobs?id=${jobId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                setJobs(jobs.filter(job => job.id !== jobId));
            }
        } catch (error) {
            console.error("Error deleting job", error);
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Job Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Found {filteredJobs.length} jobs</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div className="relative max-w-md w-full">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by ID, title, or client..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="p-3 font-bold text-gray-700 uppercase tracking-wider text-xs w-24">ID</th>
                                <th className="p-3 font-bold text-gray-700 uppercase tracking-wider text-xs">Job Details</th>
                                <th className="p-3 font-bold text-gray-700 uppercase tracking-wider text-xs">Client / Provider</th>
                                <th className="p-3 font-bold text-gray-700 uppercase tracking-wider text-xs">Financials</th>
                                <th className="p-3 font-bold text-gray-700 uppercase tracking-wider text-xs">Status</th>
                                <th className="p-3 font-bold text-gray-700 uppercase tracking-wider text-xs text-right">Admin Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading jobs...</td></tr>
                            ) : filteredJobs.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No jobs found.</td></tr>
                            ) : (
                                filteredJobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-blue-50 transition-colors group">
                                        <td className="p-3 font-mono text-xs text-gray-500 align-top">
                                            {job.id.substring(job.id.length - 6)}
                                        </td>
                                        <td className="p-3 align-top">
                                            <div className="font-bold text-gray-900">{job.title}</div>
                                            <div className="text-xs text-gray-500 mt-1">{new Date(job.createdAt).toLocaleString()}</div>
                                        </td>
                                        <td className="p-3 align-top">
                                            <div className="mb-1">
                                                <span className="text-xs font-semibold text-gray-500">Client:</span> <span className="text-gray-900">{job.client.name}</span>
                                            </div>
                                            {job.provider && (
                                                <div>
                                                    <span className="text-xs font-semibold text-gray-500">Prov:</span> <span className="text-blue-700 font-medium">{job.provider.name}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 align-top">
                                            <div className="font-mono text-gray-900 font-medium">{job.budget || '-'}</div>
                                        </td>
                                        <td className="p-3 align-top">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold border ${job.status === 'OPEN' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    job.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        'bg-blue-50 text-blue-700 border-blue-200'
                                                }`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right align-top">
                                            <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded" title="View Details">
                                                    <FiEye />
                                                </button>
                                                {job.status !== 'CANCELLED' && (
                                                    <button
                                                        onClick={() => handleCancelJob(job.id)}
                                                        className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-100 rounded"
                                                        title="Cancel Job"
                                                    >
                                                        <FiSlash />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteJob(job.id)}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded"
                                                    title="Permanently Delete"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
