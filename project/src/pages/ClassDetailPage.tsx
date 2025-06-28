import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  UserMinus,
  Calendar,
  User
} from 'lucide-react';
import ClassFormModal from '../components/classes/ClassFormModal';
import AddStudentToClassModal from '../components/classes/AddStudentToClassModal';

const ClassDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  
  const { classes, students, users, removeStudentFromClass, deleteClass } = useAppStore();
  
  const classData = classes.find(c => c.id === id);
  
  if (!classData) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-neutral-900">Turma não encontrada</h3>
            <p className="mt-1 text-sm text-neutral-500">
              A turma que você está procurando não existe ou foi removida.
            </p>
            <div className="mt-6">
              <Link to="/classes" className="btn btn-primary">
                Voltar para lista de turmas
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Get students in this class
  const classStudents = students.filter(student => student.classId === classData.id);
  
  // Get teacher info
  const teacher = classData.teacherId 
    ? users.find(user => user.id === classData.teacherId)
    : null;
  
  // Handle class deletion
  const handleDeleteClass = () => {
    if (window.confirm(`Tem certeza que deseja excluir a turma ${classData.name}? Esta ação não pode ser desfeita.`)) {
      deleteClass(classData.id);
      navigate('/classes');
    }
  };
  
  // Handle removing student from class
  const handleRemoveStudent = (studentId: string) => {
    if (window.confirm('Tem certeza que deseja remover este aluno da turma?')) {
      removeStudentFromClass(studentId, classData.id);
    }
  };
  
  return (
    <div className="fade-in">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/classes')}
            className="mr-4 text-neutral-500 hover:text-neutral-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">{classData.name}</h1>
            <p className="mt-1 text-sm text-neutral-500">
              {classData.gradeLevel} • Ano Letivo: {classData.schoolYear}
            </p>
          </div>
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
            onClick={handleDeleteClass}
            className="btn btn-danger"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Class information */}
        <div className="lg:col-span-1 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-primary-50">
            <h3 className="text-lg font-medium leading-6 text-neutral-900 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary-600" />
              Informações da Turma
            </h3>
          </div>
          <div className="border-t border-neutral-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-neutral-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-neutral-500 flex items-center">
                  <BookOpen className="h-4 w-4 mr-1 text-neutral-400" />
                  Nome da turma
                </dt>
                <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                  {classData.name}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-neutral-500">Nível de ensino</dt>
                <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                  {classData.gradeLevel}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-neutral-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-neutral-400" />
                  Ano letivo
                </dt>
                <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                  {classData.schoolYear}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-neutral-500 flex items-center">
                  <User className="h-4 w-4 mr-1 text-neutral-400" />
                  Professor
                </dt>
                <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                  {teacher ? (
                    <div className="flex items-center">
                      <img 
                        src={teacher.avatar} 
                        alt={teacher.name}
                        className="h-6 w-6 rounded-full mr-2"
                      />
                      {teacher.name}
                    </div>
                  ) : (
                    <span className="text-neutral-500">Não designado</span>
                  )}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-neutral-500 flex items-center">
                  <Users className="h-4 w-4 mr-1 text-neutral-400" />
                  Alunos
                </dt>
                <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                  {classStudents.length} alunos matriculados
                </dd>
              </div>
              {classData.description && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-neutral-500">Descrição</dt>
                  <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                    {classData.description}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
        
        {/* Students list */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-primary-50 flex justify-between items-center">
            <h3 className="text-lg font-medium leading-6 text-neutral-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary-600" />
              Alunos da Turma
            </h3>
            <button
              type="button"
              onClick={() => setIsAddStudentModalOpen(true)}
              className="btn btn-primary btn-sm"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Aluno
            </button>
          </div>
          <div className="border-t border-neutral-200">
            {classStudents.length > 0 ? (
              <ul className="divide-y divide-neutral-200">
                {classStudents.map((student) => (
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
                              {student.documents.length} documentos
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <Link
                          to={`/students/${student.id}`}
                          className="mr-2 btn btn-ghost"
                        >
                          Ver Perfil
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemoveStudent(student.id)}
                          className="btn btn-ghost text-error-600 hover:text-error-900"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-neutral-400" />
                <h3 className="mt-2 text-sm font-medium text-neutral-900">Nenhum aluno nesta turma</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Comece adicionando alunos à esta turma.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setIsAddStudentModalOpen(true)}
                    className="btn btn-primary"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar Aluno
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {isEditModalOpen && (
        <ClassFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          classId={classData.id}
        />
      )}
      
      {isAddStudentModalOpen && (
        <AddStudentToClassModal
          isOpen={isAddStudentModalOpen}
          onClose={() => setIsAddStudentModalOpen(false)}
          classId={classData.id}
        />
      )}
    </div>
  );
};

export default ClassDetailPage;