import { useTaskStore } from '../../store/taskStore';
import { FILTERS, CATEGORIES } from '../../utils/constants';

export default function TaskFilters() {
  const {
    currentFilter,
    currentCategory,
    searchQuery,
    setFilter,
    setCategory,
    setSearchQuery
  } = useTaskStore();

  return (
    <div className="card mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
            Buscar
          </label>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            placeholder="Título o descripción..."
          />
          <p className="text-xs text-gray-500 dark:text-slate-300 mt-2">
            Tip: escribe algo como "informe" o "compras".
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
            Filtrar por estado
          </label>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilter(filter.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
            Filtrar por categoría
          </label>
          <select
            className="input-field"
            value={currentCategory}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">Todas</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
