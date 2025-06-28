import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { 
  Plus, 
  Search, 
  BookOpen, 
  Users, 
  Edit,
  Trash2
} from 'lucide-react';
import ClassFormModal from '../components/classes/ClassFormModal';

const ClassesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const { classes, students, users } = useAppStore();
  
  // Apply filters
  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.gradeLevel.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get teacher name
  const getTeacherName = (teacherId?: string) => {
    if (!teacherId) return 'Não designado';
    const teacher = users.find(u => u.id === teacherId);
    return teacher ? teacher.name : 'Professor não encontrado';
  };
  
  // Count students in class
  const countStudents = (classId: string) => {
    return students.filter(s => s.classId === classId).length;
  };
  
  return (
    <div className="fade-in">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Turmas</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Gerenciar turmas e organização dos alunos
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Turma
          </button>
        </div>
      </div>
      
      {/* Search */}
      <div className="mt-6 pb-5 border-b border-neutral-200">
        <div className="relative rounded-md shadow-sm max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Buscar por nome ou nível da turma"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Classes grid */}
      <div className="mt-6">
        {filteredClasses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-neutral-500 truncate">
                          {cls.gradeLevel}
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-neutral-900">
                            {cls.name}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-neutral-500">
                      <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-neutral-400" />
                      <span>{countStudents(cls.id)} alunos</span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-neutral-500">
                      <span>Professor: {getTeacherName(cls.teacherId)}</span>
                    </div>
                    {cls.description && (
                      <div className="mt-2 text-sm text-neutral-500 line-clamp-2">
                        {cls.description}
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-neutral-50 px-4 py-4 sm:px-6 flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium text-neutral-500">
                      Ano letivo: {cls.schoolYear}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/classes/${cls.id}`)}
                      className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-neutral-700 bg-white hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-error-700 bg-white hover:bg-error-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-2 text-sm font-medium text-neutral-900">Nenhuma turma encontrada</h3>
            <p className="mt-1 text-sm text-neutral-500">
              {searchTerm
                ? 'Tente ajustar os termos de busca'
                : 'Comece adicionando uma nova turma ao sistema'}
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Turma
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Add Class Modal */}
      {isAddModalOpen && (
        <ClassFormModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ClassesPage;