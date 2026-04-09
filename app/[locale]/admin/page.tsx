"use client";

import { useState, useEffect } from "react";
import { FiUsers, FiBriefcase, FiAlertTriangle, FiDollarSign } from "react-icons/fi";
import Link from "next/link";

interface DashboardData {
  stats: {
    totalUsers: number;
    activeProviders: number;
    totalJobs: number;
    openDisputes: number;
    revenue: string;
  };
  recentUsers: { id: string; name: string; email: string; role: string; createdAt: string }[];
  recentJobs: { id: string; title: string; createdAt: string; client: { name: string } }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load stats");
      })
      .then((data) => setData(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading dashboard data...</div>;
  if (!data) return <div>Error loading data.</div>;

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Overview</h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase">Total Users</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{data.stats.totalUsers}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <FiUsers className="text-xl" />
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4"><span className="text-green-500 font-bold">{data.stats.activeProviders}</span> are Providers</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase">Total Jobs</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{data.stats.totalJobs}</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-600">
              <FiBriefcase className="text-xl" />
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4">Jobs posted platform-wide</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase">Disputes</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{data.stats.openDisputes}</h3>
            </div>
            <div className="p-3 bg-red-50 rounded-lg text-red-600">
              <FiAlertTriangle className="text-xl" />
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4">Requires attention</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase">Est. Revenue</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">€{data.stats.revenue}</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
              <FiDollarSign className="text-xl" />
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4">Platform fees collected</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RECENT USERS */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Users</h2>
            <Link href="/admin/users" className="text-blue-600 text-sm font-medium hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase">User</th>
                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase">Role</th>
                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-bold ${user.role === 'PROVIDER' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RECENT JOBS */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Jobs</h2>
            <Link href="/jobs" className="text-blue-600 text-sm font-medium hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase">Title</th>
                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase">Client</th>
                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recentJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{job.title}</td>
                    <td className="p-4 text-sm text-gray-600">{job.client.name}</td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}