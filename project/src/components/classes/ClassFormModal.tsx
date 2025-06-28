import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { X } from 'lucide-react';

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId?: string;
}

const ClassFormModal: React.FC<ClassFormModalProps> = ({
  isOpen,
  onClose,
  classId,
}) => {
  const { classes, users, addClass, updateClass } = useAppStore();
  
  // Find class if editing
  const classToEdit = classId 
    ? classes.find(c => c.id === classId)
    : undefined;
  
  // Form state
  const [formData, setFormData] = useState({
    name: classToEdit?.name || '',
    gradeLevel: classToEdit?.gradeLevel || '',
    schoolYear: classToEdit?.schoolYear || new Date().getFullYear().toString(),
    teacherId: classToEdit?.teacherId || '',
    description: classToEdit?.description || '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Get teachers
  const teachers = users.filter(user => user.role === 'teacher');
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.gradeLevel.trim()) {
      newErrors.gradeLevel = 'Nível de ensino é obrigatório';
    }
    
    if (!formData.schoolYear.trim()) {
      newErrors.schoolYear = 'Ano letivo é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (classToEdit) {
      // Update existing class
      updateClass(classToEdit.id, {
        ...formData,
        // Convert empty strings to undefined for optional fields
        teacherId: formData.teacherId || undefined,
        description: formData.description || undefined,
      });
    } else {
      // Add new class
      addClass({
        ...formData,
        // Convert empty strings to undefined for optional fields
        teacherId: formData.teacherId || undefined,
        description: formData.description || undefined,
      });
    }
    
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
                  {classToEdit ? 'Editar Turma' : 'Adicionar Nova Turma'}
                </h3>
                
                <form onSubmit={handleSubmit} className="mt-4">
                  {/* Name */}
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                      Nome da Turma *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md ${
                        errors.name 
                          ? 'border-error-300 focus:border-error-500 focus:ring-error-500' 
                          : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                      placeholder="Ex: Turma 1A"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-error-600">{errors.name}</p>
                    )}
                  </div>
                  
                  {/* Grade Level */}
                  <div className="mb-4">
                    <label htmlFor="gradeLevel" className="block text-sm font-medium text-neutral-700">
                      Nível de Ensino *
                    </label>
                    <input
                      type="text"
                      name="gradeLevel"
                      id="gradeLevel"
                      value={formData.gradeLevel}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md ${
                        errors.gradeLevel 
                          ? 'border-error-300 focus:border-error-500 focus:ring-error-500' 
                          : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                      placeholder="Ex: Ensino Médio"
                    />
                    {errors.gradeLevel && (
                      <p className="mt-1 text-sm text-error-600">{errors.gradeLevel}</p>
                    )}
                  </div>
                  
                  {/* School Year */}
                  <div className="mb-4">
                    <label htmlFor="schoolYear" className="block text-sm font-medium text-neutral-700">
                      Ano Letivo *
                    </label>
                    <input
                      type="text"
                      name="schoolYear"
                      id="schoolYear"
                      value={formData.schoolYear}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md ${
                        errors.schoolYear 
                          ? 'border-error-300 focus:border-error-500 focus:ring-error-500' 
                          : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                      placeholder="Ex: 2025"
                    />
                    {errors.schoolYear && (
                      <p className="mt-1 text-sm text-error-600">{errors.schoolYear}</p>
                    )}
                  </div>
                  
                  {/* Teacher */}
                  <div className="mb-4">
                    <label htmlFor="teacherId" className="block text-sm font-medium text-neutral-700">
                      Professor Responsável
                    </label>
                    <select
                      name="teacherId"
                      id="teacherId"
                      value={formData.teacherId}
                      onChange={handleChange}
                      className="mt-1 block w-full py-2 px-3 border border-neutral-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Selecione um professor</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Description */}
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
                      Descrição
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Descrição opcional da turma"
                    />
                  </div>

                  {/* Form actions */}
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                    >
                      {classToEdit ? 'Salvar alterações' : 'Adicionar turma'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      onClick={onClose}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassFormModal;