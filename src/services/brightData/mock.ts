import type { BrightDataService, CreateScraperConfig } from './types';
import type { Collector, ScrapedRecord, HealingEvent } from '@/types';
import { collectors, scrapedRecords } from '@/data/mock';

// TODO: Connect to Bright Data backend/CLI adapter.
// Replace this mock service with real Bright Data integration.
export const mockBrightDataService: BrightDataService = {
  async createScraper(config: CreateScraperConfig): Promise<Collector> {
    await delay(800);
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

  async runScraper(collectorId: string): Promise<boolean> {
    await delay(1500);
    const collector = collectors.find(c => c.id === collectorId);
    return collector?.status !== 'error';
  },

  async healScraper(_collectorId: string, _event: HealingEvent): Promise<boolean> {
    await delay(2000);
    return true;
  },

  async getCollectorStatus(collectorId: string): Promise<Collector> {
    await delay(300);
    const collector = collectors.find(c => c.id === collectorId);
    if (!collector) throw new Error(`Collector ${collectorId} not found`);
    return collector;
  },

  async getScrapedData(collectorId: string): Promise<ScrapedRecord[]> {
    await delay(500);
    return scrapedRecords.filter(r => r.collectorId === collectorId);
  },
};

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
