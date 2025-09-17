import React from 'react';
import Header from './Header';

const Layout = ({ children, user, onSignOut }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onSignOut={onSignOut} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;