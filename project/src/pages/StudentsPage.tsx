import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  X, 
  Users, 
  Trash2,
  Edit
} from 'lucide-react';
import StudentFormModal from '../components/students/StudentFormModal';

const StudentsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [classFilter, setClassFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const { students, classes } = useAppStore();
  
  // Apply filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.cpf.includes(searchTerm);
    
    const matchesClass = !classFilter || student.classId === classFilter;
    
    return matchesSearch && matchesClass;
  });
  
  // Get class name from class ID
  const getClassName = (classId?: string) => {
    if (!classId) return 'Sem turma';
    const foundClass = classes.find(c => c.id === classId);
    return foundClass ? foundClass.name : 'Turma não encontrada';
  };
  
  // Count documents for student
  const countDocuments = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.documents.length : 0;
  };
  
  return (
    <div className="fade-in">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Alunos</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Gerenciar cadastros e documentos dos alunos
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Aluno
          </button>
        </div>
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
              placeholder="Buscar por nome ou CPF"
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
            
            {classFilter && (
              <div className="ml-2 flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                <span>Turma: {getClassName(classFilter)}</span>
                <button
                  type="button"
                  onClick={() => setClassFilter('')}
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
            <h4 className="text-sm font-medium text-neutral-700 mb-2">Filtrar por turma</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setClassFilter('')}
                className={`text-sm px-3 py-2 rounded-md ${
                  !classFilter 
                    ? 'bg-primary-100 text-primary-800' 
                    : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                Todas as turmas
              </button>
              
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => setClassFilter(cls.id)}
                  className={`text-sm px-3 py-2 rounded-md ${
                    classFilter === cls.id 
                      ? 'bg-primary-100 text-primary-800' 
                      : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {cls.name}
                </button>
              ))}
              
              <button
                type="button"
                onClick={() => setClassFilter('none')}
                className={`text-sm px-3 py-2 rounded-md ${
                  classFilter === 'none' 
                    ? 'bg-primary-100 text-primary-800' 
                    : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                Sem turma
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Students list */}
      <div className="mt-6">
        {filteredStudents.length > 0 ? (
          <div className="bg-white shadow overflow-hidden rounded-md">
            <ul className="divide-y divide-neutral-200">
              {filteredStudents.map((student) => (
                <li key={student.id} className="px-6 py-4 hover:bg-neutral-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4 min-w-0">
                        <div className="text-sm font-medium text-neutral-900 truncate">
                          {student.name}
                        </div>
                        <div className="text-sm text-neutral-500">
                          CPF: {student.cpf}
                        </div>
                        <div className="mt-1 flex items-center text-xs text-neutral-500">
                          <span className="truncate">
                            Turma: {getClassName(student.classId)}
                          </span>
                          <span className="ml-2 flex items-center">
                            <FileText className="flex-shrink-0 mr-1 h-4 w-4 text-neutral-400" />
                            {countDocuments(student.id)} documentos
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <button
                        onClick={() => navigate(`/students/${student.id}`)}
                        className="mr-2 btn btn-ghost"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost text-error-600 hover:text-error-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-2 text-sm font-medium text-neutral-900">Nenhum aluno encontrado</h3>
            <p className="mt-1 text-sm text-neutral-500">
              {searchTerm || classFilter
                ? 'Tente ajustar os filtros de busca'
                : 'Comece adicionando um novo aluno ao sistema'}
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Aluno
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Add Student Modal */}
      {isAddModalOpen && (
        <StudentFormModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
};

export default StudentsPage;