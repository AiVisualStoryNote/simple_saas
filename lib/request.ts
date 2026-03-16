type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestConfig {
  method?: RequestMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  mkt?: string | null; // 'cn' or null (默认为空，即海外市场)
}

interface FetchResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
}

class RequestError extends Error {
  constructor(
    message: string,
    public status: number = 0,
    public isNetworkError: boolean = false
  ) {
    super(message);
    this.name = 'RequestError';
  }
}

async function request<T = any>(url: string, config: RequestConfig = {}): Promise<FetchResponse<T>> {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = 3 * 60 * 1000, // 默认 3 分钟超时
    mkt = null,
  } = config;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (mkt) {
      requestHeaders['X-Mkt'] = mkt;
    }

    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const status = response.status;

    let data: T;
    try {
      data = await response.json();
    } catch {
      data = null as T;
    }

    if (!response.ok) {
      const errorMessage = data && typeof data === 'object' && 'error' in data
        ? (data as any).error
        : `Request failed with status ${status}`;
      return {
        data: null,
        error: errorMessage,
        status,
      };
    }

    return {
      data,
      error: null,
      status,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          data: null,
          error: 'Request timeout',
          status: 0,
        };
      }

      return {
        data: null,
        error: error.message,
        status: 0,
      };
    }

    return {
      data: null,
      error: 'Unknown error occurred',
      status: 0,
    };
  }
}

export const requestClient = {
  get<T = any>(url: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<FetchResponse<T>> {
    return request<T>(url, { ...config, method: 'GET' });
  },

  post<T = any>(url: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<FetchResponse<T>> {
    return request<T>(url, { ...config, method: 'POST', body });
  },

  put<T = any>(url: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<FetchResponse<T>> {
    return request<T>(url, { ...config, method: 'PUT', body });
  },

  delete<T = any>(url: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<FetchResponse<T>> {
    return request<T>(url, { ...config, method: 'DELETE' });
  },
};

export { request, RequestError };
export type { RequestConfig, FetchResponse, RequestMethod };
