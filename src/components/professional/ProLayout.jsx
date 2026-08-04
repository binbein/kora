import React from 'react';
import { Outlet } from 'react-router-dom';
import ProNav from './ProNav';

export default function ProLayout() {
  return (
    <div className="min-h-screen bg-background">
      <ProNav />
      <main className="lg:ml-64 pt-14 lg:pt-0">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}