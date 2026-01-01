// Centralized configuration for API endpoints

export const API_BASE_URL = "https://sandybrown-parrot-500490.hostingersite.com/api.php";

/**
 * Constructs a full API URL for a given endpoint.
 * @param endpoint The specific API endpoint (e.g., 'hotels', 'bookings').
 * @param params Optional query parameters as a key-value object.
 * @returns The full, correctly formatted URL.
 */
export const getApiUrl = (endpoint: string, params?: Record<string, string | number>): string => {
    // Start with the base URL, ensuring no query string is present.
    const baseUrl = API_BASE_URL.split('?')[0];
    
    // Construct search parameters safely.
    const searchParams = new URLSearchParams({ endpoint });

    if (params) {
        for (const key in params) {
            searchParams.append(key, String(params[key]));
        }
    }

    return `${baseUrl}?${searchParams.toString()}`;
};
