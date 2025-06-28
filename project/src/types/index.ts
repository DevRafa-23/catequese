export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'secretary';
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  cpf: string;
  dateOfBirth: string;
  address: string;
  phoneNumber?: string;
  email?: string;
  guardianName?: string;
  guardianContact?: string;
  enrollmentDate: string;
  classId?: string;
  documents: Document[];
}

export interface Document {
  id: string;
  studentId: string;
  title: string;
  type: DocumentType;
  file: string;
  fileType: string;
  uploadDate: string;
  description?: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'pending';
  uploadedBy: string;
}

export type DocumentType = 
  | 'identification'
  | 'academic_record'
  | 'address_proof'
  | 'health_record'
  | 'enrollment_form'
  | 'parent_authorization'
  | 'other';

export interface Class {
  id: string;
  name: string;
  gradeLevel: string;
  schoolYear: string;
  teacherId?: string;
  students: string[]; // Student IDs
  description?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: 'create' | 'view' | 'update' | 'delete' | 'download';
  resourceType: 'student' | 'document' | 'class';
  resourceId: string;
  timestamp: string;
  details?: string;
}