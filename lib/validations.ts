import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number").optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string(),
  role: z.enum(["student", "parent"]),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const studentSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  roll_number: z.string().optional(),
  board: z.enum(["aku_eb", "sindh_board", "cambridge_o", "cambridge_a"]).optional(),
  grade: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  address: z.string().optional(),
  emergency_contact: z.string().optional(),
  branch_id: z.string().uuid().optional(),
  batch_id: z.string().uuid().optional(),
});

export const teacherSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  employee_id: z.string().optional(),
  specialization: z.array(z.string()).optional(),
  qualification: z.string().optional(),
  experience_years: z.coerce.number().min(0).optional(),
  bio: z.string().optional(),
  branch_id: z.string().uuid().optional(),
});

export const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  course_type: z.enum(["board", "special_program"]),
  board: z.enum(["aku_eb", "sindh_board", "cambridge_o", "cambridge_a"]).optional(),
  subject: z.enum([
    "mathematics", "physics", "chemistry", "biology",
    "computer_science", "english",
  ]).optional(),
  program: z.enum([
    "ai_web_development", "spoken_english", "programming_fundamentals",
    "freelancing", "entry_test_preparation",
  ]).optional(),
  teacher_id: z.string().uuid().optional(),
  branch_id: z.string().uuid().optional(),
  batch_id: z.string().uuid().optional(),
  fee_amount: z.coerce.number().min(0),
  duration_months: z.coerce.number().min(1).default(12),
  max_enrollments: z.coerce.number().min(1).default(50),
  is_published: z.boolean().default(false),
});

export const paymentSchema = z.object({
  student_id: z.string().uuid(),
  course_id: z.string().uuid().optional(),
  amount: z.coerce.number().min(0),
  paid_amount: z.coerce.number().min(0).default(0),
  method: z.enum(["cash", "bank_transfer", "jazzcash", "easypaisa", "card", "online"]).optional(),
  due_date: z.string(),
  notes: z.string().optional(),
});

export const assignmentSchema = z.object({
  course_id: z.string().uuid(),
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  instructions: z.string().optional(),
  max_marks: z.coerce.number().min(1).default(100),
  due_date: z.string(),
});

export const announcementSchema = z.object({
  title: z.string().min(3, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  branch_id: z.string().uuid().optional(),
  course_id: z.string().uuid().optional(),
  target_roles: z.array(z.enum(["admin", "teacher", "student", "parent"])).optional(),
  is_pinned: z.boolean().default(false),
});

export const branchSchema = z.object({
  name: z.string().min(2, "Branch name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export const batchSchema = z.object({
  name: z.string().min(2, "Batch name is required"),
  branch_id: z.string().uuid(),
  start_date: z.string(),
  end_date: z.string().optional(),
  max_students: z.coerce.number().min(1).default(30),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type StudentInput = z.infer<typeof studentSchema>;
export type TeacherInput = z.infer<typeof teacherSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type AssignmentInput = z.infer<typeof assignmentSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
export type BranchInput = z.infer<typeof branchSchema>;
export type BatchInput = z.infer<typeof batchSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
