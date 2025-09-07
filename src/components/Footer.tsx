import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-neutral-800 to-neutral-900 text-white py-8 text-center">
      <div className="container mx-auto px-4 sm:px-6">
        <p className="text-neutral-300">&copy; {new Date().getFullYear()} KongMindset. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;