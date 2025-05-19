"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Loading() {

  const router = useRouter();

  useEffect(() => {
    const navigationTimer = setTimeout(() => {
      router.push('/login');
    }, 1500);

    return () => clearTimeout(navigationTimer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <svg
            className="w-16 h-16 animate-pulse text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5v-4a2 2 0 012-2h10a2 2 0 012 2v4h-4m-6 0h6"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white animate-fade-in">
          Welcome to ChatSphere
        </h1>
        <p className="mt-2 text-lg text-white/80 animate-fade-in-delay">
          Connecting you to the conversation...
        </p>
        <div className="mt-6 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
}