import React from 'react';
import { useAuth, RedirectToSignIn } from '@clerk/clerk-react';

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return children;
};

export default ProtectedRoute;