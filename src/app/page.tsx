"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Certifique-se de usar 'next/navigation'
import Header from '@/app/components/header';
import Camera from '@/app/components/Camera';

// Função que verifica a autenticação do usuário
const checkAuthentication = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    console.log('Token:', token); // Adicione este log
    return !!token;
  }
  return false;
};

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = checkAuthentication();
    console.log('isAuthenticated:', isAuthenticated); // Adicione este log
    if (!isAuthenticated) {
      console.log('Redirecionando para login'); // Adicione este log
      router.push('/login');
    }
  }, [router]);

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
        <Camera />
      </main>
    </>
  );
}
