import React, { useState } from 'react';
import ContentGenerator from './components/ContentGenerator';
import ChatBot from './components/ChatBot';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import { SparklesIcon, MessageIcon } from './components/icons/Icons';

type View = 'generator' | 'chat';
type AppState = 'landing' | 'auth' | 'app';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [activeView, setActiveView] = useState<View>('generator');

  if (appState === 'landing') {
    return <LandingPage onGetStarted={() => setAppState('auth')} />;
  }

  if (appState === 'auth') {
    return <AuthPage onAuthSuccess={() => setAppState('app')} />;
  }

  const Header = () => (
    <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <SparklesIcon className="h-10 w-10 text-indigo-500" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-800">ProWrite AI</h1>
              <p className="text-sm text-gray-500">Create quality content in seconds — free and smart.</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-2">
            <NavButton view="generator" />
            <NavButton view="chat" />
          </nav>
        </div>
      </div>
    </header>
  );

  const NavButton: React.FC<{ view: View }> = ({ view }) => {
    const isActive = activeView === view;
    return (
      <button
        onClick={() => setActiveView(view)}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          isActive
            ? 'bg-indigo-600 text-white shadow'
            : 'text-gray-600 hover:bg-indigo-100 hover:text-indigo-700'
        }`}
      >
        {view === 'generator' ? 'Content Generator' : 'Chat Bot'}
      </button>
    );
  };
  
  const MobileNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-[0_-2px_5px_rgba(0,0,0,0.1)] z-20">
      <div className="flex justify-around items-center h-16">
        <MobileNavButton view="generator" label="Generator" icon={<SparklesIcon className="h-6 w-6 mb-1"/>} />
        <MobileNavButton view="chat" label="Chat" icon={<MessageIcon className="h-6 w-6 mb-1"/>}/>
      </div>
    </div>
  );

  const MobileNavButton: React.FC<{ view: View; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => {
    const isActive = activeView === view;
    return (
      <button
        onClick={() => setActiveView(view)}
        className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${
          isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'
        }`}
      >
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </button>
    );
  };

  const Footer = () => (
    <footer className="py-6 text-center text-gray-500 text-sm">
      <p>Powered by Google Gemini 2.5 Pro 💡</p>
    </footer>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {activeView === 'generator' ? <ContentGenerator /> : <ChatBot />}
      </main>
      <div className="pb-16 md:pb-0"></div> {/* Spacer for mobile nav */}
      <MobileNav />
      <Footer />
    </div>
  );
};

export default App;