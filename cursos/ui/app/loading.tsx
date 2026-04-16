import React from 'react';

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="relative">
                <div className="w-20 h-20 border-2 border-violet-500/20 rounded-full"></div>
                <div className="absolute inset-0 w-20 h-20 border-t-2 border-violet-500 rounded-full animate-spin"></div>
                <div className="absolute -inset-4 border border-white/5 rounded-full animate-pulse"></div>
            </div>
        </div>
    );
}
