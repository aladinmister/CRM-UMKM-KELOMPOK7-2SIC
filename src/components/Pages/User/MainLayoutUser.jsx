import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderUser from './HeaderUser';
import FooterUser from './FooterUser';
import SidebarUser from './SidebarUser';

const MainLayoutUser = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderUser />
      <div className="flex flex-1 container mx-auto px-4 mt-4">
     
        <main className="flex-1 ml-4">
          <Outlet /> {/* Ini akan menampilkan konten seperti DashboardUser dan ProductCard */}
        </main>
      </div>
      <FooterUser />
    </div>
  );
};

export default MainLayoutUser;
