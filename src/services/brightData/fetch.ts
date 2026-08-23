import type { BrightDataService, CreateScraperConfig } from './types';
import type { Collector, ScrapedRecord, HealingEvent } from '@/types';
import { normalizeBrightData } from './normalize';

const API_BASE = '/api';

export const fetchBrightDataService: BrightDataService = {
  async createScraper(config: CreateScraperConfig): Promise<Collector> {
    const id = 'c_' + Math.random().toString(36).substring(2, 8);
    return {
      id,
      name: config.name,
      target: config.target,
      status: 'idle',
      lastRun: 'Never',
      recordsCollected: 0,
      successRate: 0,
      schedule: config.schedule,
    };
  },

  async runScraper(_collectorId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/scraper/data`);
      return res.ok;
    } catch {
      return false;
    }
  },

  async healScraper(_collectorId: string, _event: HealingEvent): Promise<boolean> {
    return true;
  },

  async getCollectorStatus(collectorId: string): Promise<Collector> {
    return {
      id: collectorId,
      name: 'Book Scraper',
      target: 'books.toscrape.com',
      status: 'healthy',
      lastRun: new Date().toLocaleTimeString(),
      recordsCollected: 0,
      successRate: 100,
      schedule: 'Manual',
    };
  },

  async getScrapedData(collectorId: string): Promise<ScrapedRecord[]> {
    const res = await fetch(`${API_BASE}/scraper/data`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return normalizeBrightData(data, collectorId);
  },
};
