'use client';

import { useState, useEffect } from 'react';
import CredentialsInput from './CredentialsInput';
import EventDropdown from './EventDropdown';
import UserStatus from './UserStatus';
import NewEventForm from './NewEventForm';
import { useCredentials } from '../hooks/useCredentials';
import { useEvents } from '../hooks/useEvents';
import { copyEventService } from '../services/eventCopyService';
import { Event, EventCopyData } from '../types/event.types';

const MainPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [showDateTimeSelector, setShowDateTimeSelector] = useState(false);
  const [newStartDate, setNewStartDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);

  // Use custom hooks
  const { username, password, setUsername, setPassword, credentialsLoadedFromStorage, resetStorageFlag } = useCredentials();
  const { events, loading, error, isAuthError, triggerAuth } = useEvents(username, password);

  // Check if user is logged in (has attempted login and has credentials)
  const isLoggedIn = Boolean(hasAttemptedLogin && username && password);

  // Auto-login when credentials are loaded from localStorage
  useEffect(() => {
    if (credentialsLoadedFromStorage && username && password && !hasAttemptedLogin) {
      setHasAttemptedLogin(true);
      triggerAuth();
      resetStorageFlag(); // Reset the flag to prevent re-triggering
    }
  }, [credentialsLoadedFromStorage, username, password, hasAttemptedLogin, triggerAuth, resetStorageFlag]);

  const handleLogout = () => {
    setUsername('');
    setPassword('');
    setSelectedEvent('');
    setShowDateTimeSelector(false);
    setCopyError(null);
    setHasAttemptedLogin(false);
    resetStorageFlag();
    // Clear credentials from localStorage
    localStorage.removeItem('skos-username');
    localStorage.removeItem('skos-password');
  };

  const handleLogin = () => {
    setHasAttemptedLogin(true);
    triggerAuth();
  };

  const handleCopyEvent = () => {
    setShowDateTimeSelector(true);
    // Pre-populate with current event dates
    if (selectedEventDetails) {
      const startDate = new Date(selectedEventDetails.start_date);
      const endDate = new Date(selectedEventDetails.end_date);
      setNewStartDate(startDate.toISOString().split('T')[0]);
      setNewStartTime(startDate.toTimeString().split(' ')[0].slice(0, 5));
      setNewEndTime(endDate.toTimeString().split(' ')[0].slice(0, 5));
    }
  };

  const handleDateChange = (date: string) => {
    setNewStartDate(date);
    setNewEndDate(date);
  };

  const handleCancelCopy = () => {
    setShowDateTimeSelector(false);
    setNewStartDate('');
    setNewStartTime('');
    setNewEndDate('');
    setNewEndTime('');
  };

  const handleConfirmCopy = async () => {
    if (!selectedEventDetails) return;

    const copyData: EventCopyData = {
      newStartDate,
      newStartTime,
      newEndDate,
      newEndTime,
      isPublic,
    };

    try {
      const createdEvent = await copyEventService(
        selectedEventDetails,
        copyData,
        username,
        password
      );
      alert(`Event successfully copied!\nTitle: ${createdEvent.title}\nStart: ${createdEvent.start_date}\nEnd: ${createdEvent.end_date}`);
    } catch (err) {
      setCopyError(err instanceof Error ? err.message : 'An error occurred while copying the event');
      console.error('Error copying event:', err);
    } finally {
      setShowDateTimeSelector(false);
    }
  };

  const selectedEventDetails = events.find(event => event.id.toString() === selectedEvent);

  if (loading) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="animate-pulse">
          <div className="h-4 rounded w-1/4 mb-4"></div>
          <div className="h-10 rounded mb-4"></div>
          <div className="h-4 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error && !isAuthError) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium">Error</h3>
            <div className="mt-2 text-sm">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">
        SKOS Events (Recurring & Template)
      </h2>
      
      {/* Credentials Section */}
      {!isLoggedIn ? (
        <CredentialsInput
          username={username}
          password={password}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onLogin={handleLogin}
          isLoading={loading}
        />
      ) : (
        <UserStatus
          username={username}
          onLogout={handleLogout}
          isAuthError={isAuthError}
          error={error}
        />
      )}
      
      {/* Event Dropdown Section - Only show when logged in and authentication successful */}
      {isLoggedIn && !isAuthError && (
        <EventDropdown
          events={events}
          selectedEvent={selectedEvent}
          onEventChange={setSelectedEvent}
          onCopyEvent={handleCopyEvent}
          disabled={false}
        />
      )}

      {/* Copy Error Display */}
      {copyError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{copyError}</p>
        </div>
      )}

      {/* New Event Form */}
      {showDateTimeSelector && selectedEventDetails && (
        <NewEventForm
          startDate={newStartDate}
          startTime={newStartTime}
          endTime={newEndTime}
          onStartDateChange={setNewStartDate}
          onStartTimeChange={setNewStartTime}
          onEndTimeChange={setNewEndTime}
          onConfirm={handleConfirmCopy}
          onCancel={handleCancelCopy}
          onDateChange={handleDateChange}
          isPublic={isPublic}
          onPublicChange={setIsPublic}
        />
      )}
    </div>
  );
};

export default MainPage;
