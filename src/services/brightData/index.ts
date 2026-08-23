import type { BrightDataService } from './types';
import { fetchBrightDataService } from './fetch';
import { mockBrightDataService } from './mock';

// Use real API if VITE_USE_MOCK is not "true", otherwise use mock.
const useMock = import.meta.env.VITE_USE_MOCK === 'true';

// TODO: Switch entirely to fetchBrightDataService when Bright Data backend is ready.
export const brightDataService: BrightDataService = useMock
  ? mockBrightDataService
  : fetchBrightDataService;
