'use client';

interface UserStatusProps {
  username: string;
  onLogout: () => void;
  isAuthError?: boolean;
  error?: string | null;
}

const UserStatus = ({ username, onLogout, isAuthError = false, error = null }: UserStatusProps) => {
  const isError = isAuthError || error !== null;
  
  return (
    <div className="mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className={`px-6 py-4 ${isError 
        ? 'bg-gradient-to-r from-red-600 to-red-700' 
        : 'bg-gradient-to-r from-green-600 to-emerald-600'
      }`}>
        <h3 className="text-xl font-bold text-white flex items-center">
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isError ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
          {isError ? 'Authentication Error' : 'Logged In'}
        </h3>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between">
          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isError 
              ? 'bg-gradient-to-r from-red-500 to-red-600' 
              : 'bg-gradient-to-r from-green-500 to-emerald-500'
            }`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isError ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                )}
              </svg>
            </div>
            <div>
              <h4 className={`text-lg font-semibold ${isError 
                ? 'text-red-900 dark:text-red-100' 
                : 'text-gray-900 dark:text-gray-100'
              }`}>
                {isError ? 'Authentication Failed' : 'Welcome back!'}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Logged in as <span className={`font-medium ${isError 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-green-600 dark:text-green-400'
                }`}>{username}</span>
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="inline-flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 rounded-lg transition-colors duration-200 border border-red-200 dark:border-red-700 font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        {/* Connection Status */}
        <div className={`mt-4 p-3 border rounded-lg ${isError 
          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700' 
          : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
        }`}>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-3 ${isError 
              ? 'bg-red-500 dark:bg-red-400' 
              : 'bg-green-500 dark:bg-green-400 animate-pulse'
            }`}></div>
            <p className={`text-sm font-medium ${isError 
              ? 'text-red-700 dark:text-red-300' 
              : 'text-green-700 dark:text-green-300'
            }`}>
              {isError 
                ? (isAuthError ? 'Invalid credentials' : error || 'Connection error')
                : 'Connected to WordPress'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatus;
