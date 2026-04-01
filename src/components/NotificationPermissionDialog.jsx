import React, { useState, useEffect } from 'react';
import './NotificationPermissionDialog.css';

const STORAGE_KEY = 'notification-permission-state';

export function getNotificationState() {
  if (typeof window === 'undefined') return { hasAsked: false, permission: 'default' };
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return { hasAsked: false, permission: Notification.permission || 'default' };
}

export function saveNotificationState(state) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function requestNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return Promise.resolve('denied');
  }
  return Notification.requestPermission();
}

export function scheduleNotification(title, body, timestamp) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  
  const now = Date.now();
  const delay = timestamp - now;
  
  if (delay <= 0) {
    // If the time has passed, show immediately
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    }
    return;
  }
  
  // Use setTimeout for the notification
  setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }, delay);
}

export function scheduleEventReminder(eventTitle, eventTime) {
  const reminderTime = new Date(eventTime).getTime() - 15 * 60 * 1000; // 15 minutes before
  const body = `${eventTitle} - ${new Date(eventTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  scheduleNotification('Etkinlik Hatırlatması', body, reminderTime);
}

function NotificationPermissionDialog({ isOpen, onClose, onAllow, onDeny }) {
  if (!isOpen) return null;

  return (
    <div className="notification-dialog-overlay" data-testid="notification-dialog-overlay">
      <div className="notification-dialog" data-testid="notification-dialog">
        <h3 className="notification-dialog-title">Bildirim İzni</h3>
        <p className="notification-dialog-text" data-testid="notification-dialog-text">
          Bildirimlere izin vermek istiyor musunuz? Etkinlikleriniz başlamadan 15 dakika önce hatırlatılacaktır.
        </p>
        <div className="notification-dialog-buttons">
          <button 
            className="notification-dialog-button notification-dialog-button-allow"
            onClick={onAllow}
            data-testid="notification-allow-button"
          >
            Evet, izin ver
          </button>
          <button 
            className="notification-dialog-button notification-dialog-button-deny"
            onClick={onDeny}
            data-testid="notification-deny-button"
          >
            Hayır, teşekkürler
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationPermissionDialog;
