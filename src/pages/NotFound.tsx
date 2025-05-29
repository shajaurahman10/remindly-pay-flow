
import React, { useEffect } from 'react';
import { useLocation, Link } from "react-router-dom";
import { Home, ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <Logo size="lg" linkTo="/dashboard" className="justify-center mb-8" />
        <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
