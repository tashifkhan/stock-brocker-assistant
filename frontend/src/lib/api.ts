/**
 * Centralized API client for backend communication
 * Base URL: http://localhost:8000
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Response wrapper types
export interface ApiResponse<T> {
  status: string;
  data?: T;
  [key: string]: any;
}

// Market Summary Types
export interface MarketMetric {
  name: string;
  value: number;
  change: number;
  change_percent: number;
  trend: "up" | "down" | "neutral";
}

export interface MarketSummary {
  date: string;
  indices: MarketMetric[];
  top_gainers: Array<{
    symbol: string;
    name: string;
    price: number;
    change_percent: number;
  }>;
  top_losers: Array<{
    symbol: string;
    name: string;
    price: number;
    change_percent: number;
  }>;
  market_news: Array<{
    title: string;
    source: string;
    timestamp: string;
  }>;
  status: string;
}

// Financial Data Types
export interface FileUploadResponse {
  file_id: string;
  filename: string;
  status: string;
}

export interface AnalysisResult {
  file_id: string;
  filename: string;
  parameters: EvaluationParameters | null;
  summary: string | null;
  status: string;
}

export interface EvaluationParameters {
  parameter_name: string;
  definition: string;
  importance: string;
  interpretation: string;
  benchmark_or_note?: string;
}

// Editorial Types
export interface EditorialSuggestion {
  original_text: string;
  suggestions: string[];
  content_type: string;
  status: string;
}

export interface StyleGuide {
  guidelines: Record<string, any>;
  status: string;
}

// Article Types
export interface Article {
  _id?: string;
  link: string;
  title: string;
  text?: string | null;
  authors?: string[];
  author?: string[]; // Keep for backwards compatibility
  publish_date?: string | null;
  keywords?: string[];
  tags?: string[];
  thumbnail?: string | null;
  source?: string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface ScrapeArticlesResponse {
  status: string;
  message: string;
  total_articles: number;
  articles: Article[];
}

// Filings Types
export interface Filing {
  title: string;
  url: string;
  date: string;
  source: string;
  [key: string]: any;
}

// Admin Types
export interface SystemMetrics {
  uptime_hours: number;
  memory_usage_percent: number;
  cpu_usage_percent: number;
  disk_usage_percent: number;
  active_users: number;
  total_requests: number;
}

export interface UserSettings {
  theme: string;
  notifications_enabled: boolean;
  email_digest_frequency: string;
  language: string;
  timezone?: string;
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const isFormData = options?.body instanceof FormData;
  
  // Get auth token if available
  const token = localStorage.getItem('auth_token');
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  
  const defaultHeaders: HeadersInit = isFormData
    ? { ...authHeader, ...(options?.headers as HeadersInit | undefined) }
    : {
        "Content-Type": "application/json",
        ...authHeader,
        ...options?.headers,
      };

  try {
    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `HTTP Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ============ MARKET SUMMARY API ============

export const marketApi = {
  getDaily: (date?: string) => {
    const params = new URLSearchParams();
    if (date) params.append("date", date);
    const query = params.toString();
    return apiCall<MarketSummary>(
      `/market-summary/daily${query ? `?${query}` : ""}`
    );
  },

  getSectors: (date?: string) => {
    const params = new URLSearchParams();
    if (date) params.append("date", date);
    const query = params.toString();
    return apiCall<{ sectors: Record<string, any>; status: string }>(
      `/market-summary/sectors${query ? `?${query}` : ""}`
    );
  },

  getWatchlist: (symbols: string[]) => {
    return apiCall<{ watchlist: any[]; status: string }>(
      `/market-summary/watchlist?symbols=${symbols.join(",")}`
    );
  },
};

// ============ FINANCIAL DATA API ============

export const financialDataApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiCall<FileUploadResponse>("/financial-data/upload", {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },

  analyze: (fileId: string) => {
    return apiCall<AnalysisResult>("/financial-data/analyze", {
      method: "POST",
      body: JSON.stringify({ file_id: fileId }),
    });
  },

  getAnalysis: (fileId: string) => {
    return apiCall<AnalysisResult>(`/financial-data/${fileId}`);
  },
};

// ============ ARTICLES API ============

export const articlesApi = {
  scrape: (
    count: number = 5,
    maxArticles: number = 100,
    websites?: string[]
  ) => {
    const params = new URLSearchParams();
    params.append("count", count.toString());
    params.append("max_articles", maxArticles.toString());
    if (websites && websites.length > 0) {
      params.append("websites", websites.join(","));
    }
    return apiCall<ScrapeArticlesResponse>(
      `/articles/scrape?${params.toString()}`
    );
  },

  getSaved: (limit: number = 50, skip: number = 0) => {
    return apiCall<Article[]>(
      `/articles/saved?limit=${limit}&skip=${skip}`
    );
  },
};

// ============ EDITORIAL API ============

export const editorialApi = {
  getSuggestions: (text: string, contentType: string = "article") => {
    return apiCall<EditorialSuggestion>("/editorial/suggestions", {
      method: "POST",
      body: JSON.stringify({
        text,
        content_type: contentType,
      }),
    });
  },

  getStyleGuide: () => {
    return apiCall<StyleGuide>("/editorial/style-guide");
  },

  getAnalytics: () => {
    return apiCall<{ analytics: Record<string, any>; status: string }>(
      "/editorial/analytics"
    );
  },
};

// ============ REPORT ANALYSIS API ============

export const reportAnalysisApi = {
  generateParameters: (report: string) => {
    return apiCall<{
      parameters: EvaluationParameters;
      status: string;
      [key: string]: any;
    }>("/report-analysis/generate-parameters", {
      method: "POST",
      body: JSON.stringify({ report }),
    });
  },

  evaluateParameter: (
    report: string,
    parameter: EvaluationParameters
  ) => {
    return apiCall<any>("/report-analysis/evaluate-parameter", {
      method: "POST",
      body: JSON.stringify({
        report,
        parameter,
      }),
    });
  },

  fullAnalysis: (report: string) => {
    return apiCall<any>("/report-analysis/full-analysis", {
      method: "POST",
      body: JSON.stringify({
        report,
      }),
    });
  },
};

// ============ FILINGS API ============

export const filingsApi = {
  getUSFilings: (count: number = 90) => {
    return apiCall<{ results: Filing[]; [key: string]: any }>(
      `/market-filling/us?count=${count}`
    );
  },

  getIndiaFilings: (count: number = 90) => {
    return apiCall<{ results: Filing[]; [key: string]: any }>(
      `/market-filling/india?count=${count}`
    );
  },

  emailUSFilings: (to: string, cc?: string[]) => {
    return apiCall<any>("/market-filling/us/email", {
      method: "POST",
      body: JSON.stringify({
        to,
        cc,
      }),
    });
  },

  emailIndiaFilings: (to: string, cc?: string[]) => {
    return apiCall<any>("/market-filling/india/email", {
      method: "POST",
      body: JSON.stringify({
        to,
        cc,
      }),
    });
  },
};

// ============ ADMIN API ============

export const adminApi = {
  getMetrics: () => {
    return apiCall<{ metrics: SystemMetrics; status: string }>("/admin/metrics");
  },

  getSettings: () => {
    return apiCall<{ settings: Record<string, any>; status: string }>(
      "/admin/settings"
    );
  },

  updateSettings: (key: string, value: any) => {
    return apiCall<any>("/admin/settings", {
      method: "POST",
      body: JSON.stringify({ key, value }),
    });
  },

  getUsers: (limit: number = 10, offset: number = 0) => {
    return apiCall<any>(
      `/admin/users?limit=${limit}&offset=${offset}`
    );
  },

  getLogs: (limit: number = 100) => {
    return apiCall<any>(`/admin/logs?limit=${limit}`);
  },
};

// ============ USER SETTINGS API ============

export const userSettingsApi = {
  getSettings: () => {
    return apiCall<{ settings: UserSettings; status: string }>(
      "/admin/settings/user"
    );
  },

  updateSettings: (settings: Partial<UserSettings>) => {
    return apiCall<any>("/admin/settings/user", {
      method: "POST",
      body: JSON.stringify(settings),
    });
  },
};

// ============ AUTH API ============

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserPublic {
  id: string;
  email: string;
  username: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface ResendVerificationRequest {
  email: string;
}

// Helper to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper to add auth header
const authHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authApi = {
  register: (data: RegisterRequest) => {
    return apiCall<UserPublic>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    return apiCall<LoginResponse>("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });
  },

  getMe: () => {
    return apiCall<UserPublic>("/auth/me", {
      headers: authHeaders(),
    });
  },

  forgotPassword: (data: ForgotPasswordRequest) => {
    return apiCall<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  resetPassword: (data: ResetPasswordRequest) => {
    return apiCall<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  verifyEmail: (token: string) => {
    return apiCall<{ message: string }>(`/auth/verify-email?token=${token}`);
  },

  resendVerification: (data: ResendVerificationRequest) => {
    return apiCall<{ message: string }>("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  changePassword: (data: ChangePasswordRequest) => {
    return apiCall<{ message: string }>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
      headers: authHeaders(),
    });
  },
};

// ============ HEALTH CHECK ============

export const healthApi = {
  check: () => {
    return apiCall<{ status: string }>("/");
  },
};
