export interface AuthErrorMapping {
  code: string;
  message: string;
  type: 'validation' | 'server' | 'network';
}

const authErrorMappings: AuthErrorMapping[] = [
  // Firebase Auth errors
  {
    code: 'auth/operation-not-allowed',
    message: 'El servicio de autenticación no está disponible. Contacta al administrador.',
    type: 'server'
  },
  {
    code: 'auth/user-not-found',
    message: 'Código de acceso inválido. Verifica e intenta nuevamente.',
    type: 'validation'
  },
  {
    code: 'auth/wrong-password',
    message: 'Código de acceso inválido. Verifica e intenta nuevamente.',
    type: 'validation'
  },
  {
    code: 'auth/email-already-in-use',
    message: 'Este código de acceso ya está en uso. Contacta al administrador.',
    type: 'validation'
  },
  {
    code: 'auth/weak-password',
    message: 'La contraseña es muy débil. Contacta al administrador.',
    type: 'validation'
  },
  {
    code: 'auth/invalid-email',
    message: 'Formato de email inválido. Contacta al administrador.',
    type: 'validation'
  },
  {
    code: 'auth/too-many-requests',
    message: 'Demasiados intentos. Espera unos minutos y vuelve a intentar.',
    type: 'server'
  },
  {
    code: 'auth/network-request-failed',
    message: 'Error de conexión. Verifica tu internet e intenta nuevamente.',
    type: 'network'
  },
  {
    code: 'auth/requires-recent-login',
    message: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
    type: 'validation'
  },
  {
    code: 'auth/invalid-credential',
    message: 'Código de acceso inválido. Verifica e intenta nuevamente.',
    type: 'validation'
  },
  {
    code: 'auth/invalid-api-key',
    message: 'Error de configuración del sistema. Contacta al administrador.',
    type: 'server'
  },
  {
    code: 'auth/app-deleted',
    message: 'La aplicación no está disponible. Contacta al administrador.',
    type: 'server'
  },
  {
    code: 'auth/app-not-authorized',
    message: 'La aplicación no está autorizada. Contacta al administrador.',
    type: 'server'
  },
  {
    code: 'auth/argument-error',
    message: 'Error en los datos proporcionados. Verifica e intenta nuevamente.',
    type: 'validation'
  },
  {
    code: 'auth/invalid-user-token',
    message: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
    type: 'validation'
  },
  {
    code: 'auth/tenant-id-mismatch',
    message: 'Error de configuración. Contacta al administrador.',
    type: 'server'
  },
  {
    code: 'auth/unsupported-tenant-operation',
    message: 'Operación no soportada. Contacta al administrador.',
    type: 'server'
  },
  {
    code: 'auth/user-disabled',
    message: 'Tu cuenta ha sido deshabilitada. Contacta al administrador.',
    type: 'validation'
  },
  {
    code: 'auth/user-token-expired',
    message: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
    type: 'validation'
  },
  {
    code: 'auth/web-storage-unsupported',
    message: 'Tu navegador no es compatible. Intenta con otro navegador.',
    type: 'validation'
  },
  {
    code: 'auth/invalid-tenant-id',
    message: 'Error de configuración. Contacta al administrador.',
    type: 'server'
  }
];

export function getAuthErrorMessage(error: any, language: 'es' | 'en' = 'es'): string {
  // If error has a code, try to find a mapping
  if (error?.code) {
    const mapping = authErrorMappings.find(m => m.code === error.code);
    if (mapping) {
      return language === 'es' ? mapping.message : getEnglishMessage(mapping.code);
    }
  }
  
  // If error is a string, return it directly
  if (typeof error === 'string') {
    return error;
  }
  
  // If error has a message, return it
  if (error?.message) {
    return error.message;
  }
  
  // Default error message
  return language === 'es' 
    ? 'Error al iniciar sesión. Intenta nuevamente.' 
    : 'Login failed. Please try again.';
}

function getEnglishMessage(code: string): string {
  const englishMessages: Record<string, string> = {
    'auth/operation-not-allowed': 'Authentication service is not available. Contact administrator.',
    'auth/user-not-found': 'Invalid access code. Please check and try again.',
    'auth/wrong-password': 'Invalid access code. Please check and try again.',
    'auth/email-already-in-use': 'This access code is already in use. Contact administrator.',
    'auth/weak-password': 'Password is too weak. Contact administrator.',
    'auth/invalid-email': 'Invalid email format. Contact administrator.',
    'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
    'auth/network-request-failed': 'Connection error. Check your internet and try again.',
    'auth/requires-recent-login': 'Your session has expired. Please log in again.',
    'auth/invalid-credential': 'Invalid access code. Please check and try again.',
    'auth/invalid-api-key': 'System configuration error. Contact administrator.',
    'auth/app-deleted': 'Application is not available. Contact administrator.',
    'auth/app-not-authorized': 'Application is not authorized. Contact administrator.',
    'auth/argument-error': 'Error in provided data. Please check and try again.',
    'auth/invalid-user-token': 'Your session has expired. Please log in again.',
    'auth/tenant-id-mismatch': 'Configuration error. Contact administrator.',
    'auth/unsupported-tenant-operation': 'Operation not supported. Contact administrator.',
    'auth/user-disabled': 'Your account has been disabled. Contact administrator.',
    'auth/user-token-expired': 'Your session has expired. Please log in again.',
    'auth/web-storage-unsupported': 'Your browser is not supported. Try another browser.',
    'auth/invalid-tenant-id': 'Configuration error. Contact administrator.'
  };
  
  return englishMessages[code] || 'Login failed. Please try again.';
}

export function getErrorType(error: any): 'validation' | 'server' | 'network' {
  if (error?.code) {
    const mapping = authErrorMappings.find(m => m.code === error.code);
    return mapping?.type || 'server';
  }
  return 'server';
}
