import { useState, useMemo, type ReactNode } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Download, Inbox } from 'lucide-react';
import { cn } from '@/utils';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  emptyMessage?: string;
  loading?: boolean;
  exportable?: boolean;
  exportFilename?: string;
  actions?: (row: T) => ReactNode;
}

type SortDir = 'asc' | 'desc';

export function DataTable<T extends { id: string }>({
  columns, data, pageSize = 10, searchable = true, searchKeys,
  emptyMessage = 'No data available', loading = false, exportable = false,
  exportFilename = 'export', actions,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search) return data;
    const lower = search.toLowerCase();
    return data.filter((row) => {
      if (searchKeys) {
        return searchKeys.some((key) => String(row[key]).toLowerCase().includes(lower));
      }
      return Object.values(row as Record<string, unknown>).some((v) => String(v).toLowerCase().includes(lower));
    });
  }, [data, search, searchKeys]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return filtered;
    const sorted = [...filtered].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filtered, sortKey, sortDir, columns]);

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const currentPage = Math.min(page, totalPages);
  const paged = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const exportCSV = () => {
    const headers = columns.map((c) => c.header).join(',');
    const rows = sorted.map((row) =>
      columns.map((c) => {
        const val = c.sortValue ? c.sortValue(row) : (row as Record<string, unknown>)[c.key];
        return `"${String(val ?? '').replace(/"/g, '""')}"`;
      }).join(','),
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportFilename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      {(searchable || exportable) && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {searchable && (
            <div className="relative flex-1 max-w-xs">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-vaulta-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search..."
                className="w-full rounded-lg border border-vaulta-border bg-vaulta-surface py-2 pl-9 pr-3 text-sm text-vaulta-text placeholder:text-vaulta-muted focus:border-vaulta-cerulean focus:outline-none focus:ring-2 focus:ring-vaulta-cerulean/20"
              />
            </div>
          )}
          {exportable && (
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 rounded-lg border border-vaulta-border px-3 py-2 text-sm font-medium text-vaulta-muted hover:border-vaulta-cerulean hover:text-vaulta-cerulean transition-colors"
            >
              <Download size={16} /> Export CSV
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-nesviora border border-vaulta-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-vaulta-border bg-vaulta-bg/50 dark:bg-vaulta-dark-surface/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn('px-4 py-3 text-left font-semibold text-vaulta-muted whitespace-nowrap', col.className)}
                >
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="inline-flex items-center gap-1 hover:text-vaulta-text transition-colors"
                    >
                      {col.header}
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      ) : (
                        <ArrowUpDown size={14} className="opacity-40" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-right font-semibold text-vaulta-muted">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-vaulta-border last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 w-3/4 skeleton rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-vaulta-muted">
                    <Inbox size={32} />
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((row) => (
                <tr key={row.id} className="border-b border-vaulta-border last:border-0 hover:bg-vaulta-bg/30 dark:hover:bg-vaulta-dark-surface/30 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={cn('px-4 py-3 text-vaulta-text whitespace-nowrap', col.className)}>
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                  {actions && <td className="px-4 py-3 text-right">{actions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-vaulta-muted">
            Page {currentPage} of {totalPages} ({sorted.length} total)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-vaulta-border p-2 text-vaulta-muted hover:border-vaulta-cerulean hover:text-vaulta-cerulean transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-vaulta-border p-2 text-vaulta-muted hover:border-vaulta-cerulean hover:text-vaulta-cerulean transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
