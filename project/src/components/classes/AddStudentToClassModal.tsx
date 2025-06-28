import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { X, Search, Check } from 'lucide-react';

interface AddStudentToClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
}

const AddStudentToClassModal: React.FC<AddStudentToClassModalProps> = ({
  isOpen,
  onClose,
  classId,
}) => {
  const { students, classes, assignStudentToClass } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  
  const classData = classes.find(c => c.id === classId);
  
  if (!classData) {
    onClose();
    return null;
  }
  
  // Get students not in this class
  const availableStudents = students.filter(student => 
    student.classId !== classId &&
    (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.cpf.includes(searchTerm))
  );
  
  // Toggle student selection
  const toggleStudentSelection = (studentId: string) => {
    if (selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds(selectedStudentIds.filter(id => id !== studentId));
    } else {
      setSelectedStudentIds([...selectedStudentIds, studentId]);
    }
  };
  
  // Handle adding students
  const handleAddStudents = () => {
    selectedStudentIds.forEach(studentId => {
      assignStudentToClass(studentId, classId);
    });
    
    onClose();
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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={onClose}
            >
              <span className="sr-only">Fechar</span>
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-neutral-900">
                  Adicionar Alunos à Turma {classData.name}
                </h3>
                <p className="text-sm text-neutral-500 mt-1">
                  Selecione os alunos que deseja adicionar à esta turma.
                </p>
                
                {/* Search */}
                <div className="mt-4">
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Buscar alunos por nome ou CPF"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Students list */}
                <div className="mt-4 max-h-60 overflow-y-auto border border-neutral-200 rounded-md">
                  {availableStudents.length > 0 ? (
                    <ul className="divide-y divide-neutral-200">
                      {availableStudents.map((student) => (
                        <li 
                          key={student.id} 
                          className="px-4 py-3 hover:bg-neutral-50 cursor-pointer"
                          onClick={() => toggleStudentSelection(student.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                                checked={selectedStudentIds.includes(student.id)}
                                onChange={() => {}}
                              />
                              <div className="ml-3">
                                <p className="text-sm font-medium text-neutral-900">
                                  {student.name}
                                </p>
                                <p className="text-sm text-neutral-500">
                                  CPF: {student.cpf}
                                </p>
                              </div>
                            </div>
                            {selectedStudentIds.includes(student.id) && (
                              <Check className="h-5 w-5 text-primary-600" />
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-neutral-500">
                        {searchTerm
                          ? 'Nenhum aluno encontrado para os termos de busca'
                          : 'Não há alunos disponíveis para adicionar'}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Selected count */}
                {selectedStudentIds.length > 0 && (
                  <div className="mt-3 text-sm text-neutral-700">
                    {selectedStudentIds.length} aluno(s) selecionado(s)
                  </div>
                )}

                {/* Form actions */}
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    onClick={handleAddStudents}
                    disabled={selectedStudentIds.length === 0}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm ${
                      selectedStudentIds.length === 0 
                        ? 'bg-neutral-300 cursor-not-allowed' 
                        : 'bg-primary-600 hover:bg-primary-700'
                    }`}
                  >
                    Adicionar Selecionados
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={onClose}
                  >
                    Cancelar
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

export default AddStudentToClassModal;