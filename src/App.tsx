import React, { useEffect } from 'react';
import AppRoutes from './router';
import { autoCompleteService } from './services/order.service';

const App: React.FC = () => {
  useEffect(() => {
    // Khởi động auto complete service
    autoCompleteService.start();
    
    // Cleanup khi component unmount
    return () => {
      autoCompleteService.stop();
    };
  }, []);
  
  return <AppRoutes />;
};

export default App;
