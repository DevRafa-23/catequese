import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { 
  ArrowLeft, 
  User, 
  FileText, 
  Edit, 
  Trash2, 
  Plus,
  Download,
  Calendar,
  Phone,
  Mail,
  MapPin,
  BookOpen
} from 'lucide-react';
import StudentFormModal from '../components/students/StudentFormModal';
import DocumentUploadModal from '../components/documents/DocumentUploadModal';
import DocumentViewModal from '../components/documents/DocumentViewModal';
import { Document } from '../types';

const StudentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  
  const { students, classes, deleteStudent } = useAppStore();
  
  const student = students.find(s => s.id === id);
  
  if (!student) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-neutral-900">Aluno não encontrado</h3>
            <p className="mt-1 text-sm text-neutral-500">
              O aluno que você está procurando não existe ou foi removido.
            </p>
            <div className="mt-6">
              <Link to="/students" className="btn btn-primary">
                Voltar para lista de alunos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Get class info
  const studentClass = student.classId
    ? classes.find(c => c.id === student.classId)
    : null;
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };
  
  // Group documents by type
  const documentsByType: Record<string, Document[]> = {};
  student.documents.forEach(doc => {
    if (!documentsByType[doc.type]) {
      documentsByType[doc.type] = [];
    }
    documentsByType[doc.type].push(doc);
  });
  
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
  
  // Handle student deletion
  const handleDeleteStudent = () => {
    if (window.confirm(`Tem certeza que deseja excluir o aluno ${student.name}? Esta ação não pode ser desfeita.`)) {
      deleteStudent(student.id);
      navigate('/students');
    }
  };
  
  // View document
  const handleViewDocument = (document: Document) => {
    setViewingDocument(document);
  };
  
  return (
    <div className="fade-in">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/students')}
            className="mr-4 text-neutral-500 hover:text-neutral-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-semibold text-neutral-900">{student.name}</h1>
        </div>
        <div className="mt-3 flex sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="btn btn-ghost mr-3"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </button>
          <button
            type="button"
            onClick={handleDeleteStudent}
            className="btn btn-danger"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Student information */}
        <div className="lg:col-span-1 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-primary-50">
            <h3 className="text-lg font-medium leading-6 text-neutral-900 flex items-center">
              <User className="h-5 w-5 mr-2 text-primary-600" />
              Informações do Aluno
            </h3>
          </div>
          <div className="border-t border-neutral-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-neutral-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-neutral-500 flex items-center">
                  <User className="h-4 w-4 mr-1 text-neutral-400" />
                  Nome completo
                </dt>
                <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                  {student.name}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-neutral-500">CPF</dt>
                <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                  {student.cpf}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-neutral-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-neutral-400" />
                  Data de nascimento
                </dt>
                <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                  {formatDate(student.dateOfBirth)}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-neutral-500 flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-neutral-400" />
                  Endereço
                </dt>
                <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                  {student.address}
                </dd>
              </div>
              {student.phoneNumber && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-neutral-500 flex items-center">
                    <Phone className="h-4 w-4 mr-1 text-neutral-400" />
                    Telefone
                  </dt>
                  <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                    {student.phoneNumber}
                  </dd>
                </div>
              )}
              {student.email && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-neutral-500 flex items-center">
                    <Mail className="h-4 w-4 mr-1 text-neutral-400" />
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                    {student.email}
                  </dd>
                </div>
              )}
              {student.guardianName && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-neutral-500">Responsável</dt>
                  <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                    {student.guardianName}
                    {student.guardianContact && ` - ${student.guardianContact}`}
                  </dd>
                </div>
              )}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-neutral-500 flex items-center">
                  <BookOpen className="h-4 w-4 mr-1 text-neutral-400" />
                  Turma
                </dt>
                <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                  {studentClass ? (
                    <Link 
                      to={`/classes/${studentClass.id}`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      {studentClass.name} - {studentClass.gradeLevel}
                    </Link>
                  ) : (
                    <span className="text-neutral-500">Sem turma designada</span>
                  )}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-neutral-500">Data de matrícula</dt>
                <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                  {formatDate(student.enrollmentDate)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Student documents */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-primary-50 flex justify-between items-center">
            <h3 className="text-lg font-medium leading-6 text-neutral-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary-600" />
              Documentos
            </h3>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="btn btn-primary btn-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Documento
            </button>
          </div>
          <div className="border-t border-neutral-200">
            {Object.keys(documentsByType).length > 0 ? (
              <div className="divide-y divide-neutral-200">
                {Object.entries(documentsByType).map(([type, documents]) => (
                  <div key={type} className="p-4">
                    <h4 className="text-sm font-medium text-neutral-900 mb-3">
                      {getDocumentTypeName(type)}
                    </h4>
                    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {documents.map((document) => (
                        <li key={document.id} className="col-span-1 bg-neutral-50 rounded-md shadow-sm border border-neutral-200">
                          <div className="w-full flex items-center justify-between p-4">
                            <div className="flex-1 truncate">
                              <div className="flex items-center space-x-3">
                                <h3 className="text-sm font-medium text-neutral-900 truncate">
                                  {document.title}
                                </h3>
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
                              </div>
                              <p className="mt-1 text-xs text-neutral-500 truncate">
                                Enviado em {formatDate(document.uploadDate)}
                              </p>
                            </div>
                            <div className="flex-shrink-0 flex space-x-1">
                              <button
                                onClick={() => handleViewDocument(document)}
                                className="p-1 rounded-md hover:bg-neutral-200"
                              >
                                <FileText className="h-5 w-5 text-neutral-500" />
                              </button>
                              <button
                                className="p-1 rounded-md hover:bg-neutral-200"
                              >
                                <Download className="h-5 w-5 text-neutral-500" />
                              </button>
                              <button
                                className="p-1 rounded-md hover:bg-neutral-200"
                              >
                                <Trash2 className="h-5 w-5 text-neutral-500" />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-neutral-400" />
                <h3 className="mt-2 text-sm font-medium text-neutral-900">Nenhum documento</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Comece adicionando documentos para este aluno.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="btn btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Documento
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {isEditModalOpen && (
        <StudentFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          studentId={student.id}
        />
      )}
      
      {isUploadModalOpen && (
        <DocumentUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          studentId={student.id}
        />
      )}
      
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

export default StudentDetailPage;