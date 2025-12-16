/**
 * Coinbase API service for fetching Bitcoin price data
 */

export interface CoinbaseTickerResponse {
  price: string;
  size: string;
  time: string;
  bid: string;
  ask: string;
  volume: string;
}

export interface CoinbaseExchangeRateResponse {
  data: {
    currency: string;
    rates: {
      USD: string;
    };
  };
}

/**
 * Fetches the current BTC/USD ticker price from Coinbase Exchange API
 * @returns Promise resolving to the ticker data
 * @throws Error if the API request fails
 */
export async function getBitcoinPrice(): Promise<number> {
  try {
    const response = await fetch(
      'https://api.exchange.coinbase.com/products/BTC-USD/ticker'
    );

    if (!response.ok) {
      throw new Error(`Coinbase API error: ${response.status}`);
    }

    const data: CoinbaseTickerResponse = await response.json();
    return Number(data.price);
  } catch (error) {
    try {
      const fallbackResponse = await fetch(
        'https://api.coinbase.com/v2/exchange-rates?currency=BTC'
      );

      if (!fallbackResponse.ok) {
        throw new Error(`Coinbase fallback API error: ${fallbackResponse.status}`);
      }

      const fallbackData: CoinbaseExchangeRateResponse =
        await fallbackResponse.json();
      return Number(fallbackData.data.rates.USD);
    } catch (fallbackError) {
      const primaryError = error instanceof Error ? error.message : 'Unknown error';
      const fallbackErrorMsg = fallbackError instanceof Error ? fallbackError.message : 'Unknown error';
      throw new Error(
        `Failed to fetch Bitcoin price: ${primaryError}. Fallback also failed: ${fallbackErrorMsg}`
      );
    }
  }
}

