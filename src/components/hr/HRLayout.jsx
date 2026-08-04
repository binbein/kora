import React from 'react';
import { Outlet } from 'react-router-dom';
import HRNav from './HRNav';

export default function HRLayout() {
  return (
    <div className="min-h-screen bg-background">
      <HRNav />
      <main className="lg:ml-64 pt-14 lg:pt-0">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}