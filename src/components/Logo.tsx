
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  linkTo?: string;
  className?: string;
}

const Logo = ({ size = 'md', linkTo = '/dashboard', className = '' }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const LogoContent = () => (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center`}>
        <Bell className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-7 h-7'} text-white`} />
      </div>
      <div>
        <h1 className={`${textSizeClasses[size]} font-display font-bold text-white`}>Remindly</h1>
        <p className="text-primary-300 font-medium text-xs">BY MSR</p>
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="hover:opacity-80 transition-opacity">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
};

export default Logo;
