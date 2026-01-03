// Centralized configuration for API endpoints

export const API_BASE_URL = "https://sandybrown-parrot-500490.hostingersite.com/api.php";

/**
 * Constructs a full API URL for a given endpoint.
 * @param endpoint The specific API endpoint (e.g., 'hotels', 'bookings').
 * @param params Optional query parameters as a key-value object.
 * @returns The full, correctly formatted URL.
 */
export const getApiUrl = (endpoint: string, params?: Record<string, string | number>): string => {
    // Use the URL constructor for robust URL handling.
    // It correctly parses the base and allows safe manipulation of search params.
    const url = new URL(API_BASE_URL);

    // Set the primary 'endpoint' parameter. This will overwrite if it somehow exists.
    url.searchParams.set('endpoint', endpoint);

    // Append any additional parameters.
    if (params) {
        for (const key in params) {
            url.searchParams.append(key, String(params[key]));
        }
    }

    // Return the complete URL as a string.
    return url.toString();
};
