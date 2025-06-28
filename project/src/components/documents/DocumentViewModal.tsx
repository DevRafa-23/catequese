import React from 'react';
import { X, Download, Calendar, FileText, User, AlertTriangle } from 'lucide-react';
import { Document } from '../../types';
import { useAppStore } from '../../store';

interface DocumentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
}

const DocumentViewModal: React.FC<DocumentViewModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  const { users } = useAppStore();
  
  // Find uploader info
  const uploader = users.find(u => u.id === document.uploadedBy);
  
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
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-neutral-500 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
            <button
              type="button"
              className="bg-white rounded-full text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={onClose}
            >
              <span className="sr-only">Fechar</span>
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="bg-white">
            <div className="flex flex-col md:flex-row">
              {/* Document preview */}
              <div className="w-full md:w-7/12 bg-neutral-800 flex items-center justify-center min-h-[400px]">
                {document.fileType.startsWith('image/') ? (
                  <img 
                    src={document.file} 
                    alt={document.title} 
                    className="max-w-full max-h-[600px] object-contain"
                  />
                ) : (
                  <div className="text-center p-6">
                    <FileText className="h-16 w-16 text-white mx-auto" />
                    <p className="mt-2 text-white">
                      {document.fileType === 'application/pdf'
                        ? 'Documento PDF'
                        : document.fileType.includes('word')
                        ? 'Documento Word'
                        : 'Documento'}
                    </p>
                    <button className="mt-4 btn btn-primary">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </button>
                    <div className="mt-4 text-sm text-neutral-300">
                      <AlertTriangle className="h-4 w-4 inline mr-1" />
                      Esta é uma simulação. O download não está disponível nesta demonstração.
                    </div>
                  </div>
                )}
              </div>
              
              {/* Document metadata */}
              <div className="w-full md:w-5/12 p-6">
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="text-lg font-medium text-neutral-900">
                    {document.title}
                  </h3>
                  <div className="mt-1 flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      document.status === 'active' 
                        ? 'bg-success-50 text-success-700' 
                        : document.status === 'expired'
                        ? 'bg-error-50 text-error-700'
                        : 'bg-warning-50 text-warning-700'
                    }`}>
                      {document.status === 'active' 
                        ? 'Ativo' 
                        : document.status === 'expired'
                        ? 'Expirado'
                        : 'Pendente'}
                    </span>
                    <span className="ml-2 text-sm text-neutral-500">
                      {getDocumentTypeName(document.type)}
                    </span>
                  </div>
                </div>
                
                <dl className="mt-4 space-y-4">
                  {document.description && (
                    <div>
                      <dt className="text-sm font-medium text-neutral-500">Descrição</dt>
                      <dd className="mt-1 text-sm text-neutral-900">{document.description}</dd>
                    </div>
                  )}
                  
                  <div>
                    <dt className="text-sm font-medium text-neutral-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-neutral-400" />
                      Data de upload
                    </dt>
                    <dd className="mt-1 text-sm text-neutral-900">
                      {formatDate(document.uploadDate)}
                    </dd>
                  </div>
                  
                  {document.expiryDate && (
                    <div>
                      <dt className="text-sm font-medium text-neutral-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-neutral-400" />
                        Data de expiração
                      </dt>
                      <dd className="mt-1 text-sm text-neutral-900">
                        {formatDate(document.expiryDate)}
                      </dd>
                    </div>
                  )}
                  
                  <div>
                    <dt className="text-sm font-medium text-neutral-500 flex items-center">
                      <User className="h-4 w-4 mr-1 text-neutral-400" />
                      Enviado por
                    </dt>
                    <dd className="mt-1 text-sm text-neutral-900 flex items-center">
                      {uploader && (
                        <>
                          <img 
                            src={uploader.avatar} 
                            alt={uploader.name} 
                            className="h-5 w-5 rounded-full mr-2"
                          />
                          {uploader.name}
                        </>
                      )}
                    </dd>
                  </div>
                </dl>
                
                <div className="mt-6 flex space-x-3">
                  <button className="btn btn-primary">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </button>
                  <button className="btn btn-ghost">
                    Editar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewModal;