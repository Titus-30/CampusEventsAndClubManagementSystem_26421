import React, { useState, useEffect } from 'react';
import { Calendar, Users, TrendingUp, Star, Zap, Shield, ArrowRight, CheckCircle, Sparkles, Globe, Award, Heart } from 'lucide-react';

const LandingPage = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Create, organize, and manage campus events seamlessly',
      color: 'from-blue-500 to-cyan-500',
      stats: '500+ Events'
    },
    {
      icon: Users,
      title: 'Club Activities',
      description: 'Join clubs, connect with peers, and build communities',
      color: 'from-purple-500 to-pink-500',
      stats: '100+ Clubs'
    },
    {
      icon: TrendingUp,
      title: 'Analytics & Reports',
      description: 'Track engagement and measure success with detailed insights',
      color: 'from-green-500 to-teal-500',
      stats: '95% Satisfaction'
    }
  ];

  const benefits = [
    { icon: Zap, title: 'Lightning Fast', description: 'Quick RSVP and instant notifications' },
    { icon: Shield, title: 'Secure & Reliable', description: 'Your data is protected with enterprise security' },
    { icon: Globe, title: 'Always Connected', description: 'Stay updated with real-time campus activities' },
    { icon: Award, title: 'Best Experience', description: 'Award-winning platform trusted by thousands' }
  ];

  const testimonials = [
    {
      name: 'Timo Demia',
      role: 'Student Leader',
      text: 'This platform transformed how we organize events. Absolutely amazing!',
      avatar: '/assets/testimonials/sarah.png'
    },
    {
      name: 'Gigi Buff',
      role: 'Club President',
      text: 'Managing our club has never been easier. Highly recommended!',
      avatar: '/assets/testimonials/michael.png'
    },
    {
      name: 'Irene D',
      role: 'Event Organizer',
      text: 'The analytics features help us understand what students really want.',
      avatar: '/assets/testimonials/emma.png'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Floating Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Campus Events
              </h1>
              <p className="text-xs text-gray-600">Manage Your Campus Life</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('login')}
            className="group px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 font-medium mb-6 animate-bounce-slow">
              <Sparkles className="w-4 h-4" />
              <span>Trusted by 10,000+ Students</span>
            </div>

            <h2 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                Transform Your
              </span>
              <br />
              <span className="text-gray-900">Campus Experience</span>
            </h2>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Join thousands of students managing events, clubs, and campus activities
              with the most innovative platform designed for your success.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => onNavigate('login')}
                className="group px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                Start Free Today
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>

              <button className="px-10 py-4 bg-white text-gray-700 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-gray-200">
                Watch Demo
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Feature Cards Animation */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border-2 ${activeFeature === index ? 'border-purple-400 scale-105' : 'border-transparent'
                  }`}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>

                <div className={`inline-block px-4 py-2 bg-gradient-to-r ${feature.color} text-white rounded-full text-sm font-bold`}>
                  {feature.stats}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Students <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Love Us</span>
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your campus life in one beautiful platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-200"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h4>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div className="transform hover:scale-110 transition-transform">
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-purple-200">Active Students</div>
            </div>
            <div className="transform hover:scale-110 transition-transform">
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-purple-200">Events Created</div>
            </div>
            <div className="transform hover:scale-110 transition-transform">
              <div className="text-5xl font-bold mb-2">100+</div>
              <div className="text-purple-200">Active Clubs</div>
            </div>
            <div className="transform hover:scale-110 transition-transform">
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-purple-200">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Students Say
            </h3>
            <p className="text-xl text-gray-600">Real stories from real students</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-100 shadow-lg">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Heart className="w-16 h-16 text-white/80 mx-auto mb-6 animate-pulse" />
          <h3 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ready to Get Started?
          </h3>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of students already transforming their campus experience.
            It's free, simple, and takes less than a minute.
          </p>

          <button
            onClick={() => onNavigate('login')}
            className="group px-12 py-5 bg-white text-purple-600 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            Start Your Journey
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>

          <p className="text-white/80 mt-6 text-sm">
            No commitment • No credit card • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Campus Events</span>
          </div>
          <p className="text-gray-400 mb-6">
            Empowering students to create, connect, and celebrate together.
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-gray-500 text-sm">
            © 2025 Campus Events. All rights reserved.
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;