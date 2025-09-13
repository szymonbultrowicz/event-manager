'use client';

import { useState } from 'react';
import CredentialsInput from './CredentialsInput';
import EventSelector from './EventSelector';
import NewEventForm from '@/src/components/NewEventForm';
import EventDetails from './EventDetails';
import { useCredentials } from '../hooks/useCredentials';
import { useEvents } from '../hooks/useEvents';
import { copyEventService } from '../services/eventCopyService';
import { Event, EventCopyData } from '../types/event.types';

const EventDropdown = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const [newStartDate, setNewStartDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  // Use custom hooks
  const { username, password, setUsername, setPassword } = useCredentials();
  const { events, loading, error } = useEvents(username, password);

  const handleCopyEvent = () => {
    setShowNewEventForm(true);
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
    setShowNewEventForm(false);
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
      setShowNewEventForm(false);
    }
  };

  const selectedEventDetails = events.find(event => event.id.toString() === selectedEvent);

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Error
            </h3>
          </div>
          <div className="p-6">
            <p className="text-gray-700 dark:text-gray-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Main Header */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v5a2 2 0 002 2h4a2 2 0 002-2v-5m-6 0h8m-8 0V7a2 2 0 012-2h4a2 2 0 012 2v4m-8 0h8" />
            </svg>
            SKOS Events Manager
          </h2>
          <p className="text-emerald-100 mt-1">Manage recurring events and templates</p>
        </div>
      </div>
      
      {/* Credentials Section */}
      <CredentialsInput
        username={username}
        password={password}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
      />
      
      {/* Event Selector */}
      {(username && password) && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Select Event Template
            </h3>
          </div>
          <div className="p-6">
            <EventSelector
              events={events}
              selectedEvent={selectedEvent}
              onEventChange={setSelectedEvent}
              disabled={!username || !password}
            />
          </div>
        </div>
      )}

      {selectedEventDetails && (
        <EventDetails
          event={selectedEventDetails}
          onCopy={handleCopyEvent}
        />
      )}

      {copyError && (
        <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Copy Error
            </h3>
          </div>
          <div className="p-6">
            <p className="text-gray-700 dark:text-gray-300">{copyError}</p>
          </div>
        </div>
      )}

      {showNewEventForm && selectedEventDetails && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v5a2 2 0 002 2h4a2 2 0 002-2v-5m-6 0h8m-8 0V7a2 2 0 012-2h4a2 2 0 012 2v4m-8 0h8" />
              </svg>
              Configure New Event
            </h3>
          </div>
          <div className="p-6">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDropdown;
