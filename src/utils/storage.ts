export const getStudentId = (): string | null => {
  return sessionStorage.getItem('studentId');
};

export const setStudentId = (id: string): void => {
  sessionStorage.setItem('studentId', id);
};

export const getStudentName = (): string | null => {
  return sessionStorage.getItem('studentName');
};

export const setStudentName = (name: string): void => {
  sessionStorage.setItem('studentName', name);
};

export const generateStudentId = (): string => {
  return `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};