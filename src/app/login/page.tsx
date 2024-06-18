"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import localforage from 'localforage';
import Link from 'next/link';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const checkToken = async () => {
      const token = await localforage.getItem<string>('token');
      if (token) {
        redirectTo('/');
      }
    };

    checkToken();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5005/login', {
        DS_EMAIL: email,
        CD_SENHA: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log("Logado com sucesso!");

        const { token, email, ID_EMPRESA } = response.data;
        await localforage.setItem('token', token);
        await localforage.setItem('email', email);
        await localforage.setItem('ID_EMPRESA', ID_EMPRESA);

        if (rememberMe) {
          setCookie('token', token, 7);
        }

        redirectTo('/');
      } else {
        setErrorMessage("Credenciais inválidas");
      }
    } catch (error) {
      console.error("Ocorreu um erro ao tentar fazer login:", error);
      setErrorMessage("Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.");
    }
  };

  const redirectTo = (path: string) => {
    window.location.href = path;
  };

  const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
  };

  const getCookie = (name: string) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-black">Login</h1>
        <form>
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center">
              
            </div>
          </div>
          {errorMessage && <p className="text-red-600 mt-5 text-center">{errorMessage}</p>}
          <button
            type="button"
            onClick={handleLogin}
            className="mt-8 w-full bg-cyan-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
          >
            Entrar
          </button>
         
        </form>
      </div>
    </div>
  );
}

export default Login;
