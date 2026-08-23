import type { Collector, ScrapedRecord, HealingEvent } from '@/types';

export interface BrightDataService {
  createScraper(config: CreateScraperConfig): Promise<Collector>;
  runScraper(collectorId: string): Promise<boolean>;
  healScraper(collectorId: string, event: HealingEvent): Promise<boolean>;
  getCollectorStatus(collectorId: string): Promise<Collector>;
  getScrapedData(collectorId: string): Promise<ScrapedRecord[]>;
}

export interface CreateScraperConfig {
  name: string;
  target: string;
  selectors: Record<string, string>;
  schedule: string;
}
