// Lookup values data store with initial seed data
export const LOOKUP_CATEGORIES = [
  'transport_modes',
  'service_types', 
  'incoterms',
  'sources',
  'potentials',
  'statuses',
  'quote_outcomes',
  'loss_reasons',
  'currencies'
];

export const CATEGORY_LABELS = {
  transport_modes: 'Transport Modes',
  service_types: 'Service Types',
  incoterms: 'Incoterms',
  sources: 'Sources',
  potentials: 'Potentials',
  statuses: 'Statuses',
  quote_outcomes: 'Quote Outcomes',
  loss_reasons: 'Loss Reasons',
  currencies: 'Currencies'
};

// Initial seed data
export const INITIAL_LOOKUP_VALUES = {
  transport_modes: [
    { id: 'tm-1', value: 'Air', sort_order: 1, is_active: true, usage_count: 12 },
    { id: 'tm-2', value: 'Sea', sort_order: 2, is_active: true, usage_count: 45 },
    { id: 'tm-3', value: 'Road', sort_order: 3, is_active: true, usage_count: 28 },
    { id: 'tm-4', value: 'Rail', sort_order: 4, is_active: true, usage_count: 8 },
    { id: 'tm-5', value: 'Multimodal', sort_order: 5, is_active: true, usage_count: 15 }
  ],
  service_types: [
    { id: 'st-1', value: 'Freight Forwarding', sort_order: 1, is_active: true, usage_count: 67 },
    { id: 'st-2', value: 'Customs Clearance', sort_order: 2, is_active: true, usage_count: 34 },
    { id: 'st-3', value: 'Warehousing', sort_order: 3, is_active: true, usage_count: 23 },
    { id: 'st-4', value: 'Distribution', sort_order: 4, is_active: true, usage_count: 19 },
    { id: 'st-5', value: 'Project Cargo', sort_order: 5, is_active: true, usage_count: 5 }
  ],
  incoterms: [
    { id: 'in-1', value: 'EXW', sort_order: 1, is_active: true, usage_count: 8 },
    { id: 'in-2', value: 'FOB', sort_order: 2, is_active: true, usage_count: 32 },
    { id: 'in-3', value: 'CIF', sort_order: 3, is_active: true, usage_count: 28 },
    { id: 'in-4', value: 'DAP', sort_order: 4, is_active: true, usage_count: 15 },
    { id: 'in-5', value: 'DDP', sort_order: 5, is_active: true, usage_count: 21 }
  ],
  sources: [
    { id: 'so-1', value: 'Website', sort_order: 1, is_active: true, usage_count: 45 },
    { id: 'so-2', value: 'Referral', sort_order: 2, is_active: true, usage_count: 23 },
    { id: 'so-3', value: 'Trade Show', sort_order: 3, is_active: true, usage_count: 12 },
    { id: 'so-4', value: 'Cold Call', sort_order: 4, is_active: true, usage_count: 8 },
    { id: 'so-5', value: 'Social Media', sort_order: 5, is_active: true, usage_count: 18 }
  ],
  potentials: [
    { id: 'po-1', value: 'High', sort_order: 1, is_active: true, usage_count: 34 },
    { id: 'po-2', value: 'Medium', sort_order: 2, is_active: true, usage_count: 56 },
    { id: 'po-3', value: 'Low', sort_order: 3, is_active: true, usage_count: 28 }
  ],
  statuses: [
    { id: 'st-1', value: 'New', sort_order: 1, is_active: true, usage_count: 12 },
    { id: 'st-2', value: 'Contacted', sort_order: 2, is_active: true, usage_count: 23 },
    { id: 'st-3', value: 'Qualified', sort_order: 3, is_active: true, usage_count: 18 },
    { id: 'st-4', value: 'Proposal Sent', sort_order: 4, is_active: true, usage_count: 15 },
    { id: 'st-5', value: 'Negotiation', sort_order: 5, is_active: true, usage_count: 8 },
    { id: 'st-6', value: 'Closed', sort_order: 6, is_active: true, usage_count: 42 }
  ],
  quote_outcomes: [
    { id: 'qo-1', value: 'Won', sort_order: 1, is_active: true, usage_count: 38 },
    { id: 'qo-2', value: 'Lost', sort_order: 2, is_active: true, usage_count: 24 },
    { id: 'qo-3', value: 'Pending', sort_order: 3, is_active: true, usage_count: 15 }
  ],
  loss_reasons: [
    { id: 'lr-1', value: 'Price', sort_order: 1, is_active: true, usage_count: 18 },
    { id: 'lr-2', value: 'Service', sort_order: 2, is_active: true, usage_count: 5 },
    { id: 'lr-3', value: 'Competitor', sort_order: 3, is_active: true, usage_count: 12 },
    { id: 'lr-4', value: 'No Response', sort_order: 4, is_active: true, usage_count: 8 },
    { id: 'lr-5', value: 'Timing', sort_order: 5, is_active: true, usage_count: 3 }
  ],
  currencies: [
    { id: 'cu-1', value: 'USD', sort_order: 1, is_active: true, usage_count: 89 },
    { id: 'cu-2', value: 'EUR', sort_order: 2, is_active: true, usage_count: 45 },
    { id: 'cu-3', value: 'GBP', sort_order: 3, is_active: true, usage_count: 12 },
    { id: 'cu-4', value: 'TRY', sort_order: 4, is_active: true, usage_count: 34 }
  ]
};

// Storage key for localStorage
const STORAGE_KEY = 'lookup_values';

// Get lookup values from localStorage or return initial data
export const getLookupValues = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return INITIAL_LOOKUP_VALUES;
};

// Save lookup values to localStorage
export const saveLookupValues = (values) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
};

// Get active values for dropdowns (filtered by is_active)
export const getActiveLookupValues = (values) => {
  const active = {};
  Object.keys(values).forEach(category => {
    active[category] = values[category]
      .filter(item => item.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
  });
  return active;
};

// Generate unique ID
export const generateId = (category) => {
  const prefix = category.slice(0, 2).toLowerCase();
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 4);
  return `${prefix}-${timestamp}-${random}`;
};

// Increment usage count for a value
export const incrementUsage = (values, category, id) => {
  const newValues = { ...values };
  const index = newValues[category].findIndex(item => item.id === id);
  if (index !== -1) {
    newValues[category][index] = {
      ...newValues[category][index],
      usage_count: newValues[category][index].usage_count + 1
    };
  }
  return newValues;
};
