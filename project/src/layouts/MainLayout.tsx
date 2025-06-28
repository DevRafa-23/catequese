import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  FileText, 
  Settings, 
  Home, 
  Menu, 
  X, 
  LogOut, 
  Bell,
  Search
} from 'lucide-react';
import { useAppStore } from '../store';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { currentUser, logout } = useAppStore();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebar = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  const menuItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: <Home className="w-5 h-5" /> 
    },
    { 
      path: '/students', 
      label: 'Alunos', 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      path: '/classes', 
      label: 'Turmas', 
      icon: <BookOpen className="w-5 h-5" /> 
    },
    { 
      path: '/documents', 
      label: 'Documentos', 
      icon: <FileText className="w-5 h-5" /> 
    },
    { 
      path: '/settings', 
      label: 'Configurações', 
      icon: <Settings className="w-5 h-5" /> 
    },
  ];
  
  return (
    <div className="h-screen flex overflow-hidden bg-neutral-50">
      {/* Sidebar for mobile */}
      <div 
        className={`fixed inset-0 z-40 flex md:hidden ${
          sidebarOpen ? 'visible' : 'invisible'
        }`}
        onClick={closeSidebar}
      >
        {/* Overlay */}
        <div 
          className={`fixed inset-0 bg-neutral-900 bg-opacity-50 transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* Sidebar */}
        <div 
          className={`relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-primary-800 transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <div className="absolute top-0 right-0 pt-2 pr-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={toggleSidebar}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center px-4">
            <span className="text-xl font-bold text-white">DocEscolar</span>
          </div>
          
          {/* Nav Items */}
          <div className="mt-8 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-700 text-white'
                      : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                  }`}
                  onClick={closeSidebar}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          
          {/* User profile */}
          <div className="flex-shrink-0 flex border-t border-primary-700 p-4">
            <div className="flex items-center">
              <div>
                <img
                  className="inline-block h-10 w-10 rounded-full"
                  src={currentUser?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                  alt="Avatar"
                />
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-white">
                  {currentUser?.name || 'Usuário'}
                </p>
                <p className="text-sm font-medium text-primary-200">
                  {currentUser?.role === 'admin'
                    ? 'Administrador'
                    : currentUser?.role === 'teacher'
                    ? 'Professor'
                    : 'Secretaria'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-primary-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <span className="text-xl font-bold text-white">DocEscolar</span>
              </div>
              <nav className="mt-8 flex-1 px-2 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.path)
                        ? 'bg-primary-700 text-white'
                        : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* User profile */}
            <div className="flex-shrink-0 flex border-t border-primary-700 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <img
                      className="inline-block h-9 w-9 rounded-full"
                      src={currentUser?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                      alt="Avatar"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      {currentUser?.name || 'Usuário'}
                    </p>
                    <p className="text-xs font-medium text-primary-200">
                      {currentUser?.role === 'admin'
                        ? 'Administrador'
                        : currentUser?.role === 'teacher'
                        ? 'Professor'
                        : 'Secretaria'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-neutral-200 text-neutral-500 focus:outline-none focus:bg-neutral-100 focus:text-neutral-600 md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-neutral-400 focus-within:text-neutral-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    className="block w-full h-full pl-10 pr-3 py-2 rounded-md text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Buscar alunos, documentos..."
                    type="search"
                  />
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notification bell */}
              <button className="p-1 rounded-full text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <Bell className="h-6 w-6" />
              </button>
              
              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="ml-3 p-1 rounded-full text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;