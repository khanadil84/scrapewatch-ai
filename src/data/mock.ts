import type { Collector, ScrapedRecord, HealingEvent, ChangeEvent, ActivityEvent, SystemMetric } from '@/types';

export const collectors: Collector[] = [
  {
    id: 'c_mt5ryoya2bepdq2a8c',
    name: 'Book Scraper',
    target: 'books.toscrape.com',
    status: 'healthy',
    lastRun: '32 seconds ago',
    recordsCollected: 20,
    successRate: 100,
    schedule: 'Manual',
  },
  {
    id: 'c_3b7e42',
    name: 'Price Monitor',
    target: 'competitor-pricing.io',
    status: 'healthy',
    lastRun: '2 minutes ago',
    recordsCollected: 856,
    successRate: 99.5,
    schedule: 'Every 30 min',
  },
  {
    id: 'c_9d1f55',
    name: 'Review Aggregator',
    target: 'marketplace-reviews.com',
    status: 'warning',
    lastRun: '5 minutes ago',
    recordsCollected: 2341,
    successRate: 97.2,
    schedule: 'Every hour',
  },
];

export const scrapedRecords: ScrapedRecord[] = [
  { id: 'r_001', product: 'Laptop Pro 16"', price: '$1,899', rating: 4.8, availability: 'In Stock', lastUpdated: '32 sec ago', collectorId: 'c_mt5ryoya2bepdq2a8c', status: 'healthy' },
  { id: 'r_002', product: 'Wireless Mouse X1', price: '$49', rating: 4.5, availability: 'In Stock', lastUpdated: '32 sec ago', collectorId: 'c_mt5ryoya2bepdq2a8c', status: 'healthy' },
  { id: 'r_003', product: '4K Monitor Ultra', price: '$699', rating: 4.7, availability: 'Low Stock', lastUpdated: '2 min ago', collectorId: 'c_3b7e42', status: 'healthy' },
  { id: 'r_004', product: 'Mechanical Keyboard', price: '$159', rating: 4.6, availability: 'In Stock', lastUpdated: '2 min ago', collectorId: 'c_3b7e42', status: 'healthy' },
  { id: 'r_005', product: 'Noise Cancelling Headphones', price: '$349', rating: 4.9, availability: 'In Stock', lastUpdated: '5 min ago', collectorId: 'c_9d1f55', status: 'warning' },
  { id: 'r_006', product: 'USB-C Hub 7-in-1', price: '$79', rating: 4.3, availability: 'Out of Stock', lastUpdated: '5 min ago', collectorId: 'c_9d1f55', status: 'warning' },
  { id: 'r_007', product: 'Portable SSD 2TB', price: '$189', rating: 4.7, availability: 'In Stock', lastUpdated: '32 sec ago', collectorId: 'c_mt5ryoya2bepdq2a8c', status: 'healthy' },
  { id: 'r_008', product: 'Webcam HD Pro', price: '$129', rating: 4.4, availability: 'In Stock', lastUpdated: '2 min ago', collectorId: 'c_3b7e42', status: 'healthy' },
];

export const healingEvents: HealingEvent[] = [
  {
    id: 'h_001',
    collectorId: 'c_mt5ryoya2bepdq2a8c',
    timestamp: '14:02:31',
    stages: ['failure_detected', 'change_identified', 'repair_generated', 'rerunning', 'recovery_verified'],
    failureReason: 'Price field returned null',
    oldSelector: '.product-grid > .card .price',
    newSelector: '[data-test="price"] > span.amount',
    recordsRecovered: 20,
    resolved: true,
    resolutionTime: '8 seconds',
  },
  {
    id: 'h_002',
    collectorId: 'c_3b7e42',
    timestamp: '12:45:10',
    stages: ['failure_detected', 'change_identified', 'repair_generated', 'rerunning', 'recovery_verified'],
    failureReason: 'Availability badge removed from DOM',
    oldSelector: '.availability-badge',
    newSelector: '[data-testid="stock-status"]',
    recordsRecovered: 856,
    resolved: true,
    resolutionTime: '6 seconds',
  },
];

export const changeEvents: ChangeEvent[] = [
  {
    id: 'ch_001',
    url: 'https://example-store.com/products',
    domain: 'example-store.com',
    changeDescription: 'Price selector changed from .price to [data-test="price"]',
    severity: 'high',
    detectedAt: '2 minutes ago',
    status: 'repaired',
    selector: '.price',
  },
  {
    id: 'ch_002',
    url: 'https://competitor-pricing.io/catalog',
    domain: 'competitor-pricing.io',
    changeDescription: 'Product card structure changed — new nested layout',
    severity: 'medium',
    detectedAt: '15 minutes ago',
    status: 'monitoring',
    selector: '.product-card',
  },
  {
    id: 'ch_003',
    url: 'https://marketplace-reviews.com/item/123',
    domain: 'marketplace-reviews.com',
    changeDescription: 'Review pagination now uses infinite scroll',
    severity: 'low',
    detectedAt: '1 hour ago',
    status: 'monitoring',
    selector: '.pagination',
  },
];

export const activityEvents: ActivityEvent[] = [
  { id: 'a_001', type: 'collector_completed', message: 'Bright Data collector verified — 20 records from books.toscrape.com', timestamp: '2 min ago', collectorId: 'c_mt5ryoya2bepdq2a8c' },
  { id: 'a_002', type: 'healing_generated', message: 'AI repair accepted in Scraper Studio for c_mt5ryoya2bepdq2a8c', timestamp: '5 min ago', collectorId: 'c_mt5ryoya2bepdq2a8c' },
  { id: 'a_003', type: 'collector_healed', message: 'Production collector v2 verified — 100% extraction success', timestamp: '5 min ago', collectorId: 'c_mt5ryoya2bepdq2a8c' },
  { id: 'a_004', type: 'change_detected', message: 'Structure change detected on books.toscrape.com', timestamp: '6 min ago' },
  { id: 'a_005', type: 'schema_verified', message: 'Data schema verified for Price Monitor (demo)', timestamp: '12 min ago', collectorId: 'c_3b7e42' },
  { id: 'a_006', type: 'records_collected', message: '856 new records collected from competitor-pricing.io (demo)', timestamp: '15 min ago', collectorId: 'c_3b7e42' },
  { id: 'a_007', type: 'collector_completed', message: 'Review Aggregator completed — 2,341 records (demo)', timestamp: '20 min ago', collectorId: 'c_9d1f55' },
  { id: 'a_008', type: 'change_detected', message: 'Review pagination changed on marketplace-reviews.com (demo)', timestamp: '1 hour ago' },
];

export const systemMetrics: SystemMetric[] = [
  { label: 'Collector Health', value: 99.8, unit: '%', trend: '+0.2%' },
  { label: 'Extraction Integrity', value: 100, unit: '%', trend: 'Stable' },
  { label: 'Schema Stability', value: 99.9, unit: '%', trend: '+0.1%' },
  { label: 'Average Recovery', value: 4.2, unit: 'sec', trend: '-0.8s' },
];

export const kpiData = [
  { label: 'Records Collected', value: '20', trend: 'Bright Data verified', icon: 'database' },
  { label: 'Latest Run Success', value: '100%', trend: 'Production v2', icon: 'check-circle' },
  { label: 'Live Collectors', value: '1', trend: 'c_mt5ryoya2bepdq2a8c', icon: 'wrench' },
  { label: 'Failed Crawls', value: '0', trend: 'All extractions healthy', icon: 'layers' },
];
