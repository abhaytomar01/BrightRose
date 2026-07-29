import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { trackEvent, initPixel } from './pixelUtils';

/**
 * FacebookPixel Component
 * 
 * This component tracks PageView events on every route change.
 * It also handles Advanced Matching when a user is logged in.
 */
const FacebookPixel = () => {
  const { pathname } = useLocation();
  const { authUser } = useAuth();
  console.log(pathname);


  // Handle PageView on route change
  useEffect(() => {
    trackEvent('PageView');
  }, [pathname]);

  // Handle Advanced Matching when user data is available
  useEffect(() => {
    if (authUser?.user?.email) {
      // Re-initialize with user data for Advanced Matching
      // The Meta Pixel script handles hashing if the data is passed correctly
      initPixel({
        em: authUser.user.email?.toLowerCase().trim(),
        ph: authUser.user.phone?.replace(/\D/g, '')
      });
    }
  }, [authUser]);

  return null;
};

export default FacebookPixel;
