import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Star, ExternalLink, RefreshCw, Database } from 'lucide-react';
import { useLiveScrapedData } from '@/hooks/useLiveScrapedData';

const PAGE_SIZE = 8;

const statusColors: Record<string, string> = {
  healthy: 'text-emerald-400',
  warning: 'text-amber-400',
  error: 'text-red-400',
  healing: 'text-violet-400',
};

const statusDotColors: Record<string, string> = {
  healthy: 'bg-emerald-400',
  warning: 'bg-amber-400',
  error: 'bg-red-400',
  healing: 'bg-violet-400',
};

export default function DataExplorer() {
  const { records: liveRecords, loading, error, source, recordCount, refresh } = useLiveScrapedData();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>('product');
  const [currentPage, setCurrentPage] = useState(1);

  // Use live data from API — no mock fallback
  const allRecords = liveRecords;

  const filtered = useMemo(
    () =>
      allRecords.filter(
        (r) =>
          r.product.toLowerCase().includes(search.toLowerCase()) ||
          r.price.includes(search)
      ),
    [allRecords, search]
  );

  // Reset to page 1 when search or sort changes
  const resetPage = () => setCurrentPage(1);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === 'product') return a.product.localeCompare(b.product);
      if (sortBy === 'price') return a.price.localeCompare(b.price);
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [filtered, sortBy]);

  const totalRecords = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const visibleRecords = sorted.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <section className="glass-card p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">Data Explorer</h3>
          <p className="text-sm text-gray-400 mt-1">
            Browse extracted structured data
            {source && (
              <span className="ml-2 inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-surface-3 border border-white/5">
                <Database size={9} />
                Live Bright Data
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              className="w-full sm:w-56 pl-9 pr-3 py-2 text-xs bg-surface-3 border border-white/10 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/20 transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); resetPage(); }}
              className="appearance-none pl-3 pr-8 py-2 text-xs bg-surface-3 border border-white/10 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-500/30 cursor-pointer transition-all"
            >
              <option value="product">Product</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="btn-secondary text-xs flex items-center gap-1.5 py-2"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && liveRecords.length === 0 && (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3 text-gray-400">
            <RefreshCw size={16} className="animate-spin" />
            <span className="text-sm">Loading data from Bright Data...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error} — showing mock data
        </div>
      )}

      {/* Data table */}
      {!loading || liveRecords.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-3 text-[11px] uppercase tracking-wider text-gray-500 font-medium">Product</th>
                <th className="pb-3 text-[11px] uppercase tracking-wider text-gray-500 font-medium">Price</th>
                <th className="pb-3 text-[11px] uppercase tracking-wider text-gray-500 font-medium hidden sm:table-cell">Rating</th>
                <th className="pb-3 text-[11px] uppercase tracking-wider text-gray-500 font-medium hidden md:table-cell">Availability</th>
                <th className="pb-3 text-[11px] uppercase tracking-wider text-gray-500 font-medium hidden lg:table-cell">Last Updated</th>
                <th className="pb-3 text-[11px] uppercase tracking-wider text-gray-500 font-medium hidden xl:table-cell">Collector</th>
                <th className="pb-3 text-[11px] uppercase tracking-wider text-gray-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleRecords.map((record, i) => (
                <tr
                  key={record.id}
                  className="border-b border-white/5 hover:bg-surface-3/30 transition-colors group"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <td className="py-3 text-sm text-white font-medium group-hover:text-cyan-400 transition-colors">{record.product}</td>
                  <td className="py-3 text-sm text-gray-300 font-mono">{record.price}</td>
                  <td className="py-3 text-sm text-gray-300 hidden sm:table-cell">
                    <span className="flex items-center gap-1">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      {record.rating}
                    </span>
                  </td>
                  <td className="py-3 text-sm hidden md:table-cell">
                    <span className={
                      record.availability === 'In Stock' || record.availability === 'In stock' ? 'text-emerald-400' :
                      record.availability === 'Low Stock' ? 'text-amber-400' : 'text-gray-400'
                    }>
                      {record.availability}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-400 hidden lg:table-cell">{record.lastUpdated}</td>
                  <td className="py-3 text-xs font-mono text-cyan-400 hidden xl:table-cell">{record.collectorId}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${statusDotColors[record.status]}`} />
                      <span className={`text-xs capitalize ${statusColors[record.status]}`}>{record.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        <span className="text-xs text-gray-500">
          Showing {visibleRecords.length} of {totalRecords} records
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="p-1.5 rounded-lg bg-surface-3 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs text-gray-400 px-2">{safePage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="p-1.5 rounded-lg bg-surface-3 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
