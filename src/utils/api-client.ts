const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const timeout = 45000; // 45 seconds timeout for cold starts (Render.com)
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const isFormData = options.body instanceof FormData;
    const headers = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    } as Record<string, string>;

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers,
    });

    clearTimeout(id);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error: unknown) {
    clearTimeout(id);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms (Backend may be cold-starting)`);
      }
      throw error;
    }
    throw new Error('An unknown error occurred during API fetch');
  }
}
