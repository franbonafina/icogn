export type Language = 'es' | 'en';

export interface Translations {
  landing: {
    title: string;
    subtitle: string;
    description: string;
    enterWithCode: string;
    builtFor: string;
    whatItTrains: {
      title: string;
      description: string;
    };
    trainingAreas: string[];
    learningMethods: {
      title: string;
      description: string;
    };
    methods: string[];
    benefits: string[];
  };
  auth: {
    privateAccess: string;
    accessDescription: string;
    signIn: string;
    continueToLearning: string;
    accessCode: string;
    accessCodePlaceholder: string;
    invalidCode: string;
    validating: string;
    continue: string;
    accessRequired: string;
    accessInstructions: string;
    contactSupport: string;
  };
  navigation: {
    access: string;
  };
}

export const translations: Record<Language, Translations> = {
  es: {
    landing: {
      title: 'Entrena la memoria, el juicio y la expresión cada día.',
      subtitle: 'Cognición ejecutiva, entrenada deliberadamente',
      description: 'icogn es un sistema de aprendizaje móvil primero para personas que se espera que piensen con claridad, hablen con precisión y tomen mejores decisiones cuando las apuestas son reales.',
      enterWithCode: 'Entrar con código de acceso',
      builtFor: 'Construido para cohortes internas, programas privados y equipos de alta responsabilidad.',
      whatItTrains: {
        title: 'Disciplina cognitiva para el liderazgo del mundo real.',
        description: 'Desarrolla las habilidades mentales fundamentales que distinguen a los líderes excepcionales.',
      },
      learningMethods: {
        title: 'Métodos de aprendizaje basados en evidencia',
        description: 'Técnicas probadas científicamente para maximizar la retención y el desarrollo de habilidades.',
      },
      trainingAreas: [
        'Conceptos y vocabulario',
        'Argumentación',
        'Expresión oral',
        'Toma de decisiones',
        'Conocimiento cultural y cívico',
      ],
      methods: [
        'Repetición espaciada',
        'Recuerdo activo',
        'Interleaving',
        'Práctica deliberada',
        'Toma de decisiones basada en escenarios',
      ],
      benefits: [
        'Memoria bajo presión',
        'Argumentación más clara',
        'Juicio ejecutivo más agudo',
      ],
    },
    auth: {
      privateAccess: 'Acceso privado',
      accessDescription: 'Ingresa con tu código de acceso para continuar al entorno de aprendizaje.',
      signIn: 'Iniciar sesión',
      continueToLearning: 'Accede a tu entorno de aprendizaje.',
      accessCode: 'Código de acceso',
      accessCodePlaceholder: 'Ingresa tu código de acceso',
      validating: 'Validando...',
      continue: 'Continuar',
      invalidCode: 'Código de acceso inválido. Por favor, verifica e intenta nuevamente.',
      accessRequired: 'Acceso requerido',
      accessInstructions: 'Se requiere un código de acceso válido para utilizar esta plataforma.',
      contactSupport: 'Si no tienes un código, contacta al administrador.',
    },
    navigation: {
      access: 'Acceso',
    },
  },
  en: {
    landing: {
      title: 'Train memory, judgment, and expression every day.',
      subtitle: 'Executive cognition, trained deliberately',
      description: 'icogn is a mobile-first learning system for people expected to think clearly, speak with precision, and make better decisions when the stakes are real.',
      enterWithCode: 'Enter with access code',
      builtFor: 'Built for internal cohorts, private programs, and high-accountability teams.',
      whatItTrains: {
        title: 'Cognitive discipline for real-world leadership.',
        description: 'Develop the fundamental mental skills that distinguish exceptional leaders.',
      },
      learningMethods: {
        title: 'Evidence-based learning methods',
        description: 'Scientifically proven techniques to maximize retention and skill development.',
      },
      trainingAreas: [
        'Concepts and vocabulary',
        'Argumentation',
        'Oral expression',
        'Decision-making',
        'Cultural and civic knowledge',
      ],
      methods: [
        'Spaced repetition',
        'Active recall',
        'Interleaving',
        'Deliberate practice',
        'Scenario-based decision-making',
      ],
      benefits: [
        'Memory under pressure',
        'Clearer argumentation',
        'Sharper executive judgment',
      ],
    },
    auth: {
      privateAccess: 'Private Access',
      accessDescription: 'Enter with your access code to continue to the learning environment.',
      signIn: 'Sign In',
      continueToLearning: 'Access your learning environment.',
      accessCode: 'Access Code',
      accessCodePlaceholder: 'Enter your access code',
      validating: 'Validating...',
      continue: 'Continue',
      invalidCode: 'Invalid access code. Please check and try again.',
      accessRequired: 'Access Required',
      accessInstructions: 'A valid access code is required to use this platform.',
      contactSupport: 'If you don\'t have a code, please contact your administrator.',
    },
    navigation: {
      access: 'Access',
    },
  },
};
