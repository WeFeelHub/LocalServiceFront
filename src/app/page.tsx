"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/header';
import Cameras from '@/app/components/Cameras';

const checkAuthentication = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken'); // Ensure the key matches the key used in login
    console.log('Token:', 'Token Encontrado'); // Log the token
    return !!token;
  }
  return false;
};

export default function Home() {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const isAuthenticated = checkAuthentication();
    console.log('isAuthenticated:', isAuthenticated); // Log the authentication status
    if (!isAuthenticated) {
      console.log('Redirecionando para login'); // Log the redirection
      router.push('/login');
    }
  }, [router]);

  return (
    <>
      <Header onSelectEvent={setSelectedEvent} />
      <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
        <Cameras selectedEvent={selectedEvent} />
      </main>
    </>
  );
}
