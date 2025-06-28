import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { User, Student, Document, Class, AuditLog, DocumentType } from '../types';

interface AppState {
  // Authentication
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Data
  students: Student[];
  classes: Class[];
  users: User[];
  auditLogs: AuditLog[];
  
  // UI State
  isLoading: boolean;
  searchQuery: string;
  activeView: 'students' | 'classes' | 'documents' | 'settings';
  selectedStudentId: string | null;
  selectedClassId: string | null;
  
  // Mock Auth Actions
  login: (email: string, password: string) => void;
  logout: () => void;
  
  // Student Actions
  addStudent: (student: Omit<Student, 'id' | 'documents'>) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  
  // Document Actions
  addDocument: (document: Omit<Document, 'id' | 'uploadDate'>) => void;
  updateDocument: (id: string, data: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  
  // Class Actions
  addClass: (classData: Omit<Class, 'id' | 'students'>) => void;
  updateClass: (id: string, data: Partial<Class>) => void;
  deleteClass: (id: string) => void;
  
  // Student Class Assignment
  assignStudentToClass: (studentId: string, classId: string) => void;
  removeStudentFromClass: (studentId: string, classId: string) => void;
  
  // UI Actions
  setSearchQuery: (query: string) => void;
  setActiveView: (view: 'students' | 'classes' | 'documents' | 'settings') => void;
  setSelectedStudentId: (id: string | null) => void;
  setSelectedClassId: (id: string | null) => void;
  
  // Audit Logging
  logAction: (
    userId: string,
    action: 'create' | 'view' | 'update' | 'delete' | 'download',
    resourceType: 'student' | 'document' | 'class',
    resourceId: string,
    details?: string
  ) => void;
}

// Mock data for initial state
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@escola.edu',
    role: 'admin',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Teacher User',
    email: 'teacher@escola.edu',
    role: 'teacher',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: '3',
    name: 'Secretary User',
    email: 'secretary@escola.edu',
    role: 'secretary',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
  }
];

const mockClasses: Class[] = [
  {
    id: '1',
    name: 'Turma 1A',
    gradeLevel: 'Ensino Médio',
    schoolYear: '2025',
    teacherId: '2',
    students: ['1', '2'],
    description: 'Turma de Ensino Médio - Período Matutino',
  },
  {
    id: '2',
    name: 'Turma 5B',
    gradeLevel: 'Ensino Fundamental',
    schoolYear: '2025',
    teacherId: '2',
    students: ['3'],
    description: 'Turma de Ensino Fundamental - Período Vespertino',
  }
];

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'João Silva',
    cpf: '123.456.789-00',
    dateOfBirth: '2007-05-15',
    address: 'Rua das Flores, 123',
    phoneNumber: '(11) 99999-8888',
    email: 'joao.silva@email.com',
    guardianName: 'Maria Silva',
    guardianContact: '(11) 99999-7777',
    enrollmentDate: '2023-01-15',
    classId: '1',
    documents: [
      {
        id: '1',
        studentId: '1',
        title: 'RG',
        type: 'identification',
        file: '/mock-files/rg.pdf',
        fileType: 'application/pdf',
        uploadDate: '2023-01-15',
        status: 'active',
        uploadedBy: '3',
      },
      {
        id: '2',
        studentId: '1',
        title: 'Histórico Escolar',
        type: 'academic_record',
        file: '/mock-files/historico.pdf',
        fileType: 'application/pdf',
        uploadDate: '2023-01-15',
        status: 'active',
        uploadedBy: '3',
      }
    ],
  },
  {
    id: '2',
    name: 'Ana Oliveira',
    cpf: '987.654.321-00',
    dateOfBirth: '2006-09-20',
    address: 'Avenida Principal, 456',
    phoneNumber: '(11) 99999-6666',
    email: 'ana.oliveira@email.com',
    guardianName: 'Carlos Oliveira',
    guardianContact: '(11) 99999-5555',
    enrollmentDate: '2023-01-10',
    classId: '1',
    documents: [
      {
        id: '3',
        studentId: '2',
        title: 'Certidão de Nascimento',
        type: 'identification',
        file: '/mock-files/certidao.pdf',
        fileType: 'application/pdf',
        uploadDate: '2023-01-10',
        status: 'active',
        uploadedBy: '3',
      }
    ],
  },
  {
    id: '3',
    name: 'Pedro Santos',
    cpf: '456.789.123-00',
    dateOfBirth: '2013-03-10',
    address: 'Rua dos Pinheiros, 789',
    phoneNumber: '(11) 99999-4444',
    email: 'pedro.santos@email.com',
    guardianName: 'Lucia Santos',
    guardianContact: '(11) 99999-3333',
    enrollmentDate: '2023-01-20',
    classId: '2',
    documents: [
      {
        id: '4',
        studentId: '3',
        title: 'Comprovante de Residência',
        type: 'address_proof',
        file: '/mock-files/comprovante.pdf',
        fileType: 'application/pdf',
        uploadDate: '2023-01-20',
        status: 'active',
        uploadedBy: '3',
      },
      {
        id: '5',
        studentId: '3',
        title: 'Carteira de Vacinação',
        type: 'health_record',
        file: '/mock-files/vacinacao.pdf',
        fileType: 'application/pdf',
        uploadDate: '2023-01-20',
        status: 'active',
        uploadedBy: '3',
      }
    ],
  }
];

// Initial mock audit logs
const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    userId: '3',
    action: 'create',
    resourceType: 'student',
    resourceId: '1',
    timestamp: '2023-01-15T10:30:00Z',
    details: 'Cadastro inicial do aluno',
  },
  {
    id: '2',
    userId: '3',
    action: 'create',
    resourceType: 'document',
    resourceId: '1',
    timestamp: '2023-01-15T10:35:00Z',
    details: 'Upload de documento de identificação',
  }
];

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  currentUser: null,
  isAuthenticated: false,
  students: mockStudents,
  classes: mockClasses,
  users: mockUsers,
  auditLogs: mockAuditLogs,
  isLoading: false,
  searchQuery: '',
  activeView: 'students',
  selectedStudentId: null,
  selectedClassId: null,
  
  // Auth actions
  login: (email: string, password: string) => {
    // Mock login - find user by email and set as current user
    const user = get().users.find(u => u.email === email);
    if (user) {
      set({ currentUser: user, isAuthenticated: true });
    }
  },
  
  logout: () => {
    set({ currentUser: null, isAuthenticated: false });
  },
  
  // Student actions
  addStudent: (studentData) => {
    const newStudent: Student = {
      id: uuidv4(),
      ...studentData,
      documents: [],
    };
    
    set(state => ({ 
      students: [...state.students, newStudent]
    }));
    
    // Log action
    const { logAction, currentUser } = get();
    if (currentUser) {
      logAction(currentUser.id, 'create', 'student', newStudent.id);
    }
  },
  
  updateStudent: (id, data) => {
    set(state => ({
      students: state.students.map(student => 
        student.id === id ? { ...student, ...data } : student
      )
    }));
    
    // Log action
    const { logAction, currentUser } = get();
    if (currentUser) {
      logAction(currentUser.id, 'update', 'student', id);
    }
  },
  
  deleteStudent: (id) => {
    set(state => ({
      students: state.students.filter(student => student.id !== id),
      classes: state.classes.map(cls => ({
        ...cls,
        students: cls.students.filter(studentId => studentId !== id)
      }))
    }));
    
    // Log action
    const { logAction, currentUser } = get();
    if (currentUser) {
      logAction(currentUser.id, 'delete', 'student', id);
    }
  },
  
  // Document actions
  addDocument: (documentData) => {
    const newDocument: Document = {
      id: uuidv4(),
      uploadDate: new Date().toISOString(),
      ...documentData,
    };
    
    set(state => ({
      students: state.students.map(student => 
        student.id === documentData.studentId 
          ? { ...student, documents: [...student.documents, newDocument] } 
          : student
      )
    }));
    
    // Log action
    const { logAction, currentUser } = get();
    if (currentUser) {
      logAction(currentUser.id, 'create', 'document', newDocument.id);
    }
  },
  
  updateDocument: (id, data) => {
    set(state => ({
      students: state.students.map(student => ({
        ...student,
        documents: student.documents.map(doc => 
          doc.id === id ? { ...doc, ...data } : doc
        )
      }))
    }));
    
    // Log action
    const { logAction, currentUser } = get();
    if (currentUser) {
      logAction(currentUser.id, 'update', 'document', id);
    }
  },
  
  deleteDocument: (id) => {
    set(state => ({
      students: state.students.map(student => ({
        ...student,
        documents: student.documents.filter(doc => doc.id !== id)
      }))
    }));
    
    // Log action
    const { logAction, currentUser } = get();
    if (currentUser) {
      logAction(currentUser.id, 'delete', 'document', id);
    }
  },
  
  // Class actions
  addClass: (classData) => {
    const newClass: Class = {
      id: uuidv4(),
      students: [],
      ...classData,
    };
    
    set(state => ({ 
      classes: [...state.classes, newClass] 
    }));
    
    // Log action
    const { logAction, currentUser } = get();
    if (currentUser) {
      logAction(currentUser.id, 'create', 'class', newClass.id);
    }
  },
  
  updateClass: (id, data) => {
    set(state => ({
      classes: state.classes.map(cls => 
        cls.id === id ? { ...cls, ...data } : cls
      )
    }));
    
    // Log action
    const { logAction, currentUser } = get();
    if (currentUser) {
      logAction(currentUser.id, 'update', 'class', id);
    }
  },
  
  deleteClass: (id) => {
    set(state => ({
      classes: state.classes.filter(cls => cls.id !== id),
      students: state.students.map(student => 
        student.classId === id 
          ? { ...student, classId: undefined } 
          : student
      )
    }));
    
    // Log action
    const { logAction, currentUser } = get();
    if (currentUser) {
      logAction(currentUser.id, 'delete', 'class', id);
    }
  },
  
  // Student Class Assignment
  assignStudentToClass: (studentId, classId) => {
    set(state => {
      // Update the student's classId
      const updatedStudents = state.students.map(student =>
        student.id === studentId ? { ...student, classId } : student
      );
      
      // Add student to the class's students array if not already there
      const updatedClasses = state.classes.map(cls => {
        if (cls.id === classId && !cls.students.includes(studentId)) {
          return { ...cls, students: [...cls.students, studentId] };
        }
        return cls;
      });
      
      return { students: updatedStudents, classes: updatedClasses };
    });
    
    // Log action
    const { logAction, currentUser } = get();
    if (currentUser) {
      logAction(
        currentUser.id, 
        'update', 
        'student', 
        studentId, 
        `Assigned to class ${classId}`
      );
    }
  },
  
  removeStudentFromClass: (studentId, classId) => {
    set(state => {
      // Remove classId from student
      const updatedStudents = state.students.map(student =>
        student.id === studentId ? { ...student, classId: undefined } : student
      );
      
      // Remove student from class's students array
      const updatedClasses = state.classes.map(cls => {
        if (cls.id === classId) {
          return { 
            ...cls, 
            students: cls.students.filter(id => id !== studentId) 
          };
        }
        return cls;
      });
      
      return { students: updatedStudents, classes: updatedClasses };
    });
    
    // Log action
    const { logAction, currentUser } = get();
    if (currentUser) {
      logAction(
        currentUser.id, 
        'update', 
        'student', 
        studentId, 
        `Removed from class ${classId}`
      );
    }
  },
  
  // UI Actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveView: (view) => set({ activeView: view }),
  setSelectedStudentId: (id) => set({ selectedStudentId: id }),
  setSelectedClassId: (id) => set({ selectedClassId: id }),
  
  // Audit Logging
  logAction: (userId, action, resourceType, resourceId, details) => {
    const newLog: AuditLog = {
      id: uuidv4(),
      userId,
      action,
      resourceType,
      resourceId,
      timestamp: new Date().toISOString(),
      details,
    };
    
    set(state => ({
      auditLogs: [newLog, ...state.auditLogs]
    }));
  },
}));