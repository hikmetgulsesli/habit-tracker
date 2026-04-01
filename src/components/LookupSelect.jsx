import React from 'react';
import { useLookups } from '../hooks/useLookups.js';
import './LookupSelect.css';

/**
 * Dropdown component that uses lookup values
 * Demonstrates real-time updates when admin changes values
 */
function LookupSelect({ 
  category, 
  value, 
  onChange, 
  placeholder = 'Select...',
  includeInactive = false,
  showUsage = false,
  className = ''
}) {
  const { getCategoryValues, lookupValues, isLoaded } = useLookups();
  
  const options = includeInactive 
    ? (lookupValues[category] || []).sort((a, b) => a.sort_order - b.sort_order)
    : getCategoryValues(category);

  if (!isLoaded) {
    return <select className={`lookup-select ${className}`} disabled>
      <option>Loading...</option>
    </select>;
  }

  return (
    <select 
      className={`lookup-select ${className}`}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map(item => (
        <option 
          key={item.id} 
          value={item.id}
          disabled={!item.is_active}
        >
          {item.value}
          {showUsage && item.usage_count > 0 && ` (${item.usage_count})`}
          {!item.is_active && ' (inactive)'}
        </option>
      ))}
    </select>
  );
}

export default LookupSelect;
