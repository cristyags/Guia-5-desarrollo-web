export default function LoadingSpinner({ label = 'Cargando...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
      <div className="text-center">
        <div className="mx-auto animate-spin rounded-full h-14 w-14 border-b-4 border-blue-600" />
        <p className="mt-4 text-gray-600 dark:text-slate-300 font-medium">{label}</p>
      </div>
    </div>
  );
}
