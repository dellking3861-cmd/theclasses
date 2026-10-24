const API_BASE = typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}/api/admin${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const adminApi = {
  // Students
  getStudents: (params?: { page?: number; pageSize?: number; search?: string; branchId?: string; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.branchId) searchParams.append('branchId', params.branchId);
    if (params?.status) searchParams.append('status', params.status);
    return fetchApi<{ data: any[]; total: number; page: number; pageSize: number }>(`/students?${searchParams.toString()}`);
  },

  createStudent: (data: any) => fetchApi('/students', { method: 'POST', body: JSON.stringify(data) }),
  updateStudent: (id: string, data: any) => fetchApi(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStudent: (id: string) => fetchApi(`/students/${id}`, { method: 'DELETE' }),

  // Teachers
  getTeachers: (params?: { page?: number; pageSize?: number; search?: string; branchId?: string; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.branchId) searchParams.append('branchId', params.branchId);
    if (params?.status) searchParams.append('status', params.status);
    return fetchApi<{ data: any[]; total: number; page: number; pageSize: number }>(`/teachers?${searchParams.toString()}`);
  },

  createTeacher: (data: any) => fetchApi('/teachers', { method: 'POST', body: JSON.stringify(data) }),
  updateTeacher: (id: string, data: any) => fetchApi(`/teachers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTeacher: (id: string) => fetchApi(`/teachers/${id}`, { method: 'DELETE' }),

  // Courses
  getCourses: (params?: { page?: number; pageSize?: number; search?: string; status?: string; branchId?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.branchId) searchParams.append('branchId', params.branchId);
    return fetchApi<{ data: any[]; total: number; page: number; pageSize: number }>(`/courses?${searchParams.toString()}`);
  },

  createCourse: (data: any) => fetchApi('/courses', { method: 'POST', body: JSON.stringify(data) }),
  updateCourse: (id: string, data: any) => fetchApi(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCourse: (id: string) => fetchApi(`/courses/${id}`, { method: 'DELETE' }),

  // Payments
  getPayments: (params?: { page?: number; pageSize?: number; search?: string; status?: string; studentId?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.studentId) searchParams.append('studentId', params.studentId);
    return fetchApi<{ data: any[]; total: number; page: number; pageSize: number }>(`/payments?${searchParams.toString()}`);
  },

  createPayment: (data: any) => fetchApi('/payments', { method: 'POST', body: JSON.stringify(data) }),
  updatePayment: (id: string, data: any) => fetchApi(`/payments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePayment: (id: string) => fetchApi(`/payments/${id}`, { method: 'DELETE' }),

  // Attendance
  getAttendance: (params?: { page?: number; pageSize?: number; search?: string; courseId?: string; studentId?: string; date?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.courseId) searchParams.append('courseId', params.courseId);
    if (params?.studentId) searchParams.append('studentId', params.studentId);
    if (params?.date) searchParams.append('date', params.date);
    return fetchApi<{ data: any[]; total: number; page: number; pageSize: number }>(`/attendance?${searchParams.toString()}`);
  },

  createAttendance: (data: any) => fetchApi('/attendance', { method: 'POST', body: JSON.stringify(data) }),
  updateAttendance: (id: string, data: any) => fetchApi(`/attendance/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAttendance: (id: string) => fetchApi(`/attendance/${id}`, { method: 'DELETE' }),

  // Exams
  getExams: (params?: { page?: number; pageSize?: number; search?: string; status?: string; courseId?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.courseId) searchParams.append('courseId', params.courseId);
    return fetchApi<{ data: any[]; total: number; page: number; pageSize: number }>(`/exams?${searchParams.toString()}`);
  },

  createExam: (data: any) => fetchApi('/exams', { method: 'POST', body: JSON.stringify(data) }),
  updateExam: (id: string, data: any) => fetchApi(`/exams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExam: (id: string) => fetchApi(`/exams/${id}`, { method: 'DELETE' }),

  // Assignments
  getAssignments: (params?: { page?: number; pageSize?: number; search?: string; courseId?: string; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.courseId) searchParams.append('courseId', params.courseId);
    if (params?.status) searchParams.append('status', params.status);
    return fetchApi<{ data: any[]; total: number; page: number; pageSize: number }>(`/assignments?${searchParams.toString()}`);
  },

  createAssignment: (data: any) => fetchApi('/assignments', { method: 'POST', body: JSON.stringify(data) }),
  updateAssignment: (id: string, data: any) => fetchApi(`/assignments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAssignment: (id: string) => fetchApi(`/assignments/${id}`, { method: 'DELETE' }),

  // Announcements
  getAnnouncements: (params?: { page?: number; pageSize?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.search) searchParams.append('search', params.search);
    return fetchApi<{ data: any[]; total: number; page: number; pageSize: number }>(`/announcements?${searchParams.toString()}`);
  },

  createAnnouncement: (data: any) => fetchApi('/announcements', { method: 'POST', body: JSON.stringify(data) }),
  updateAnnouncement: (id: string, data: any) => fetchApi(`/announcements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAnnouncement: (id: string) => fetchApi(`/announcements/${id}`, { method: 'DELETE' }),

  // Batches
  getBatches: (params?: { page?: number; pageSize?: number; search?: string; branchId?: string; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.branchId) searchParams.append('branchId', params.branchId);
    if (params?.status) searchParams.append('status', params.status);
    return fetchApi<{ data: any[]; total: number; page: number; pageSize: number }>(`/batches?${searchParams.toString()}`);
  },

  createBatch: (data: any) => fetchApi('/batches', { method: 'POST', body: JSON.stringify(data) }),
  updateBatch: (id: string, data: any) => fetchApi(`/batches/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBatch: (id: string) => fetchApi(`/batches/${id}`, { method: 'DELETE' }),

  // Branches
  getBranches: (params?: { page?: number; pageSize?: number; search?: string; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    return fetchApi<{ data: any[]; total: number; page: number; pageSize: number }>(`/branches?${searchParams.toString()}`);
  },

  createBranch: (data: any) => fetchApi('/branches', { method: 'POST', body: JSON.stringify(data) }),
  updateBranch: (id: string, data: any) => fetchApi(`/branches/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBranch: (id: string) => fetchApi(`/branches/${id}`, { method: 'DELETE' }),

  // Fees (Payments)
  getFees: (params?: { page?: number; pageSize?: number; search?: string; studentId?: string; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.studentId) searchParams.append('studentId', params.studentId);
    if (params?.status) searchParams.append('status', params.status);
    return fetchApi<{ data: any[]; total: number; page: number; pageSize: number }>(`/fees?${searchParams.toString()}`);
  },

  createFee: (data: any) => fetchApi('/fees', { method: 'POST', body: JSON.stringify(data) }),
  updateFee: (id: string, data: any) => fetchApi(`/fees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFee: (id: string) => fetchApi(`/fees/${id}`, { method: 'DELETE' }),

  // Parents
  getParents: (params?: { page?: number; pageSize?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.search) searchParams.append('search', params.search);
    return fetchApi<{ data: any[]; total: number; page: number; pageSize: number }>(`/parents?${searchParams.toString()}`);
  },

  createParent: (data: any) => fetchApi('/parents', { method: 'POST', body: JSON.stringify(data) }),
  updateParent: (id: string, data: any) => fetchApi(`/parents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteParent: (id: string) => fetchApi(`/parents/${id}`, { method: 'DELETE' }),
};