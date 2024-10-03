import React from 'react';
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';

const SignInComponent = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <ClerkSignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
};

export default SignInComponent;