# Habit Tracker

A modern, clean habit tracking web application with GitHub-style heatmap visualization.

## Features

- **Daily Habit Tracking**: Add, complete, and delete habits
- **GitHub-Style Heatmap**: 365-day activity grid visualization
- **Streak Counter**: Track current streak and longest streak
- **Modern Dark Theme**: Clean, minimalist UI design
- **Local Storage**: Data persists across sessions

## Tech Stack

- React + Vite
- Express backend (optional, can run standalone with localStorage)
- Frontend port: 3508
- Backend port: 4508

## User Stories

### US-001: View Habit List
As a user, I want to see a list of my habits so that I can track what I need to do daily.

**Acceptance Criteria:**
- Display all habits in a clean list format
- Show habit name and completion status
- Empty state when no habits exist

### US-002: Add New Habit
As a user, I want to add new habits so that I can track new behaviors.

**Acceptance Criteria:**
- Input field to enter habit name
- Add button to create habit
- Validation to prevent empty habits
- New habit appears immediately in the list

### US-003: Mark Habit Complete
As a user, I want to mark habits as complete so that I can track my daily progress.

**Acceptance Criteria:**
- Checkbox or toggle to mark habit complete
- Visual feedback when completed
- Completion status persists
- Can toggle completion on/off

### US-004: Delete Habit
As a user, I want to delete habits so that I can remove habits I no longer track.

**Acceptance Criteria:**
- Delete button for each habit
- Confirmation before deletion
- Habit removed immediately from list
- Associated data cleaned up

### US-005: View GitHub-Style Heatmap
As a user, I want to see a 365-day activity heatmap so that I can visualize my consistency over time.

**Acceptance Criteria:**
- Grid showing 365 days of activity
- Color intensity based on completion count
- Scrollable or compact view
- Legend explaining color scale

### US-006: View Current Streak
As a user, I want to see my current streak so that I can stay motivated.

**Acceptance Criteria:**
- Display current consecutive days streak
- Updates automatically when habits are completed
- Shows streak count prominently

### US-007: View Longest Streak
As a user, I want to see my longest streak so that I can celebrate my achievements.

**Acceptance Criteria:**
- Display all-time longest streak
- Persists across sessions
- Updates when new record is set

### US-008: Dark Theme UI
As a user, I want a modern dark theme so that the app is easy on the eyes.

**Acceptance Criteria:**
- Dark color scheme throughout
- Clean, minimalist design
- Responsive layout
- Accessible contrast ratios
test
