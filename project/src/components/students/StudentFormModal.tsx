import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { X } from 'lucide-react';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId?: string;
}

const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  studentId,
}) => {
  const { students, classes, addStudent, updateStudent } = useAppStore();
  
  // Find student if editing
  const studentToEdit = studentId 
    ? students.find(s => s.id === studentId)
    : undefined;
  
  // Form state
  const [formData, setFormData] = useState({
    name: studentToEdit?.name || '',
    cpf: studentToEdit?.cpf || '',
    dateOfBirth: studentToEdit?.dateOfBirth || '',
    address: studentToEdit?.address || '',
    phoneNumber: studentToEdit?.phoneNumber || '',
    email: studentToEdit?.email || '',
    guardianName: studentToEdit?.guardianName || '',
    guardianContact: studentToEdit?.guardianContact || '',
    classId: studentToEdit?.classId || '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      newErrors.cpf = 'CPF deve estar no formato 000.000.000-00';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Data de nascimento é obrigatória';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }
    
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
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
    
    if (studentToEdit) {
      // Update existing student
      updateStudent(studentToEdit.id, {
        ...formData,
        // Convert empty strings to undefined for optional fields
        phoneNumber: formData.phoneNumber || undefined,
        email: formData.email || undefined,
        guardianName: formData.guardianName || undefined,
        guardianContact: formData.guardianContact || undefined,
        classId: formData.classId || undefined,
      });
    } else {
      // Add new student
      addStudent({
        ...formData,
        // Convert empty strings to undefined for optional fields
        phoneNumber: formData.phoneNumber || undefined,
        email: formData.email || undefined,
        guardianName: formData.guardianName || undefined,
        guardianContact: formData.guardianContact || undefined,
        classId: formData.classId || undefined,
        enrollmentDate: new Date().toISOString(),
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
                  {studentToEdit ? 'Editar Aluno' : 'Adicionar Novo Aluno'}
                </h3>
                
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                        Nome Completo *
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
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-error-600">{errors.name}</p>
                      )}
                    </div>
                    
                    {/* CPF */}
                    <div>
                      <label htmlFor="cpf" className="block text-sm font-medium text-neutral-700">
                        CPF *
                      </label>
                      <input
                        type="text"
                        name="cpf"
                        id="cpf"
                        value={formData.cpf}
                        onChange={handleChange}
                        placeholder="000.000.000-00"
                        className={`mt-1 block w-full rounded-md ${
                          errors.cpf 
                            ? 'border-error-300 focus:border-error-500 focus:ring-error-500' 
                            : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                      />
                      {errors.cpf && (
                        <p className="mt-1 text-sm text-error-600">{errors.cpf}</p>
                      )}
                    </div>
                    
                    {/* Date of Birth */}
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-neutral-700">
                        Data de Nascimento *
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        id="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md ${
                          errors.dateOfBirth 
                            ? 'border-error-300 focus:border-error-500 focus:ring-error-500' 
                            : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                      />
                      {errors.dateOfBirth && (
                        <p className="mt-1 text-sm text-error-600">{errors.dateOfBirth}</p>
                      )}
                    </div>
                    
                    {/* Address */}
                    <div className="col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-neutral-700">
                        Endereço *
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md ${
                          errors.address 
                            ? 'border-error-300 focus:border-error-500 focus:ring-error-500' 
                            : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-error-600">{errors.address}</p>
                      )}
                    </div>
                    
                    {/* Phone Number */}
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-neutral-700">
                        Telefone
                      </label>
                      <input
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="(00) 00000-0000"
                        className={`mt-1 block w-full rounded-md border-neutral-300 focus:border-primary-500 focus:ring-primary-500`}
                      />
                    </div>
                    
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md ${
                          errors.email 
                            ? 'border-error-300 focus:border-error-500 focus:ring-error-500' 
                            : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-error-600">{errors.email}</p>
                      )}
                    </div>
                    
                    {/* Guardian Name */}
                    <div>
                      <label htmlFor="guardianName" className="block text-sm font-medium text-neutral-700">
                        Nome do Responsável
                      </label>
                      <input
                        type="text"
                        name="guardianName"
                        id="guardianName"
                        value={formData.guardianName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    
                    {/* Guardian Contact */}
                    <div>
                      <label htmlFor="guardianContact" className="block text-sm font-medium text-neutral-700">
                        Contato do Responsável
                      </label>
                      <input
                        type="text"
                        name="guardianContact"
                        id="guardianContact"
                        value={formData.guardianContact}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    
                    {/* Class */}
                    <div className="col-span-2">
                      <label htmlFor="classId" className="block text-sm font-medium text-neutral-700">
                        Turma
                      </label>
                      <select
                        name="classId"
                        id="classId"
                        value={formData.classId}
                        onChange={handleChange}
                        className="mt-1 block w-full py-2 px-3 border border-neutral-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Selecione uma turma</option>
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name} - {cls.gradeLevel}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Form actions */}
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                    >
                      {studentToEdit ? 'Salvar alterações' : 'Adicionar aluno'}
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

export default StudentFormModal;