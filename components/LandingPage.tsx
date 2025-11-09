import React from 'react';
import { SparklesIcon, SeoIcon, ToneIcon, HistoryIcon, PencilIcon, SettingsIcon, DocumentIcon, StarIcon } from './icons/Icons';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {

  const Nav = () => (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-30">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <SparklesIcon className="h-8 w-8 text-indigo-600"/>
            <span className="text-2xl font-bold text-gray-800">ProWrite AI</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
          <a href="#reviews" className="text-gray-600 hover:text-indigo-600 transition-colors">Reviews</a>
          <a href="#contact" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</a>
        </nav>
        <button onClick={onGetStarted} className="hidden md:block bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow">
            Get Started Free
        </button>
      </div>
    </header>
  );

  const Hero = () => (
    <section id="home" className="bg-blue-50 pt-20 pb-12 md:pt-28 md:pb-20">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight mb-4">
            Create High-Quality AI Content in Seconds
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">
            ProWrite AI helps you write blogs, articles, ads, and social posts instantly — free and smart.
          </p>
          <div className="flex justify-center md:justify-start">
            <button onClick={onGetStarted} className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg transform hover:scale-105">
              Get Started Free
            </button>
          </div>
        </div>
        <div className="hidden md:block p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200 transform perspective-1000 rotate-y-15 hover:rotate-y-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-gray-700">Content Generator</span>
                    <div className="flex space-x-1.5">
                        <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                        <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                        <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                    </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
                <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-full animate-pulse delay-75"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse delay-150"></div>
                    <div className="h-3 bg-gray-200 rounded w-full animate-pulse delay-200"></div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                    <div className="h-8 w-24 bg-indigo-500 rounded-md animate-pulse"></div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );

  const Features = () => (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Powerful Features to Boost Your Workflow</h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">Discover the tools that make content creation faster, smarter, and more effective.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard icon={<SparklesIcon className="h-8 w-8 text-indigo-500"/>} title="Smart AI Writing Assistant" description="Generate human-like text for any topic with our advanced AI."/>
          <FeatureCard icon={<SeoIcon className="h-8 w-8 text-indigo-500"/>} title="SEO-Optimized Output" description="Create content that ranks higher on search engines with built-in SEO suggestions."/>
          <FeatureCard icon={<ToneIcon className="h-8 w-8 text-indigo-500"/>} title="Multiple Writing Tones" description="Adapt your content's tone from professional to casual to fit your brand's voice."/>
          <FeatureCard icon={<HistoryIcon className="h-8 w-8 text-indigo-500"/>} title="Save & Edit History Anytime" description="Never lose your work. Access, edit, and manage all your generated content easily."/>
        </div>
      </div>
    </section>
  );
  
  const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-2 border border-gray-100">
      <div className="bg-indigo-100 text-indigo-500 rounded-full h-16 w-16 flex items-center justify-center mb-6 mx-auto">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );

  const HowItWorks = () => (
    <section id="how-it-works" className="py-20 bg-blue-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">Get Your Content in 3 Simple Steps</h2>
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-indigo-200 -translate-y-1/2"></div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            <StepCard number="1" title="Enter Your Topic" description="Start by providing your main idea, keywords, or a short description." icon={<PencilIcon className="h-8 w-8 text-white"/>}/>
            <StepCard number="2" title="Choose Tone & Style" description="Select the content type, tone, and length to match your needs." icon={<SettingsIcon className="h-8 w-8 text-white"/>}/>
            <StepCard number="3" title="Get Instant Content" description="Our AI generates your high-quality content in just a few seconds." icon={<DocumentIcon className="h-8 w-8 text-white"/>}/>
          </div>
        </div>
      </div>
    </section>
  );
  
  const StepCard = ({ number, title, description, icon }: { number: string, title: string, description: string, icon: React.ReactNode }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center">
      <div className="bg-indigo-600 text-white rounded-full h-16 w-16 flex items-center justify-center mb-6 mx-auto text-2xl font-bold">{number}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );

  const Reviews = () => (
    <section id="reviews" className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">Loved by Professionals Worldwide</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ReviewCard name="Sarah M." quote="Best AI writer I’ve used! The quality is outstanding and saves me hours of work."/>
          <ReviewCard name="David K." quote="Super fast and accurate — perfect for blogs. The SEO features are a game-changer."/>
          <ReviewCard name="Ayesha R." quote="I use it daily for social captions. It's so easy to generate creative and engaging posts."/>
        </div>
      </div>
    </section>
  );

  const ReviewCard = ({ name, quote }: { name: string, quote: string }) => (
    <div className="bg-gray-50 p-8 rounded-xl shadow-md border border-gray-100 text-left">
      <div className="flex items-center mb-4">
        <img src={`https://i.pravatar.cc/48?u=${name}`} alt={name} className="w-12 h-12 rounded-full mr-4"/>
        <div>
          <p className="font-bold text-gray-800">{name}</p>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => <StarIcon key={i} className="h-5 w-5"/>)}
          </div>
        </div>
      </div>
      <p className="text-gray-600 italic">“{quote}”</p>
    </div>
  );

  const Contact = () => (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center bg-gray-50 p-8 md:p-12 rounded-2xl border border-gray-100">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Get In Touch</h2>
            <p className="text-gray-600 mb-6">Have questions or feedback? We'd love to hear from you. Reach out to us anytime.</p>
            <div className="space-y-4">
                <p className="text-gray-700">📩 <span className="font-semibold">Email:</span> surajkumar.aideveloper@gmail.com</p>
            </div>
          </div>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input type="text" id="name" placeholder="Your Name" className="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"/>
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input type="email" id="email" placeholder="Your Email" className="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"/>
            </div>
            <div>
              <label htmlFor="message" className="sr-only">Message</label>
              <textarea id="message" rows={4} placeholder="Your Message" className="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"></textarea>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );

  const Footer = () => (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#home" className="hover:text-indigo-300 transition-colors">Home</a>
          <a href="#features" className="hover:text-indigo-300 transition-colors">Features</a>
          <a href="#reviews" className="hover:text-indigo-300 transition-colors">Reviews</a>
          <a href="#contact" className="hover:text-indigo-300 transition-colors">Contact</a>
        </div>
        <p className="text-gray-400">© 2025 ProWrite AI — All Rights Reserved.</p>
      </div>
    </footer>
  );
  
  return (
    <div className="bg-white font-sans antialiased">
      <Nav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;