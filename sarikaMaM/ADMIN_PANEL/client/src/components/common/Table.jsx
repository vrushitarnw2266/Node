import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Input from './Input';

export const Table = ({
  columns,
  data = [],
  searchPlaceholder = 'Search records...',
  searchField = 'name',
  actions,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    const value = item[searchField];
    if (value === undefined || value === null) return false;
    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Search Header */}
      <div className="flex justify-between items-center">
        <div className="w-80">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            icon={<Search size={18} />}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-800/40 shadow-xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/60 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-800/40">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    {col.header}
                  </th>
                ))}
                {actions && (
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-800/40">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                  >
                    <div className="flex justify-center items-center space-x-2">
                      <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" />
                      <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-6 py-12 text-center text-sm font-medium text-slate-400 dark:text-slate-500"
                  >
                    No matching records found
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIdx) => (
                  <tr
                    key={row.id || rowIdx}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                        {col.cell ? col.cell(row) : row[col.accessor]}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-6 py-4 text-sm text-right">
                        <div className="flex justify-end space-x-2">{actions(row)}</div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-slate-50/60 dark:bg-slate-900/60 border-t border-slate-200/50 dark:border-slate-800/40 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
            <span className="font-semibold">
              {Math.min(startIndex + itemsPerPage, filteredData.length)}
            </span>{' '}
            of <span className="font-semibold">{filteredData.length}</span> records
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-semibold px-2 text-slate-700 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
