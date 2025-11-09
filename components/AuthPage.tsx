import React, { useState } from 'react';
import { GoogleIcon, EmailIcon, LockIcon, UserIcon, SparklesIcon } from './icons/Icons';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [authMode, setAuthMode] = useState<'signIn' | 'signUp'>('signUp');
  const [forgotPasswordView, setForgotPasswordView] = useState(false);
  
  // A real app would handle form state and logic with a library like Formik or React Hook Form
  // For this example, we'll keep it simple.
  
  // --- Placeholder Logic ---
  // In a real application, these functions would interact with an authentication service like Firebase.
  const handleAuthAction = () => {
    // Simulate API call
    console.log(`Simulating ${authMode} success...`);
    // On successful authentication, call the prop to change app state
    onAuthSuccess();
  };

  const handleGoogleSignIn = () => {
    console.log("Simulating Google Sign-In...");
    // Call Google Auth API
    onAuthSuccess();
  }

  const handlePasswordReset = () => {
    alert("If this were a real app, a password reset link would be sent to your email!");
    setForgotPasswordView(false);
  }

  const AuthForm = () => {
    return (
      <>
        <div className="flex border-b border-gray-200">
          <TabButton name="Sign Up" mode="signUp" />
          <TabButton name="Sign In" mode="signIn" />
        </div>

        <div className="pt-6">
          {authMode === 'signUp' ? <SignUpForm /> : <SignInForm />}
        </div>
      </>
    );
  };

  const TabButton: React.FC<{name: string, mode: 'signIn' | 'signUp'}> = ({ name, mode }) => {
    const isActive = authMode === mode;
    return (
      <button
        onClick={() => setAuthMode(mode)}
        className={`w-1/2 py-3 text-sm font-bold focus:outline-none transition-colors duration-300 ${
          isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {name}
      </button>
    );
  };
  
  const InputField: React.FC<{ id: string, type: string, placeholder: string, icon: React.ReactNode }> = ({ id, type, placeholder, icon }) => (
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
        {icon}
      </span>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow shadow-sm"
        required
      />
    </div>
  );

  const SignUpForm = () => (
    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleAuthAction(); }}>
      <InputField id="fullName" type="text" placeholder="Full Name" icon={<UserIcon className="h-5 w-5 text-gray-400" />} />
      <InputField id="emailUp" type="email" placeholder="Email Address" icon={<EmailIcon className="h-5 w-5 text-gray-400" />} />
      <InputField id="passwordUp" type="password" placeholder="Password" icon={<LockIcon className="h-5 w-5 text-gray-400" />} />
      <InputField id="confirmPassword" type="password" placeholder="Confirm Password" icon={<LockIcon className="h-5 w-5 text-gray-400" />} />
      <button type="submit" className="w-full text-white font-bold py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 transition-all duration-300 shadow-lg transform hover:scale-105">
        Create Account
      </button>
      <SocialLogin />
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button type="button" onClick={() => setAuthMode('signIn')} className="font-bold text-indigo-600 hover:underline">
          Sign In
        </button>
      </p>
    </form>
  );

  const SignInForm = () => (
    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleAuthAction(); }}>
      <InputField id="emailIn" type="email" placeholder="Email Address" icon={<EmailIcon className="h-5 w-5 text-gray-400" />} />
      <InputField id="passwordIn" type="password" placeholder="Password" icon={<LockIcon className="h-5 w-5 text-gray-400" />} />
      <div className="text-right">
        <button type="button" onClick={() => setForgotPasswordView(true)} className="text-sm font-medium text-indigo-600 hover:underline">
          Forgot Password?
        </button>
      </div>
      <button type="submit" className="w-full text-white font-bold py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 transition-all duration-300 shadow-lg transform hover:scale-105">
        Sign In
      </button>
      <SocialLogin />
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button type="button" onClick={() => setAuthMode('signUp')} className="font-bold text-indigo-600 hover:underline">
          Sign Up
        </button>
      </p>
    </form>
  );

  const SocialLogin = () => (
    <>
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <button type="button" onClick={handleGoogleSignIn} className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors shadow-sm">
        <GoogleIcon className="h-5 w-5 mr-3" />
        Continue with Google
      </button>
    </>
  );

  const ForgotPassword = () => (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Reset Password</h2>
      <p className="text-center text-gray-600 mb-6">Enter your email to receive a password reset link.</p>
      <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handlePasswordReset(); }}>
        <InputField id="resetEmail" type="email" placeholder="Email Address" icon={<EmailIcon className="h-5 w-5 text-gray-400" />} />
        <button type="submit" className="w-full text-white font-bold py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 transition-all duration-300 shadow-lg transform hover:scale-105">
          Send Reset Link
        </button>
        <p className="text-center text-sm">
          <button type="button" onClick={() => setForgotPasswordView(false)} className="font-bold text-indigo-600 hover:underline">
            Back to Sign In
          </button>
        </p>
      </form>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-sans antialiased">
      <div className="max-w-md w-full space-y-6">
        <div className="flex justify-center items-center space-x-3">
            <SparklesIcon className="h-10 w-10 text-indigo-600"/>
            <span className="text-3xl font-bold text-gray-800">ProWrite AI</span>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
          {forgotPasswordView ? <ForgotPassword /> : <AuthForm />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;