'use client';

import { useState } from 'react';
import CredentialsInput from './CredentialsInput';
import EventSelector from './EventSelector';
import EventDetails from './EventDetails';
import UserStatus from './UserStatus';
import { useCredentials } from '../hooks/useCredentials';
import { useEvents } from '../hooks/useEvents';
import { copyEventService } from '../services/eventCopyService';
import { Event, EventCopyData } from '../types/event.types';
import NewEventForm from './NewEventForm';

const EventDropdown = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [showDateTimeSelector, setShowDateTimeSelector] = useState(false);
  const [newStartDate, setNewStartDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  // Use custom hooks
  const { username, password, setUsername, setPassword } = useCredentials();
  const { events, loading, error } = useEvents(username, password);

  // Check if user is logged in
  const isLoggedIn = Boolean(username && password);

  const handleLogout = () => {
    setUsername('');
    setPassword('');
    setSelectedEvent('');
    setShowDateTimeSelector(false);
    setCopyError(null);
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

  if (error) {
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
        />
      ) : (
        <UserStatus
          username={username}
          onLogout={handleLogout}
        />
      )}
      
      <EventSelector
        events={events}
        selectedEvent={selectedEvent}
        onEventChange={setSelectedEvent}
        disabled={!username || !password}
      />

      {selectedEventDetails && (
        <EventDetails
          event={selectedEventDetails}
          onCopy={handleCopyEvent}
        />
      )}

      {copyError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{copyError}</p>
        </div>
      )}

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
          onDateChange={handleDateChange} // Pass the new date change handler
          isPublic={isPublic} // Pass the isPublic state
          onPublicChange={setIsPublic} // Pass the setter for isPublic
        />
      )}
    </div>
  );
};

export default EventDropdown;
