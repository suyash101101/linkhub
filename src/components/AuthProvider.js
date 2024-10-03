// src/auth/AuthProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClerkProvider, useUser, SignIn, SignOut } from '@clerk/clerk-react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
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

export const useAuth = () => useContext(AuthContext);

export const AuthWrapper = ({ children }) => (
  <ClerkProvider publishableKey="pk_test_Y2FzdWFsLW1vbGx5LTExLmNsZXJrLmFjY291bnRzLmRldiQ">
    <AuthProvider>{children}</AuthProvider>
  </ClerkProvider>
);
