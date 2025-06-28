import React from 'react';
import { useAppStore } from '../store';
import { 
  User, 
  Shield, 
  Lock, 
  Bell, 
  HelpCircle, 
  Info,
  Database
} from 'lucide-react';

const SettingsPage = () => {
  const { currentUser } = useAppStore();
  
  // Only admins can access certain settings
  const isAdmin = currentUser?.role === 'admin';
  
  return (
    <div className="fade-in">
      <h1 className="text-2xl font-semibold text-neutral-900">Configurações</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Gerenciar preferências e configurações do sistema
      </p>
      
      <div className="mt-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="border-b border-neutral-200 bg-primary-50 px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-neutral-900 flex items-center">
              <User className="mr-2 h-5 w-5 text-primary-600" />
              Configurações de Conta
            </h3>
          </div>
          <ul className="divide-y divide-neutral-200">
            <li>
              <div className="px-4 py-4 sm:px-6 hover:bg-neutral-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img 
                        className="h-10 w-10 rounded-full" 
                        src={currentUser?.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"} 
                        alt="" 
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-neutral-900">
                        {currentUser?.name}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {currentUser?.email}
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-neutral-300 shadow-sm text-sm leading-4 font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Editar perfil
                    </button>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <a href="#" className="block hover:bg-neutral-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Lock className="h-5 w-5 text-neutral-400" />
                      <p className="ml-3 text-sm font-medium text-neutral-900">Segurança e login</p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </li>
            <li>
              <a href="#" className="block hover:bg-neutral-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 text-neutral-400" />
                      <p className="ml-3 text-sm font-medium text-neutral-900">Notificações</p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </li>
          </ul>
        </div>
        
        {isAdmin && (
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
            <div className="border-b border-neutral-200 bg-primary-50 px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-neutral-900 flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary-600" />
                Configurações do Sistema
              </h3>
            </div>
            <ul className="divide-y divide-neutral-200">
              <li>
                <a href="#" className="block hover:bg-neutral-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-neutral-400" />
                        <p className="ml-3 text-sm font-medium text-neutral-900">Gerenciar usuários</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <a href="#" className="block hover:bg-neutral-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Database className="h-5 w-5 text-neutral-400" />
                        <p className="ml-3 text-sm font-medium text-neutral-900">Backup de dados</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <a href="#" className="block hover:bg-neutral-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Lock className="h-5 w-5 text-neutral-400" />
                        <p className="ml-3 text-sm font-medium text-neutral-900">Permissões e níveis de acesso</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        )}
        
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
          <div className="border-b border-neutral-200 bg-primary-50 px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-neutral-900 flex items-center">
              <HelpCircle className="mr-2 h-5 w-5 text-primary-600" />
              Ajuda e Suporte
            </h3>
          </div>
          <ul className="divide-y divide-neutral-200">
            <li>
              <a href="#" className="block hover:bg-neutral-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <HelpCircle className="h-5 w-5 text-neutral-400" />
                      <p className="ml-3 text-sm font-medium text-neutral-900">Centro de ajuda</p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </li>
            <li>
              <a href="#" className="block hover:bg-neutral-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Info className="h-5 w-5 text-neutral-400" />
                      <p className="ml-3 text-sm font-medium text-neutral-900">Sobre o sistema</p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;