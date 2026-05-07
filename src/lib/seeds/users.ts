export interface UserSeed {
  accessCode: string;
  userId: string;
  displayName: string;
  email: string;
  createdAt: Date;
}

export const userSeeds: UserSeed[] = [
  {
    accessCode: 'CIVIC-999',
    userId: 'user_civic_999',
    displayName: 'CivicMind User',
    email: 'civic.999@civicmind.com',
    createdAt: new Date('2024-01-01'),
  },
];

export function findUserByAccessCode(accessCode: string): UserSeed | undefined {
  return userSeeds.find(user => user.accessCode === accessCode.toUpperCase());
}

export function createUserFromAccessCode(accessCode: string): UserSeed | null {
  const normalizedCode = accessCode.toUpperCase().trim();
  
  // If code starts with CIVIC, create a new user
  if (normalizedCode.startsWith('CIVIC-') && !findUserByAccessCode(normalizedCode)) {
    const newUser: UserSeed = {
      accessCode: normalizedCode,
      userId: `user_${normalizedCode.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`,
      displayName: `User ${normalizedCode}`,
      email: `${normalizedCode.toLowerCase().replace(/[^a-z0-9]/g, '.')}@civicmind.com`,
      createdAt: new Date(),
    };
    
    userSeeds.push(newUser);
    return newUser;
  }
  
  return findUserByAccessCode(normalizedCode) || null;
}
