import React from 'react';

import FollowBar from "@/components/layout/FollowBar"
import Sidebar from "@/components/layout/Sidebar"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-screen bg-black">
      <div className="container h-full mx-auto xl:px-20 max-w-7xl">
        <div className="grid grid-cols-5 h-full">
          <Sidebar />
          <div 
            className="
              col-span-4 
              lg:col-span-3 
              border-x-[1px] 
              border-neutral-800
          ">
            {children}
          </div>
          <FollowBar />
        </div>
     </div>
    </div>
  )
}

export default Layout;
