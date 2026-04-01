import { useState, useEffect, useCallback } from 'react';
import { getLookupValues, getActiveLookupValues, saveLookupValues, incrementUsage } from '../data/lookupValues.js';

/**
 * Hook for managing lookup values across the application
 * Provides real-time updates when lookup values change
 */
export function useLookups() {
  const [lookupValues, setLookupValues] = useState({});
  const [activeValues, setActiveValues] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial values
  useEffect(() => {
    const values = getLookupValues();
    setLookupValues(values);
    setActiveValues(getActiveLookupValues(values));
    setIsLoaded(true);
  }, []);

  // Listen for changes from other components/tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'lookup_values') {
        const values = e.newValue ? JSON.parse(e.newValue) : getLookupValues();
        setLookupValues(values);
        setActiveValues(getActiveLookupValues(values));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Get active values for a specific category
  const getCategoryValues = useCallback((category) => {
    return activeValues[category] || [];
  }, [activeValues]);

  // Record usage of a lookup value
  const recordUsage = useCallback((category, id) => {
    setLookupValues(prev => {
      const newValues = incrementUsage(prev, category, id);
      saveLookupValues(newValues);
      return newValues;
    });
  }, []);

  // Refresh values (useful after admin changes)
  const refresh = useCallback(() => {
    const values = getLookupValues();
    setLookupValues(values);
    setActiveValues(getActiveLookupValues(values));
  }, []);

  return {
    lookupValues,
    activeValues,
    getCategoryValues,
    recordUsage,
    refresh,
    isLoaded
  };
}

export default useLookups;
