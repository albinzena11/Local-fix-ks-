// app/dashboard/loading.tsx - Krijo këtë file
export default function DashboardLoading() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Po ngarkohet dashboard...</p>
        </div>
      </div>
    );
  }