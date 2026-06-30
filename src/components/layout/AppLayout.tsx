import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import CommandSearch from './CommandSearch';

export default function AppLayout() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-[68px] lg:pl-[240px] transition-all duration-300">
        <Header onSearchOpen={() => setSearchOpen(true)} />
        <main className="p-6 page-enter">
          <Outlet />
        </main>
      </div>
      <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
