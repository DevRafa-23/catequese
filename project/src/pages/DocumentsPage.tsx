import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { 
  Search, 
  Filter, 
  FileText, 
  X, 
  Download, 
  Eye,
  Calendar
} from 'lucide-react';
import DocumentViewModal from '../components/documents/DocumentViewModal';
import { Document, DocumentType } from '../types';

const DocumentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState<DocumentType | ''>('');
  const [statusFilter, setStatusFilter] = useState<'' | 'active' | 'expired' | 'pending'>('');
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  
  const { students } = useAppStore();
  
  // Get all documents across students
  const allDocuments = students.flatMap(student => 
    student.documents.map(doc => ({
      ...doc,
      studentName: student.name,
      studentId: student.id
    }))
  );
  
  // Apply filters
  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !typeFilter || doc.type === typeFilter;
    const matchesStatus = !statusFilter || doc.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };
  
  // Get document type display name
  const getDocumentTypeName = (type: string): string => {
    switch (type) {
      case 'identification': return 'Identificação';
      case 'academic_record': return 'Histórico Escolar';
      case 'address_proof': return 'Comprovante de Residência';
      case 'health_record': return 'Documentos de Saúde';
      case 'enrollment_form': return 'Matrícula';
      case 'parent_authorization': return 'Autorização dos Pais';
      case 'other': return 'Outros';
      default: return type;
    }
  };
  
  return (
    <div className="fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Documentos</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Visualize e gerencie todos os documentos do sistema
        </p>
      </div>
      
      {/* Search and filters */}
      <div className="mt-6 pb-5 border-b border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="relative rounded-md shadow-sm max-w-lg w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Buscar por título ou aluno"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="mt-3 sm:mt-0 flex items-center">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-neutral-300 shadow-sm text-sm leading-4 font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </button>
            
            {typeFilter && (
              <div className="ml-2 flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                <span>Tipo: {getDocumentTypeName(typeFilter)}</span>
                <button
                  type="button"
                  onClick={() => setTypeFilter('')}
                  className="ml-1 text-primary-600 hover:text-primary-800 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {statusFilter && (
              <div className="ml-2 flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                <span>Status: {
                  statusFilter === 'active' ? 'Ativo' :
                  statusFilter === 'expired' ? 'Expirado' : 'Pendente'
                }</span>
                <button
                  type="button"
                  onClick={() => setStatusFilter('')}
                  className="ml-1 text-primary-600 hover:text-primary-800 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Expanded filters */}
        {showFilters && (
          <div className="mt-4 bg-neutral-50 p-4 rounded-md shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Document type filter */}
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-2">Tipo de Documento</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTypeFilter('')}
                    className={`text-sm px-3 py-2 rounded-md ${
                      !typeFilter 
                        ? 'bg-primary-100 text-primary-800' 
                        : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    Todos
                  </button>
                  
                  {['identification', 'academic_record', 'address_proof', 'health_record', 'enrollment_form', 'parent_authorization', 'other'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTypeFilter(type as DocumentType)}
                      className={`text-sm px-3 py-2 rounded-md ${
                        typeFilter === type 
                          ? 'bg-primary-100 text-primary-800' 
                          : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      {getDocumentTypeName(type)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Status filter */}
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-2">Status</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatusFilter('')}
                    className={`text-sm px-3 py-2 rounded-md ${
                      !statusFilter 
                        ? 'bg-primary-100 text-primary-800' 
                        : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    Todos
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setStatusFilter('active')}
                    className={`text-sm px-3 py-2 rounded-md ${
                      statusFilter === 'active' 
                        ? 'bg-success-50 text-success-700 border border-success-200' 
                        : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    Ativos
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setStatusFilter('pending')}
                    className={`text-sm px-3 py-2 rounded-md ${
                      statusFilter === 'pending' 
                        ? 'bg-warning-50 text-warning-700 border border-warning-200' 
                        : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    Pendentes
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setStatusFilter('expired')}
                    className={`text-sm px-3 py-2 rounded-md ${
                      statusFilter === 'expired' 
                        ? 'bg-error-50 text-error-700 border border-error-200' 
                        : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    Expirados
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Documents list */}
      <div className="mt-6">
        {filteredDocuments.length > 0 ? (
          <div className="bg-white shadow overflow-hidden rounded-md">
            <ul className="divide-y divide-neutral-200">
              {filteredDocuments.map((doc) => (
                <li key={doc.id} className="px-6 py-4 hover:bg-neutral-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4 min-w-0">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-neutral-900 truncate mr-2">
                            {doc.title}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            doc.status === 'active' 
                              ? 'bg-success-50 text-success-700' 
                              : doc.status === 'expired'
                              ? 'bg-error-50 text-error-700'
                              : 'bg-warning-50 text-warning-700'
                          }`}>
                            {doc.status === 'active' 
                              ? 'Ativo' 
                              : doc.status === 'expired'
                              ? 'Expirado'
                              : 'Pendente'}
                          </span>
                        </div>
                        <div className="text-sm text-neutral-500">
                          Aluno: <Link to={`/students/${doc.studentId}`} className="text-primary-600 hover:underline">{doc.studentName}</Link>
                        </div>
                        <div className="mt-1 flex items-center text-xs text-neutral-500">
                          <span className="flex items-center">
                            <Calendar className="flex-shrink-0 mr-1 h-4 w-4 text-neutral-400" />
                            Enviado em {formatDate(doc.uploadDate)}
                          </span>
                          <span className="ml-3 truncate">
                            {getDocumentTypeName(doc.type)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <button
                        onClick={() => setViewingDocument(doc)}
                        className="mr-2 btn btn-ghost"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Visualizar
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Baixar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-2 text-sm font-medium text-neutral-900">Nenhum documento encontrado</h3>
            <p className="mt-1 text-sm text-neutral-500">
              {searchTerm || typeFilter || statusFilter
                ? 'Tente ajustar os filtros de busca'
                : 'Não há documentos cadastrados no sistema'}
            </p>
          </div>
        )}
      </div>
      
      {/* Document View Modal */}
      {viewingDocument && (
        <DocumentViewModal
          isOpen={!!viewingDocument}
          onClose={() => setViewingDocument(null)}
          document={viewingDocument}
        />
      )}
    </div>
  );
};

export default DocumentsPage;