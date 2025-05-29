
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        navigate('/login');
      }, 300);
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50 animate-fade-out">
        <div className="text-center animate-scale-out">
          <div className="w-48 h-48 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center animate-bounce">
            <Bell className="w-24 h-24 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Remindly</h1>
          <p className="text-primary-300 font-medium text-lg">BY MSR</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center animate-fade-in">
        <div className="w-48 h-48 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center animate-bounce">
          <Bell className="w-24 h-24 text-white" />
        </div>
        <h1 className="text-4xl font-display font-bold text-white mb-2">Remindly</h1>
        <p className="text-primary-300 font-medium text-lg">BY MSR</p>
        <div className="mt-8">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
