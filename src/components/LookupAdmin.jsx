import React, { useState, useEffect, useCallback } from 'react';
import {
  getLookupValues,
  saveLookupValues,
  LOOKUP_CATEGORIES,
  CATEGORY_LABELS,
  generateId,
  getActiveLookupValues
} from '../data/lookupValues.js';
import './LookupAdmin.css';

function LookupAdmin() {
  const [lookupValues, setLookupValues] = useState({});
  const [activeValues, setActiveValues] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(LOOKUP_CATEGORIES[0]);
  const [editingItem, setEditingItem] = useState(null);
  const [newValue, setNewValue] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  const [showWarning, setShowWarning] = useState(null);
  const [showInactive, setShowInactive] = useState(false);

  // Load data on mount
  useEffect(() => {
    const values = getLookupValues();
    setLookupValues(values);
    setActiveValues(getActiveLookupValues(values));
  }, []);

  // Persist changes
  const persistChanges = useCallback((newValues) => {
    saveLookupValues(newValues);
    setLookupValues(newValues);
    setActiveValues(getActiveLookupValues(newValues));
  }, []);

  // Get current category items (sorted by sort_order)
  const getCategoryItems = () => {
    const items = lookupValues[selectedCategory] || [];
    return [...items].sort((a, b) => a.sort_order - b.sort_order);
  };

  // Add new value
  const handleAdd = () => {
    if (!newValue.trim()) return;

    const items = getCategoryItems();
    const maxSortOrder = items.length > 0 
      ? Math.max(...items.map(i => i.sort_order)) 
      : 0;

    const newItem = {
      id: generateId(selectedCategory),
      value: newValue.trim(),
      sort_order: maxSortOrder + 1,
      is_active: true,
      usage_count: 0
    };

    const newValues = {
      ...lookupValues,
      [selectedCategory]: [...(lookupValues[selectedCategory] || []), newItem]
    };

    persistChanges(newValues);
    setNewValue('');
  };

  // Edit value
  const handleEdit = (item) => {
    // Check if item has high usage count (>10)
    if (item.usage_count > 10) {
      setShowWarning({
        item,
        action: 'edit',
        message: `This value is used ${item.usage_count} times. Editing it will affect all existing records. Continue?`
      });
      return;
    }
    setEditingItem({ ...item });
  };

  // Confirm edit after warning
  const confirmEdit = () => {
    if (showWarning) {
      setEditingItem({ ...showWarning.item });
      setShowWarning(null);
    }
  };

  // Save edited value
  const handleSaveEdit = () => {
    if (!editingItem || !editingItem.value.trim()) return;

    const newValues = { ...lookupValues };
    const items = newValues[selectedCategory];
    const index = items.findIndex(i => i.id === editingItem.id);
    
    if (index !== -1) {
      items[index] = {
        ...items[index],
        value: editingItem.value.trim()
      };
      persistChanges(newValues);
    }
    
    setEditingItem(null);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingItem(null);
    setShowWarning(null);
  };

  // Toggle active status (soft delete)
  const handleToggleActive = (item) => {
    // Check if trying to deactivate a used value
    if (item.is_active && item.usage_count > 0) {
      setShowWarning({
        item,
        action: 'deactivate',
        message: `This value is used ${item.usage_count} times. Deactivating will hide it from new records but keep existing ones. Continue?`
      });
      return;
    }
    performToggleActive(item);
  };

  const performToggleActive = (item) => {
    const newValues = { ...lookupValues };
    const items = newValues[selectedCategory];
    const index = items.findIndex(i => i.id === item.id);
    
    if (index !== -1) {
      items[index] = {
        ...items[index],
        is_active: !items[index].is_active
      };
      persistChanges(newValues);
    }
    setShowWarning(null);
  };

  // Drag and drop handlers
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const items = getCategoryItems();
    const draggedIndex = items.findIndex(i => i.id === draggedItem.id);
    const targetIndex = items.findIndex(i => i.id === targetItem.id);

    // Reorder items
    const newItems = [...items];
    newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    // Update sort_order
    const reorderedItems = newItems.map((item, index) => ({
      ...item,
      sort_order: index + 1
    }));

    const newValues = {
      ...lookupValues,
      [selectedCategory]: reorderedItems
    };

    persistChanges(newValues);
    setDraggedItem(null);
  };

  // Filtered items based on showInactive
  const getFilteredItems = () => {
    const items = getCategoryItems();
    if (showInactive) {
      return items;
    }
    return items.filter(item => item.is_active);
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="lookup-admin">
      <div className="lookup-admin__header">
        <h2>Lookup Values Management</h2>
        <p>Manage dynamic lookup values for dropdowns across the application</p>
      </div>

      <div className="lookup-admin__content">
        {/* Category Sidebar */}
        <div className="lookup-admin__sidebar">
          <h3>Categories</h3>
          <ul className="lookup-admin__category-list">
            {LOOKUP_CATEGORIES.map(category => (
              <li
                key={category}
                className={`lookup-admin__category-item ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                <span className="category-label">{CATEGORY_LABELS[category]}</span>
                <span className="category-count">
                  {(lookupValues[category] || []).filter(i => i.is_active).length}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="lookup-admin__main">
          <div className="lookup-admin__section-header">
            <h3>{CATEGORY_LABELS[selectedCategory]}</h3>
            <label className="lookup-admin__toggle">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
              />
              Show inactive
            </label>
          </div>

          {/* Add New Value */}
          <div className="lookup-admin__add-form">
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={`Add new ${CATEGORY_LABELS[selectedCategory].toLowerCase()}...`}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button onClick={handleAdd} className="btn btn-primary">
              Add
            </button>
          </div>

          {/* Values List */}
          <div className="lookup-admin__list">
            {filteredItems.length === 0 ? (
              <div className="lookup-admin__empty">
                No values found. Add one above.
              </div>
            ) : (
              filteredItems.map(item => (
                <div
                  key={item.id}
                  className={`lookup-admin__item ${!item.is_active ? 'inactive' : ''} ${item.usage_count > 10 ? 'high-usage' : ''}`}
                  draggable={editingItem?.id !== item.id}
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, item)}
                >
                  <div className="lookup-admin__item-drag">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <circle cx="4" cy="4" r="1.5"/>
                      <circle cx="4" cy="8" r="1.5"/>
                      <circle cx="4" cy="12" r="1.5"/>
                      <circle cx="12" cy="4" r="1.5"/>
                      <circle cx="12" cy="8" r="1.5"/>
                      <circle cx="12" cy="12" r="1.5"/>
                    </svg>
                  </div>

                  {editingItem?.id === item.id ? (
                    <div className="lookup-admin__item-edit">
                      <input
                        type="text"
                        value={editingItem.value}
                        onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        autoFocus
                      />
                      <button onClick={handleSaveEdit} className="btn btn-sm btn-success">
                        Save
                      </button>
                      <button onClick={handleCancelEdit} className="btn btn-sm btn-secondary">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="lookup-admin__item-value">
                        {item.value}
                        {item.usage_count > 10 && (
                          <span className="usage-badge warning" title="High usage">
                            ⚠️ {item.usage_count}
                          </span>
                        )}
                        {item.usage_count > 0 && item.usage_count <= 10 && (
                          <span className="usage-badge">
                            {item.usage_count}
                          </span>
                        )}
                      </div>

                      <div className="lookup-admin__item-actions">
                        <button
                          onClick={() => handleEdit(item)}
                          className="btn btn-sm btn-secondary"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleActive(item)}
                          className={`btn btn-sm ${item.is_active ? 'btn-danger' : 'btn-success'}`}
                          title={item.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {item.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Warning Modal */}
      {showWarning && (
        <div className="lookup-admin__modal-overlay" onClick={() => setShowWarning(null)}>
          <div className="lookup-admin__modal" onClick={(e) => e.stopPropagation()}>
            <h4>⚠️ Warning</h4>
            <p>{showWarning.message}</p>
            <div className="lookup-admin__modal-actions">
              <button
                onClick={() => {
                  if (showWarning.action === 'edit') {
                    confirmEdit();
                  } else if (showWarning.action === 'deactivate') {
                    performToggleActive(showWarning.item);
                  }
                }}
                className="btn btn-warning"
              >
                Continue
              </button>
              <button onClick={() => setShowWarning(null)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LookupAdmin;
