import React, { useState, useEffect } from 'react';
import HabitList from './components/HabitList';
import Heatmap from './components/Heatmap';
import StreakCounter from './components/StreakCounter';
import AddHabit from './components/AddHabit';
import LookupAdmin from './components/LookupAdmin.jsx';
import NotificationPermissionDialog, { 
  getNotificationState, 
  saveNotificationState, 
  requestNotificationPermission,
  scheduleEventReminder 
} from './components/NotificationPermissionDialog.jsx';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('habits');
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [notificationState, setNotificationState] = useState({ hasAsked: false, permission: 'default' });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });

  const [completions, setCompletions] = useState(() => {
    const saved = localStorage.getItem('completions');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    // Load notification state on mount
    const state = getNotificationState();
    setNotificationState(state);
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('completions', JSON.stringify(completions));
  }, [completions]);

  const addHabit = (name) => {
    const newHabit = {
      id: Date.now().toString(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
    setHabits([...habits, newHabit]);
    
    // Show notification permission dialog after first habit creation
    const state = getNotificationState();
    if (!state.hasAsked) {
      setShowNotificationDialog(true);
    }
  };

  const handleAllowNotifications = async () => {
    const permission = await requestNotificationPermission();
    const newState = { hasAsked: true, permission };
    saveNotificationState(newState);
    setNotificationState(newState);
    setShowNotificationDialog(false);
    
    // Schedule a test notification for demonstration (5 seconds from now)
    if (permission === 'granted') {
      const testTime = new Date(Date.now() + 5000);
      scheduleEventReminder('Test Etkinlik', testTime.toISOString());
    }
  };

  const handleDenyNotifications = () => {
    const newState = { hasAsked: true, permission: 'denied' };
    saveNotificationState(newState);
    setNotificationState(newState);
    setShowNotificationDialog(false);
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
    const newCompletions = { ...completions };
    delete newCompletions[id];
    setCompletions(newCompletions);
  };

  const toggleHabit = (id) => {
    const today = new Date().toISOString().split('T')[0];
    const habitCompletions = completions[id] || {};
    
    setCompletions({
      ...completions,
      [id]: {
        ...habitCompletions,
        [today]: !habitCompletions[today]
      }
    });
  };

  const isHabitCompletedToday = (id) => {
    const today = new Date().toISOString().split('T')[0];
    return completions[id]?.[today] || false;
  };

  const getAllCompletions = () => {
    const allDates = new Set();
    Object.values(completions).forEach(habitCompletions => {
      Object.entries(habitCompletions).forEach(([date, completed]) => {
        if (completed) allDates.add(date);
      });
    });
    return Array.from(allDates).sort();
  };

  const calculateStreaks = () => {
    const dates = getAllCompletions();
    if (dates.length === 0) return { current: 0, longest: 0 };

    const sortedDates = dates.map(d => new Date(d)).sort((a, b) => a - b);
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastCompleted = sortedDates[sortedDates.length - 1];
    
    // Calculate current streak
    if (lastCompleted.getTime() === today.getTime() || lastCompleted.getTime() === yesterday.getTime()) {
      currentStreak = 1;
      for (let i = sortedDates.length - 2; i >= 0; i--) {
        const diff = (sortedDates[i + 1] - sortedDates[i]) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
    // Calculate longest streak
    tempStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const diff = (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak, 1);
    
    return { current: currentStreak, longest: longestStreak };
  };

  const getHeatmapData = () => {
    const data = {};
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      let count = 0;
      Object.values(completions).forEach(habitCompletions => {
        if (habitCompletions[dateStr]) count++;
      });
      
      data[dateStr] = count;
    }
    
    return data;
  };

  const streaks = calculateStreaks();
  const heatmapData = getHeatmapData();

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔥 Habit Tracker</h1>
        <p>Build better habits, one day at a time</p>
        
        <nav className="app-nav">
          <button 
            className={`nav-tab ${activeTab === 'habits' ? 'active' : ''}`}
            onClick={() => setActiveTab('habits')}
          >
            Habits
          </button>
          <button 
            className={`nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            Lookup Admin
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'habits' ? (
          <>
            <StreakCounter current={streaks.current} longest={streaks.longest} />
            
            <Heatmap data={heatmapData} />
            
            <AddHabit onAdd={addHabit} />
            
            <HabitList
              habits={habits}
              onDelete={deleteHabit}
              onToggle={toggleHabit}
              isCompleted={isHabitCompletedToday}
            />
          </>
        ) : (
          <LookupAdmin />
        )}
      </main>
      
      <NotificationPermissionDialog
        isOpen={showNotificationDialog}
        onClose={handleDenyNotifications}
        onAllow={handleAllowNotifications}
        onDeny={handleDenyNotifications}
      />
    </div>
  );
}

export default App;
