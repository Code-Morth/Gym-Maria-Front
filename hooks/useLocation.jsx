// useLocation
import { usePathname } from 'next/navigation';
import React from 'react';

function useLocation() {
  const pathname = usePathname();
  const workerView = pathname === '/WorkerView';
  
  return [workerView];
 
}

export default useLocation;


