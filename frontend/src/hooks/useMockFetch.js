import { useState, useEffect, useCallback } from 'react';

/**
 * Reusable custom hook to simulate realistic asynchronous data fetching
 * @param {Function | Array | Object} sourceData - Data source or generator function
 * @param {number} delayMs - Simulated latency in milliseconds (default: 450ms)
 * @param {Array} dependencies - Dependency array to trigger refetch
 */
export const useMockFetch = (sourceData, delayMs = 450, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const executeFetch = useCallback(() => {
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      try {
        const result = typeof sourceData === 'function' ? sourceData() : sourceData;
        setData(result);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [sourceData, delayMs, ...dependencies]);

  useEffect(() => {
    const cancel = executeFetch();
    return cancel;
  }, [executeFetch]);

  return {
    data,
    loading,
    error,
    refetch: executeFetch,
    setData
  };
};

export default useMockFetch;
