import React from 'react';
import { useAppStore } from '../store';
import { Link } from 'react-router-dom';
import { Users, BookOpen, FileText, Clock, AlertTriangle } from 'lucide-react';

const DashboardPage = () => {
  const { students, classes, auditLogs, currentUser } = useAppStore();
  
  // Calculate total documents
  const totalDocuments = students.reduce(
    (acc, student) => acc + student.documents.length, 
    0
  );
  
  // Get recent audit logs (last 5)
  const recentLogs = auditLogs.slice(0, 5);
  
  // Get expiring documents (mock data for demo)
  const expiringDocuments = [
    {
      id: '1',
      studentName: 'João Silva',
      documentTitle: 'Carteira de Vacinação',
      expiryDate: '2025-06-15',
    },
    {
      id: '2',
      studentName: 'Ana Oliveira',
      documentTitle: 'Autorização de Passeio',
      expiryDate: '2025-05-20',
    },
  ];
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  return (
    <div className="fade-in">
      <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Bem-vindo ao Sistema de Gestão de Documentos Escolares
      </p>
      
      {/* Stats overview */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Students stat */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-neutral-500 truncate">
                    Total de Alunos
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-neutral-900">
                      {students.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-neutral-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/students" className="font-medium text-primary-600 hover:text-primary-500">
                Ver todos
              </Link>
            </div>
          </div>
        </div>
        
        {/* Classes stat */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-neutral-500 truncate">
                    Total de Turmas
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-neutral-900">
                      {classes.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-neutral-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/classes" className="font-medium text-primary-600 hover:text-primary-500">
                Ver todas
              </Link>
            </div>
          </div>
        </div>
        
        {/* Documents stat */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-neutral-500 truncate">
                    Total de Documentos
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-neutral-900">
                      {totalDocuments}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-neutral-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/documents" className="font-medium text-primary-600 hover:text-primary-500">
                Ver todos
              </Link>
            </div>
          </div>
        </div>
        
        {/* Expiring documents stat */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-warning-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-neutral-500 truncate">
                    Documentos Expirando
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-neutral-900">
                      {expiringDocuments.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-neutral-50 px-5 py-3">
            <div className="text-sm">
              <a href="#expiring" className="font-medium text-primary-600 hover:text-primary-500">
                Ver detalhes
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent activity and Expiring documents */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-5 py-4 border-b border-neutral-200">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-neutral-500 mr-2" />
              <h3 className="text-lg font-medium leading-6 text-neutral-900">
                Atividades Recentes
              </h3>
            </div>
          </div>
          <div className="px-5 py-3">
            <ul className="divide-y divide-neutral-200">
              {recentLogs.length > 0 ? (
                recentLogs.map((log) => {
                  // Find user name
                  const user = useAppStore.getState().users.find(u => u.id === log.userId);
                  
                  // Determine action description
                  let actionText = '';
                  let resourceTypeText = '';
                  
                  switch (log.action) {
                    case 'create': actionText = 'criou'; break;
                    case 'update': actionText = 'atualizou'; break;
                    case 'delete': actionText = 'excluiu'; break;
                    case 'view': actionText = 'visualizou'; break;
                    case 'download': actionText = 'baixou'; break;
                  }
                  
                  switch (log.resourceType) {
                    case 'student': resourceTypeText = 'um aluno'; break;
                    case 'document': resourceTypeText = 'um documento'; break;
                    case 'class': resourceTypeText = 'uma turma'; break;
                  }
                  
                  return (
                    <li key={log.id} className="py-3">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <img 
                            className="h-8 w-8 rounded-full" 
                            src={user?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                            alt=""
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-neutral-900">
                            <span className="font-medium">{user?.name || 'Usuário'}</span>
                            {' '}{actionText}{' '}{resourceTypeText}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {formatDate(log.timestamp)}
                            {log.details && ` • ${log.details}`}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="py-4 text-center text-sm text-neutral-500">
                  Nenhuma atividade recente
                </li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Expiring documents */}
        <div id="expiring" className="bg-white shadow rounded-lg">
          <div className="px-5 py-4 border-b border-neutral-200">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-warning-500 mr-2" />
              <h3 className="text-lg font-medium leading-6 text-neutral-900">
                Documentos a Expirar
              </h3>
            </div>
          </div>
          <div className="px-5 py-3">
            <ul className="divide-y divide-neutral-200">
              {expiringDocuments.length > 0 ? (
                expiringDocuments.map((doc) => (
                  <li key={doc.id} className="py-3">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-neutral-900">
                          {doc.documentTitle}
                        </p>
                        <p className="text-sm text-neutral-500">
                          Aluno: {doc.studentName}
                        </p>
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                            Expira em: {new Date(doc.expiryDate).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-1 border border-neutral-300 text-sm leading-4 font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50"
                        >
                          Renovar
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-4 text-center text-sm text-neutral-500">
                  Nenhum documento próximo à expiração
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;