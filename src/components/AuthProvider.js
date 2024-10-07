import React, { createContext, useContext } from 'react';
import { ClerkProvider, useUser } from '@clerk/clerk-react';

// Creating a context for authentication
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Using the useUser hook from Clerk to get the signed in status and user data
  const { isSignedIn, user } = useUser();

  const signOut = () => {
    window.Clerk.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isSignedIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
// Defining a custom hook that provides the authentication context
export const useAuth = () => useContext(AuthContext);
const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY
export const AuthWrapper = ({ children }) => (
  // Defining a wrapper component that provides the Clerk and Auth contexts to child components
  <ClerkProvider publishableKey = {REACT_APP_CLERK_PUBLISHABLE_KEY} >
    <AuthProvider>{children}</AuthProvider>
  </ClerkProvider>
);