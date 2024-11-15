import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useCanGoBack = () => {
  const [canGoBack, setCanGoBack] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if there is more than one entry in the history stack
    setCanGoBack(window.history.length > 1);
  }, [location]);

  return canGoBack;
};

export default useCanGoBack;