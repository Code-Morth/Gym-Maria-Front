
import { usePathname } from 'next/navigation';
import React from 'react';

function useLocationH() {
  const pathname = usePathname();
  const home = pathname === '/';
  
  return [home];
 
}

export default useLocationH;