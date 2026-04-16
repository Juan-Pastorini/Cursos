'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ChatBot from './ChatBot';

export default function AiSupportBubble() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // No mostrar en las páginas de administración
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <>
            {/* Floating AI ChatBot Bubble (Left) */}
            <div className="fixed bottom-6 left-6 lg:bottom-10 lg:left-10 z-[100]">
                <motion.button
                    whileHover={{ scale: 1.1, translateY: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shadow-[0_20px_50px_-10px_rgba(79,70,229,0.5)] transition-all relative overflow-hidden group ${isOpen
                            ? 'bg-slate-900 text-white'
                            : 'bg-gradient-to-br from-indigo-500 via-blue-600 to-violet-700 text-white'
                        }`}
                >
                    {/* Gradient Glow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    {isOpen ? (
                        <X size={24} strokeWidth={3} className="relative z-10" />
                    ) : (
                        <div className="relative z-10 flex flex-col items-center justify-center">
                            <div className="text-2xl font-black italic tracking-tighter drop-shadow-md">A</div>
                            <div className="absolute -inset-4 bg-blue-400/20 blur-xl rounded-full animate-pulse"></div>
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-[3px] border-indigo-600 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
                        </div>
                    )}
                </motion.button>
            </div>

            {/* Overlaid AI ChatBot Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.95, x: -20 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95, x: -20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 400 }}
                        className="fixed bottom-24 left-4 lg:bottom-28 lg:left-10 w-[min(calc(100vw-32px),420px)] h-[min(calc(100vh-160px),600px)] z-[95] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-700/50 rounded-[2.5rem] overflow-hidden bg-slate-900"
                    >
                        <ChatBot />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
