/**
 * AI Service Architecture
 * Prepared for future AI integration with OpenAI/Anthropic APIs
 */

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

export interface AIChatSession {
  id: string;
  userId: string;
  module: AIModule;
  messages: AIMessage[];
  context?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type AIModule =
  | "tutor"
  | "quiz_generator"
  | "homework_checker"
  | "speaking_practice"
  | "study_planner"
  | "note_generator";

export interface AIQuizRequest {
  subject: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  questionCount: number;
  questionTypes?: ("mcq" | "short_answer" | "true_false")[];
}

export interface AIQuizQuestion {
  id: string;
  question: string;
  type: "mcq" | "short_answer" | "true_false";
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  marks: number;
}

export interface AIHomeworkCheckRequest {
  assignmentId: string;
  submissionContent: string;
  rubric?: string;
}

export interface AIHomeworkCheckResult {
  score: number;
  maxScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}

export interface AIStudyPlanRequest {
  studentId: string;
  subjects: string[];
  examDate?: string;
  hoursPerDay: number;
  weakAreas?: string[];
}

export interface AIStudyPlan {
  id: string;
  title: string;
  duration: string;
  dailySchedule: {
    day: number;
    date: string;
    tasks: {
      subject: string;
      topic: string;
      duration: number;
      type: "study" | "practice" | "review" | "test";
    }[];
  }[];
}

export interface AISpeakingPracticeRequest {
  topic: string;
  level: "beginner" | "intermediate" | "advanced";
  durationMinutes: number;
}

export interface AISpeakingFeedback {
  fluencyScore: number;
  pronunciationScore: number;
  grammarScore: number;
  vocabularyScore: number;
  overallScore: number;
  feedback: string;
  corrections: { original: string; corrected: string; explanation: string }[];
}

export interface AINoteGeneratorRequest {
  subject: string;
  topic: string;
  board?: string;
  detailLevel: "summary" | "detailed" | "comprehensive";
}

export interface AIGeneratedNotes {
  title: string;
  content: string;
  keyPoints: string[];
  formulas?: string[];
  examples?: { question: string; solution: string }[];
}

export interface AIServiceConfig {
  provider: "openai" | "anthropic" | "custom";
  model: string;
  maxTokens: number;
  temperature: number;
}

const DEFAULT_CONFIG: AIServiceConfig = {
  provider: "openai",
  model: "gpt-4o",
  maxTokens: 4096,
  temperature: 0.7,
};

abstract class BaseAIService {
  protected config: AIServiceConfig;

  constructor(config: Partial<AIServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  protected abstract callAI(
    systemPrompt: string,
    userPrompt: string,
    context?: Record<string, unknown>
  ): Promise<string>;

  protected buildSystemPrompt(module: AIModule): string {
    const prompts: Record<AIModule, string> = {
      tutor: `You are an expert AI tutor for The Classes, a Pakistan-based educational platform. 
        Help students understand concepts clearly, provide step-by-step explanations, 
        and adapt to their learning level. Support AKU-EB, Sindh Board, and Cambridge curricula.`,
      quiz_generator: `You are an expert quiz generator for The Classes educational platform.
        Generate accurate, curriculum-aligned questions with clear correct answers and explanations.`,
      homework_checker: `You are an expert homework evaluator for The Classes.
        Provide constructive feedback, identify strengths and areas for improvement,
        and suggest specific ways to improve.`,
      speaking_practice: `You are an English speaking coach for The Classes.
        Help students improve fluency, pronunciation, grammar, and vocabulary.
        Provide encouraging, actionable feedback.`,
      study_planner: `You are a study planning expert for The Classes.
        Create realistic, effective study schedules based on exam dates, 
        subject priorities, and available study time.`,
      note_generator: `You are an expert note generator for The Classes.
        Create clear, comprehensive study notes aligned with Pakistani board curricula.`,
    };
    return prompts[module];
  }
}

export class AITutorService extends BaseAIService {
  async chat(
    message: string,
    sessionHistory: AIMessage[] = [],
    context?: { subject?: string; topic?: string; grade?: string }
  ): Promise<AIMessage> {
    const systemPrompt = this.buildSystemPrompt("tutor");
    const contextStr = context
      ? `\nContext: Subject: ${context.subject || "General"}, Topic: ${context.topic || "Any"}, Grade: ${context.grade || "Unknown"}`
      : "";

    const historyStr = sessionHistory
      .slice(-10)
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    const response = await this.callAI(
      systemPrompt + contextStr,
      `${historyStr}\nuser: ${message}`
    );

    return { role: "assistant", content: response, timestamp: new Date().toISOString() };
  }

  protected async callAI(
    systemPrompt: string,
    userPrompt: string
  ): Promise<string> {
    // Integration point for OpenAI/Anthropic API
    // Requires AI_API_KEY environment variable
    if (!process.env.AI_API_KEY) {
      return "AI Tutor is being configured. Please check back soon for personalized tutoring assistance.";
    }
    throw new Error("AI provider not yet configured. Set AI_API_KEY in environment.");
  }
}

export class AIQuizGeneratorService extends BaseAIService {
  async generateQuiz(request: AIQuizRequest): Promise<AIQuizQuestion[]> {
    const systemPrompt = this.buildSystemPrompt("quiz_generator");
    const userPrompt = `Generate ${request.questionCount} ${request.difficulty} level questions on ${request.subject}: ${request.topic}`;

    await this.callAI(systemPrompt, userPrompt);

    return [];
  }

  protected async callAI(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!process.env.AI_API_KEY) {
      throw new Error("AI service not configured");
    }
    throw new Error("AI provider not yet configured");
  }
}

export class AIHomeworkCheckerService extends BaseAIService {
  async checkHomework(request: AIHomeworkCheckRequest): Promise<AIHomeworkCheckResult> {
    const systemPrompt = this.buildSystemPrompt("homework_checker");
    await this.callAI(systemPrompt, request.submissionContent);

    return {
      score: 0,
      maxScore: 100,
      feedback: "AI homework checking is being configured.",
      strengths: [],
      improvements: [],
      suggestions: [],
    };
  }

  protected async callAI(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!process.env.AI_API_KEY) throw new Error("AI service not configured");
    throw new Error("AI provider not yet configured");
  }
}

export class AIStudyPlannerService extends BaseAIService {
  async generatePlan(request: AIStudyPlanRequest): Promise<AIStudyPlan> {
    const systemPrompt = this.buildSystemPrompt("study_planner");
    await this.callAI(systemPrompt, JSON.stringify(request));

    return {
      id: crypto.randomUUID(),
      title: "Study Plan",
      duration: "4 weeks",
      dailySchedule: [],
    };
  }

  protected async callAI(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!process.env.AI_API_KEY) throw new Error("AI service not configured");
    throw new Error("AI provider not yet configured");
  }
}

export class AISpeakingPracticeService extends BaseAIService {
  async evaluateSpeaking(transcript: string, request: AISpeakingPracticeRequest): Promise<AISpeakingFeedback> {
    const systemPrompt = this.buildSystemPrompt("speaking_practice");
    await this.callAI(systemPrompt, transcript);

    return {
      fluencyScore: 0,
      pronunciationScore: 0,
      grammarScore: 0,
      vocabularyScore: 0,
      overallScore: 0,
      feedback: "AI speaking practice is being configured.",
      corrections: [],
    };
  }

  protected async callAI(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!process.env.AI_API_KEY) throw new Error("AI service not configured");
    throw new Error("AI provider not yet configured");
  }
}

export class AINoteGeneratorService extends BaseAIService {
  async generateNotes(request: AINoteGeneratorRequest): Promise<AIGeneratedNotes> {
    const systemPrompt = this.buildSystemPrompt("note_generator");
    await this.callAI(systemPrompt, `${request.subject}: ${request.topic}`);

    return {
      title: request.topic,
      content: "AI note generation is being configured.",
      keyPoints: [],
    };
  }

  protected async callAI(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!process.env.AI_API_KEY) throw new Error("AI service not configured");
    throw new Error("AI provider not yet configured");
  }
}

export const aiServices = {
  tutor: new AITutorService(),
  quizGenerator: new AIQuizGeneratorService(),
  homeworkChecker: new AIHomeworkCheckerService(),
  studyPlanner: new AIStudyPlannerService(),
  speakingPractice: new AISpeakingPracticeService(),
  noteGenerator: new AINoteGeneratorService(),
};

export type AIServices = typeof aiServices;
