import React from 'react';
import AppRoutes from './routes/AppRoutes';
import CustomCursor from './components/common/CustomCursor';

export const App = () => {
  return (
    <>
      {/* Premium custom mouse trailing cursor overlay */}
      <CustomCursor />
      
      {/* Core application routes */}
      <AppRoutes />
    </>
  );
};

export default App;
