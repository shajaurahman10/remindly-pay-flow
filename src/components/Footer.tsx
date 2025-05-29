
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-4 px-6 mt-auto">
      <div className="max-w-7xl mx-auto text-center text-sm text-gray-400">
        <p>
          © 2025 Remindly | BY MSR · v1.0 · Need help?{' '}
          <a 
            href="mailto:support@remindly.app" 
            className="text-primary-400 hover:text-primary-300 transition-colors"
          >
            support@remindly.app
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
