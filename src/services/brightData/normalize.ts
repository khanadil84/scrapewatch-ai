import type { ScrapedRecord } from '@/types';

interface BrightDataBook {
  name?: string;
  price?: { value?: number; currency?: string; symbol?: string } | number;
  currency?: string;
  availability?: string;
  rating?: string;
  product_url?: string;
}

interface BrightDataResponse {
  books?: BrightDataBook[];
  input?: { url?: string };
}

const ratingMap: Record<string, number> = {
  One: 1,
  Two: 2,
  Three: 3,
  Four: 4,
  Five: 5,
};

export function normalizeBrightData(
  raw: BrightDataResponse,
  collectorId: string
): ScrapedRecord[] {
  const books = raw?.books || [];

  return books.map((book, i) => {
    const priceVal =
      typeof book.price === 'object' && book.price !== null
        ? book.price.value ?? 0
        : typeof book.price === 'number'
        ? book.price
        : 0;

    const symbol =
      typeof book.price === 'object' && book.price !== null
        ? book.price.symbol || '£'
        : book.currency || '£';

    return {
      id: `bd_${i + 1}`,
      product: book.name || 'Unknown Product',
      price: `${symbol}${priceVal.toFixed(2)}`,
      rating: ratingMap[book.rating ?? ''] ?? 0,
      availability: book.availability || 'Unknown',
      lastUpdated: new Date().toLocaleTimeString(),
      collectorId,
      status: 'healthy' as const,
    };
  });
}
