const ADMIN_BASE_URL = 'https://admin.online2study.in';

export const getSessionId = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('sessionId');
};

/**
 * Wrapper around fetch that enforces stateless sessionId auth and omits cookies.
 * @param {string} input Either a full URL or a path relative to the admin base URL.
 * @param {RequestInit} options Additional fetch options.
 * @returns {Promise<Response>}
 */
export const backendFetch = (input, options = {}) => {
  const url = input.startsWith('http') ? input : `${ADMIN_BASE_URL}${input.startsWith('/') ? '' : '/'}${input}`;
  const sessionId = getSessionId();
  const mergedHeaders = {
    ...(options.headers || {}),
  };

  if (sessionId && !mergedHeaders.Authorization) {
    mergedHeaders.Authorization = `Bearer ${sessionId}`;
  }

  return fetch(url, {
    ...options,
    credentials: 'omit',
    headers: mergedHeaders,
  });
};
