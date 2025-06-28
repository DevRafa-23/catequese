import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppStore } from '../../store';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';
import { DocumentType } from '../../types';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  documentId?: string; // For editing existing document
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  studentId,
  documentId,
}) => {
  const { students, addDocument, updateDocument, currentUser } = useAppStore();
  
  // Find document if editing
  const student = students.find(s => s.id === studentId);
  const documentToEdit = documentId && student
    ? student.documents.find(d => d.id === documentId)
    : undefined;
  
  // Form state
  const [formData, setFormData] = useState({
    title: documentToEdit?.title || '',
    type: documentToEdit?.type || 'identification' as DocumentType,
    description: documentToEdit?.description || '',
    expiryDate: documentToEdit?.expiryDate || '',
    status: documentToEdit?.status || 'active' as 'active' | 'expired' | 'pending',
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
      
      // Clear error if it exists
      if (errors.file) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.file;
          return newErrors;
        });
      }
    }
  }, [errors]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 5242880, // 5MB
    maxFiles: 1,
  });
  
  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Document type options
  const documentTypeOptions = [
    { value: 'identification', label: 'Identificação' },
    { value: 'academic_record', label: 'Histórico Escolar' },
    { value: 'address_proof', label: 'Comprovante de Residência' },
    { value: 'health_record', label: 'Documentos de Saúde' },
    { value: 'enrollment_form', label: 'Matrícula' },
    { value: 'parent_authorization', label: 'Autorização dos Pais' },
    { value: 'other', label: 'Outros' },
  ];
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    
    if (!documentToEdit && !file) {
      newErrors.file = 'Arquivo é obrigatório';
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
    
    if (documentToEdit) {
      // Update existing document
      updateDocument(documentToEdit.id, {
        ...formData,
        description: formData.description || undefined,
        expiryDate: formData.expiryDate || undefined,
      });
    } else if (currentUser) {
      // Add new document
      addDocument({
        studentId,
        title: formData.title,
        type: formData.type as DocumentType,
        description: formData.description || undefined,
        expiryDate: formData.expiryDate || undefined,
        status: formData.status,
        file: file ? URL.createObjectURL(file) : '', // In a real app, this would be a server upload
        fileType: file ? file.type : 'application/pdf',
        uploadedBy: currentUser.id,
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
                  {documentToEdit ? 'Editar Documento' : 'Adicionar Documento'}
                </h3>
                
                <form onSubmit={handleSubmit} className="mt-4">
                  {/* Title */}
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-neutral-700">
                      Título do Documento *
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md ${
                        errors.title 
                          ? 'border-error-300 focus:border-error-500 focus:ring-error-500' 
                          : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-error-600">{errors.title}</p>
                    )}
                  </div>
                  
                  {/* Document Type */}
                  <div className="mb-4">
                    <label htmlFor="type" className="block text-sm font-medium text-neutral-700">
                      Tipo de Documento *
                    </label>
                    <select
                      name="type"
                      id="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                    >
                      {documentTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
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
                    />
                  </div>
                  
                  {/* Expiry Date */}
                  <div className="mb-4">
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-neutral-700">
                      Data de Expiração
                    </label>
                    <input
                      type="date"
                      name="expiryDate"
                      id="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                    />
                    <p className="mt-1 text-xs text-neutral-500">
                      Deixe em branco se o documento não expira
                    </p>
                  </div>
                  
                  {/* Status */}
                  <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-medium text-neutral-700">
                      Status *
                    </label>
                    <select
                      name="status"
                      id="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="active">Ativo</option>
                      <option value="pending">Pendente</option>
                      <option value="expired">Expirado</option>
                    </select>
                  </div>
                  
                  {/* File Upload */}
                  {!documentToEdit && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Arquivo *
                      </label>
                      <div 
                        {...getRootProps()} 
                        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md ${
                          isDragActive ? 'border-primary-500 bg-primary-50' : ''
                        } ${
                          errors.file ? 'border-error-300 bg-error-50' : ''
                        }`}
                      >
                        <input {...getInputProps()} />
                        <div className="space-y-1 text-center">
                          {filePreview ? (
                            <div className="flex flex-col items-center">
                              <img 
                                src={filePreview} 
                                alt="Preview" 
                                className="h-32 object-contain mb-2"
                              />
                              <p className="text-sm text-neutral-700">
                                {file?.name} - {(file?.size / 1024 / 1024).toFixed(2)}MB
                              </p>
                            </div>
                          ) : file ? (
                            <div className="flex flex-col items-center">
                              <FileText className="mx-auto h-12 w-12 text-neutral-400" />
                              <p className="text-sm text-neutral-700">
                                {file.name} - {(file.size / 1024 / 1024).toFixed(2)}MB
                              </p>
                            </div>
                          ) : (
                            <>
                              <Upload className="mx-auto h-12 w-12 text-neutral-400" />
                              <p className="text-sm text-neutral-500">
                                <span className="font-medium text-primary-600 hover:text-primary-500">
                                  Clique para selecionar um arquivo
                                </span>{' '}
                                ou arraste e solte
                              </p>
                              <p className="text-xs text-neutral-500">
                                PNG, JPG, PDF, DOC até 5MB
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      {errors.file && (
                        <p className="mt-1 text-sm text-error-600">{errors.file}</p>
                      )}
                    </div>
                  )}
                  
                  {/* Warning about mock functionality */}
                  <div className="mt-4 bg-warning-50 p-3 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-warning-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-warning-700">
                          Nota: Este é um sistema de demonstração. Os arquivos não serão realmente armazenados.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form actions */}
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                    >
                      {documentToEdit ? 'Salvar alterações' : 'Adicionar documento'}
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

export default DocumentUploadModal;