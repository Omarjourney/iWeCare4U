// FHIR-compatible data models for emotion tracking

export interface EmotionObservation {
  resourceType: 'Observation';
  id: string;
  status: 'final' | 'preliminary' | 'cancelled';
  category: {
    coding: {
      system: 'http://terminology.hl7.org/CodeSystem/observation-category';
      code: 'survey';
      display: 'Survey';
    }[];
  }[];
  code: {
    coding: {
      system: 'http://loinc.org';
      code: '72133-2'; // Emotional state
      display: 'Emotional state';
    }[];
  };
  subject: {
    reference: string; // Patient reference
  };
  effectiveDateTime: string;
  valueCodeableConcept?: {
    coding: {
      system: 'http://snomed.info/sct';
      code: string;
      display: string;
    }[];
    text: string;
  };
  component?: {
    code: {
      coding: {
        system: string;
        code: string;
        display: string;
      }[];
    };
    valueQuantity?: {
      value: number;
      unit: string;
      system: 'http://unitsofmeasure.org';
      code: string;
    };
    valueString?: string;
    valueCodeableConcept?: {
      coding: {
        system: string;
        code: string;
        display: string;
      }[];
    };
  }[];
}

export interface MoodEntry {
  id: string;
  patientId: string;
  timestamp: string;
  mood: {
    primary: string;
    intensity: number; // 1-10 scale
    secondary?: string[];
  };
  colors: string[];
  expression?: {
    type: 'drawing' | 'photo' | 'voice' | 'text';
    data: string;
    metadata?: any;
  };
  safeSpace?: {
    items: string[];
    description: string;
  };
  adaptiveResponses?: {
    promptId: string;
    question: string;
    response: any;
    timestamp: string;
  }[];
  triggers?: string[];
  copingStrategies?: string[];
  supportNeeded?: boolean;
  guardianNotified?: boolean;
  clinicalFlags?: {
    severity: 'low' | 'medium' | 'high';
    requiresFollowUp: boolean;
    notes?: string;
  };
}

export interface EmotionSession {
  id: string;
  patientId: string;
  startTime: string;
  endTime?: string;
  completedFeatures: string[];
  ageAtSession: number;
  configUsed: AgeConfiguration;
  moodEntry: MoodEntry;
  sessionNotes?: string;
}

export interface AgeConfiguration {
  ageRange: string;
  complexity: 'simple' | 'medium' | 'advanced';
  availableFeatures: string[];
  iconSize: number;
  maxColors: number;
  promptStyle: 'visual' | 'interactive' | 'conversational';
  autoAdvance: boolean;
  requiresGuardianReview: boolean;
}

export interface GuardianReport {
  id: string;
  patientId: string;
  generatedDate: string;
  reportPeriod: {
    start: string;
    end: string;
  };
  summary: {
    totalSessions: number;
    averageMoodScore: number;
    mostFrequentMood: string;
    concerningPatterns: string[];
    positivePatterns: string[];
  };
  recommendations: string[];
  clinicalAlerts: {
    level: 'info' | 'warning' | 'urgent';
    message: string;
    timestamp: string;
  }[];
  moodTrends: {
    date: string;
    mood: string;
    intensity: number;
  }[];
}

// SNOMED CT codes for common emotions
export const EMOTION_CODES = {
  happy: { code: '112080002', display: 'Happy' },
  sad: { code: '224960004', display: 'Sad' },
  angry: { code: '48694002', display: 'Angry' },
  worried: { code: '48694002', display: 'Anxious' },
  excited: { code: '112080002', display: 'Excited' },
  calm: { code: '112080002', display: 'Calm' },
  tired: { code: '224960004', display: 'Tired' },
  confused: { code: '40917007', display: 'Confused' },
};

// LOINC codes for emotion-related observations
export const LOINC_CODES = {
  emotionalState: '72133-2',
  moodIntensity: '72136-5',
  copingStrategy: '72137-3',
  triggerEvent: '72138-1',
  supportNeeded: '72139-9',
};