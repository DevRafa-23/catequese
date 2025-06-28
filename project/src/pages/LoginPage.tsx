import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@escola.edu');
  const [password, setPassword] = useState('senha123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const login = useAppStore(state => state.login);
  const isAuthenticated = useAppStore(state => state.isAuthenticated);
  
  if (isAuthenticated) {
    navigate('/dashboard');
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simple validation
    if (!email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos');
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      login(email, password);
      setIsLoading(false);
      
      // Check if login was successful
      if (!useAppStore.getState().isAuthenticated) {
        setError('Email ou senha inválidos');
      } else {
        navigate('/dashboard');
      }
    }, 1000);
  };
  
  // Quick login buttons for demo purposes
  const quickLogin = (role: string) => {
    switch (role) {
      case 'admin':
        setEmail('admin@escola.edu');
        setPassword('senha123');
        break;
      case 'teacher':
        setEmail('teacher@escola.edu');
        setPassword('senha123');
        break;
      case 'secretary':
        setEmail('secretary@escola.edu');
        setPassword('senha123');
        break;
    }
  };
  
  return (
    <div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-md bg-error-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-error-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-error-800">{error}</h3>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
            Email
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
            Senha
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-900">
              Lembrar-me
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
              Esqueceu sua senha?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn btn-primary"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>
      
      {/* Quick login section - For demo purposes only */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-neutral-500">
              Acesso rápido para demonstração
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div>
            <button
              onClick={() => quickLogin('admin')}
              className="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Admin
            </button>
          </div>
          <div>
            <button
              onClick={() => quickLogin('teacher')}
              className="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Professor
            </button>
          </div>
          <div>
            <button
              onClick={() => quickLogin('secretary')}
              className="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Secretaria
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;