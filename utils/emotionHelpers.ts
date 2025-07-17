import { EmotionObservation, MoodEntry, EMOTION_CODES, LOINC_CODES } from '@/types/emotions';

/**
 * Convert mood entry to FHIR Observation resource
 */
export function moodEntryToFHIR(moodEntry: MoodEntry): EmotionObservation {
  const emotionCode = EMOTION_CODES[moodEntry.mood.primary as keyof typeof EMOTION_CODES];
  
  return {
    resourceType: 'Observation',
    id: moodEntry.id,
    status: 'final',
    category: [{
      coding: [{
        system: 'http://terminology.hl7.org/CodeSystem/observation-category',
        code: 'survey',
        display: 'Survey'
      }]
    }],
    code: {
      coding: [{
        system: 'http://loinc.org',
        code: LOINC_CODES.emotionalState,
        display: 'Emotional state'
      }]
    },
    subject: {
      reference: `Patient/${moodEntry.patientId}`
    },
    effectiveDateTime: moodEntry.timestamp,
    valueCodeableConcept: emotionCode ? {
      coding: [{
        system: 'http://snomed.info/sct',
        code: emotionCode.code,
        display: emotionCode.display
      }],
      text: moodEntry.mood.primary
    } : undefined,
    component: [
      {
        code: {
          coding: [{
            system: 'http://loinc.org',
            code: LOINC_CODES.moodIntensity,
            display: 'Mood intensity'
          }]
        },
        valueQuantity: {
          value: moodEntry.mood.intensity,
          unit: 'score',
          system: 'http://unitsofmeasure.org',
          code: '{score}'
        }
      },
      ...(moodEntry.colors.length > 0 ? [{
        code: {
          coding: [{
            system: 'http://example.org/emotion-colors',
            code: 'mood-colors',
            display: 'Mood colors'
          }]
        },
        valueString: moodEntry.colors.join(', ')
      }] : []),
      ...(moodEntry.copingStrategies ? [{
        code: {
          coding: [{
            system: 'http://loinc.org',
            code: LOINC_CODES.copingStrategy,
            display: 'Coping strategy'
          }]
        },
        valueString: moodEntry.copingStrategies.join(', ')
      }] : []),
      ...(moodEntry.triggers ? [{
        code: {
          coding: [{
            system: 'http://loinc.org',
            code: LOINC_CODES.triggerEvent,
            display: 'Trigger event'
          }]
        },
        valueString: moodEntry.triggers.join(', ')
      }] : [])
    ]
  };
}

/**
 * Determine age-appropriate features based on age
 */
export function getAgeAppropriateFeatures(age: number): string[] {
  if (age <= 7) {
    return ['mood', 'colors', 'journal'];
  } else if (age <= 12) {
    return ['mood', 'colors', 'express', 'space', 'journal'];
  } else {
    return ['mood', 'colors', 'express', 'space', 'prompts', 'journal'];
  }
}

/**
 * Calculate mood trend over time
 */
export function calculateMoodTrend(entries: MoodEntry[]): {
  trend: 'improving' | 'declining' | 'stable';
  averageIntensity: number;
  mostCommonMood: string;
} {
  if (entries.length === 0) {
    return { trend: 'stable', averageIntensity: 5, mostCommonMood: 'calm' };
  }

  const sortedEntries = entries.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const averageIntensity = entries.reduce((sum, entry) => 
    sum + entry.mood.intensity, 0
  ) / entries.length;

  // Calculate trend based on first half vs second half
  const midpoint = Math.floor(entries.length / 2);
  const firstHalf = sortedEntries.slice(0, midpoint);
  const secondHalf = sortedEntries.slice(midpoint);

  const firstHalfAvg = firstHalf.reduce((sum, entry) => 
    sum + entry.mood.intensity, 0
  ) / firstHalf.length;
  
  const secondHalfAvg = secondHalf.reduce((sum, entry) => 
    sum + entry.mood.intensity, 0
  ) / secondHalf.length;

  let trend: 'improving' | 'declining' | 'stable';
  const difference = secondHalfAvg - firstHalfAvg;
  
  if (difference > 0.5) {
    trend = 'improving';
  } else if (difference < -0.5) {
    trend = 'declining';
  } else {
    trend = 'stable';
  }

  // Find most common mood
  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood.primary] = (acc[entry.mood.primary] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonMood = Object.entries(moodCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'calm';

  return { trend, averageIntensity, mostCommonMood };
}

/**
 * Generate clinical alerts based on mood patterns
 */
export function generateClinicalAlerts(entries: MoodEntry[]): {
  level: 'info' | 'warning' | 'urgent';
  message: string;
  timestamp: string;
}[] {
  const alerts = [];
  const recentEntries = entries.filter(entry => 
    new Date(entry.timestamp).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000)
  );

  // Check for consistently low mood
  const lowMoodEntries = recentEntries.filter(entry => entry.mood.intensity <= 3);
  if (lowMoodEntries.length >= 3) {
    alerts.push({
      level: 'warning' as const,
      message: 'Patient has reported low mood intensity for 3+ recent sessions',
      timestamp: new Date().toISOString()
    });
  }

  // Check for concerning mood patterns
  const concerningMoods = recentEntries.filter(entry => 
    ['sad', 'angry', 'worried'].includes(entry.mood.primary)
  );
  if (concerningMoods.length >= 4) {
    alerts.push({
      level: 'urgent' as const,
      message: 'Multiple concerning mood reports in recent sessions - clinical review recommended',
      timestamp: new Date().toISOString()
    });
  }

  // Check for support requests
  const supportRequests = recentEntries.filter(entry => entry.supportNeeded);
  if (supportRequests.length > 0) {
    alerts.push({
      level: 'info' as const,
      message: `Patient has requested support in ${supportRequests.length} recent session(s)`,
      timestamp: new Date().toISOString()
    });
  }

  return alerts;
}

/**
 * Generate age-appropriate prompts based on mood and history
 */
export function generateAdaptivePrompts(
  currentMood: string,
  age: number,
  recentEntries: MoodEntry[]
): {
  id: string;
  question: string;
  type: 'choice' | 'scale' | 'text';
  options?: string[];
}[] {
  const basePrompts = [];

  // Age-appropriate language and complexity
  if (age <= 7) {
    basePrompts.push({
      id: 'feeling_help',
      question: 'What helps you feel better?',
      type: 'choice' as const,
      options: ['Hugs', 'Playing', 'Talking', 'Drawing']
    });
  } else if (age <= 12) {
    basePrompts.push({
      id: 'coping_strategy',
      question: 'What do you usually do when you feel this way?',
      type: 'choice' as const,
      options: ['Talk to someone', 'Do something creative', 'Exercise or play', 'Listen to music', 'Take quiet time']
    });
  } else {
    basePrompts.push({
      id: 'reflection',
      question: 'What do you think might have contributed to feeling this way?',
      type: 'text' as const
    });
  }

  // Mood-specific prompts
  switch (currentMood) {
    case 'sad':
      if (age <= 7) {
        basePrompts.push({
          id: 'sad_comfort',
          question: 'What makes you feel cozy when you\'re sad?',
          type: 'choice' as const,
          options: ['Soft blanket', 'Favorite toy', 'Mom or Dad', 'Pet']
        });
      }
      break;
    
    case 'worried':
      basePrompts.push({
        id: 'worry_scale',
        question: age <= 7 ? 'How big is your worry?' : 'How worried do you feel right now?',
        type: 'scale' as const
      });
      break;
    
    case 'happy':
      basePrompts.push({
        id: 'happiness_share',
        question: age <= 7 ? 'What made you happy?' : 'What\'s making you feel happy today?',
        type: 'text' as const
      });
      break;
  }

  return basePrompts;
}