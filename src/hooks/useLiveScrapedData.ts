import { useState, useEffect, useCallback } from 'react';
import type { ScrapedRecord } from '@/types';

interface UseLiveScrapedDataResult {
  records: ScrapedRecord[];
  loading: boolean;
  error: string | null;
  source: 'live' | 'local' | null;
  recordCount: number;
  refresh: () => void;
}

export function useLiveScrapedData(collectorId?: string): UseLiveScrapedDataResult {
  const [records, setRecords] = useState<ScrapedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'live' | 'local' | null>(null);
  const [recordCount, setRecordCount] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/scraper/data');
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      const allRecords: ScrapedRecord[] = data.records || [];
      const filtered = collectorId
        ? allRecords.filter((r) => r.collectorId === collectorId)
        : allRecords;

      setRecords(filtered);
      setSource(data.source);
      setRecordCount(data.recordCount ?? filtered.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [collectorId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Listen for scraper-run-complete events to auto-refresh
  useEffect(() => {
    const handler = () => fetchData();
    window.addEventListener('scraper-run-complete', handler);
    return () => window.removeEventListener('scraper-run-complete', handler);
  }, [fetchData]);

  return { records, loading, error, source, recordCount, refresh: fetchData };
}
