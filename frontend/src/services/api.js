/**
 * Dayflow HRMS — Centralized API Service
 * Handles all backend communication, JWT token management, and error handling.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// ─── Token Session ─────────────────────────────────────────────────────────

let accessToken = localStorage.getItem('dayflow.accessToken');
let refreshToken = localStorage.getItem('dayflow.refreshToken');

export const session = {
  get token() { return accessToken; },
  get refreshToken() { return refreshToken; },
  set(tokens) {
    accessToken = tokens.accessToken;
    refreshToken = tokens.refreshToken;
    localStorage.setItem('dayflow.accessToken', tokens.accessToken);
    localStorage.setItem('dayflow.refreshToken', tokens.refreshToken);
  },
  clear() {
    accessToken = null;
    refreshToken = null;
    localStorage.removeItem('dayflow.accessToken');
    localStorage.removeItem('dayflow.refreshToken');
  }
};

// ─── Request Helper ─────────────────────────────────────────────────────────

async function request(path, options = {}, retry = true) {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  try {
    const response = await fetch(`${API_BASE}${path}`, { ...options, headers });

    // Auto-refresh on 401
    if (response.status === 401 && retry && refreshToken) {
      try {
        const result = await request(
          '/api/auth/refresh',
          { method: 'POST', body: JSON.stringify({ refreshToken }) },
          false
        );
        session.set(result.data);
        return request(path, options, false);
      } catch {
        session.clear();
        window.dispatchEvent(new CustomEvent('dayflow:session-expired'));
        throw new Error('Session expired. Please sign in again.');
      }
    }

    if (response.status === 204) {
      return { success: true, data: undefined };
    }

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      const details = Array.isArray(body?.error?.details)
        ? body.error.details
            .map((item) => item?.message || (Array.isArray(item?.path) ? item.path.join('.') : ''))
            .filter(Boolean)
        : [];
      const detail = details.length
        ? details.join('; ')
        : body?.message || `Request failed (${response.status})`;
      throw new Error(detail);
    }

    return body;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('Unable to connect to Dayflow. Please check your network connection.');
  }
}

// ─── API Methods ─────────────────────────────────────────────────────────────

export const api = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  signup: (body) =>
    request('/api/auth/signup', { method: 'POST', body: JSON.stringify(body) }),

  login: (body) =>
    request('/api/auth/signin', { method: 'POST', body: JSON.stringify(body) }),

  logout: () =>
    request('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    }),

  me: () => request('/api/auth/me'),

  verifyEmail: (token) =>
    request(`/api/auth/verify-email?token=${encodeURIComponent(token)}`),

  resendVerification: (email) =>
    request('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),

  forgotPassword: (email) =>
    request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),

  resetPassword: (body) =>
    request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  // ── Dashboard ─────────────────────────────────────────────────────────────
  adminDashboard: () => request('/api/dashboard/admin'),
  employeeDashboard: () => request('/api/dashboard/employee'),

  // ── Employees ─────────────────────────────────────────────────────────────
  employees: (query = '') => request(`/api/employees${query}`),
  employee: (id) => request(`/api/employees/${id}`),
  myProfile: () => request('/api/employees/me'),
  updateMyProfile: (body) =>
    request('/api/employees/me', { method: 'PATCH', body: JSON.stringify(body) }),
  updateEmployee: (id, body) =>
    request(`/api/employees/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  uploadProfilePicture: (file) => {
    const body = new FormData();
    body.append('file', file);
    return request('/api/employees/me/profile-picture', { method: 'POST', body });
  },

  // ── Attendance ────────────────────────────────────────────────────────────
  myAttendance: (query = '') => request(`/api/attendance/me${query}`),
  allAttendance: (query = '') => request(`/api/attendance${query}`),
  checkIn: () => request('/api/attendance/check-in', { method: 'POST' }),
  checkOut: () => request('/api/attendance/check-out', { method: 'POST' }),
  employeeAttendance: (employeeId, query = '') =>
    request(`/api/attendance/${employeeId}${query}`),

  // ── Leave ─────────────────────────────────────────────────────────────────
  myLeaves: () => request('/api/leaves/me'),
  allLeaves: () => request('/api/leaves'),
  applyLeave: (body) =>
    request('/api/leaves', { method: 'POST', body: JSON.stringify(body) }),
  cancelLeave: (id) =>
    request(`/api/leaves/${id}/cancel`, { method: 'PATCH' }),
  approveLeave: (id, comment) =>
    request(`/api/leaves/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ comment })
    }),
  rejectLeave: (id, comment) =>
    request(`/api/leaves/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ comment })
    }),

  // ── Payroll ───────────────────────────────────────────────────────────────
  myPayroll: () => request('/api/payroll/me'),
  myPayrollHistory: () => request('/api/payroll/me/history'),
  employeePayroll: (employeeId) => request(`/api/payroll/${employeeId}`),
  setEmployeePayroll: (employeeId, body) =>
    request(`/api/payroll/${employeeId}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    }),

  // ── Documents ─────────────────────────────────────────────────────────────
  myDocuments: () => request('/api/documents/me'),
  uploadDocument: (file, type) => {
    const body = new FormData();
    body.append('file', file);
    if (type) body.append('type', type);
    return request('/api/documents', { method: 'POST', body });
  },
  deleteDocument: (id) => request(`/api/documents/${id}`, { method: 'DELETE' }),

  // ── Notifications ─────────────────────────────────────────────────────────
  notifications: () => request('/api/notifications'),
  unreadCount: () => request('/api/notifications/unread-count'),
  markRead: (id) =>
    request(`/api/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () =>
    request('/api/notifications/read-all', { method: 'PATCH' }),

  // ── Reports ───────────────────────────────────────────────────────────────
  reportAttendance: (query = '') => request(`/api/reports/attendance${query}`),
  reportLeaves: (query = '') => request(`/api/reports/leaves${query}`),
  reportPayroll: (query = '') => request(`/api/reports/payroll${query}`),
  reportEmployees: (query = '') => request(`/api/reports/employees${query}`)
};

export default api;
