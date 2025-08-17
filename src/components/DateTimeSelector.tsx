interface DateTimeSelectorProps {
  startDate: string;
  startTime: string;
  endTime: string;
  onStartDateChange: (date: string) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  onDateChange: (date: string) => void;
  isPublic: boolean; // Added prop for public status
  onPublicChange: (isPublic: boolean) => void; // Added prop for public status change
}

const DateTimeSelector = ({
  startDate,
  startTime,
  endTime,
  onStartDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onConfirm,
  onCancel,
  onDateChange,
  isPublic,
  onPublicChange,
}: DateTimeSelectorProps) => {
  return (
    <div className="mt-6 p-4 border border-blue-200 rounded-md">
      <h3 className="font-semibold mb-4">Set New Event Dates</h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={startDate}
            onChange={(e) => onDateChange ? onDateChange(e.target.value) : onStartDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="start-time" className="block text-sm font-medium mb-1">
              Start Time
            </label>
            <input
              type="time"
              id="start-time"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="end-time" className="block text-sm font-medium mb-1">
              End Time
            </label>
            <input
              type="time"
              id="end-time"
              value={endTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => onPublicChange(e.target.checked)}
            className="mr-2"
          />
          Make public
        </label>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          Confirm Copy
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DateTimeSelector;
