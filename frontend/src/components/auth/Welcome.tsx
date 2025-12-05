import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-stone-50 to-stone-100 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-ethio-green via-ethio-yellow to-ethio-red" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-ethio-green/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-ethio-yellow/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto z-10"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-8 border border-stone-100"
        >
          <span className="text-5xl">🌱</span>
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-display font-bold text-stone-900 mb-6 tracking-tight">
          Ethio-Origin
        </h1>
        <p className="text-xl md:text-2xl text-stone-600 mb-2 font-light">
          Farm-to-Market Traceability
        </p>
        <div className="flex items-center justify-center gap-2 mb-12">
          <span className="h-px w-8 bg-stone-300"></span>
          <p className="text-sm font-medium text-stone-400 uppercase tracking-widest">Powered by Cardano</p>
          <span className="h-px w-8 bg-stone-300"></span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          {[
            { icon: '🔍', title: 'Verify', desc: 'Trace product origin instantly' },
            { icon: '🤝', title: 'Connect', desc: 'Support farmers directly' },
            { icon: '🔗', title: 'Trust', desc: 'Secured by blockchain' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (index * 0.1) }}
              className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl mb-3 block">{item.icon}</span>
              <h3 className="font-bold text-stone-900 mb-1">{item.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/roles')}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-stone-900 rounded-full hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900 w-full md:w-auto text-lg shadow-lg hover:shadow-xl"
        >
          Get Started
          <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </motion.button>
      </motion.div>

      <div className="absolute bottom-6 text-center">
        <p className="text-stone-400 text-sm">
          &copy; {new Date().getFullYear()} Ethio-Origin. All rights reserved.
        </p>
      </div>
    </div>
  );
}