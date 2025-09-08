export type UserRole = 'admin' | 'creator' | 'public';

export interface User {
  id: string;
  email: string;
  password: string; // Note: In production, never store plain text passwords
  name: string;
  role: UserRole;
  isDefault: boolean;
}

export const defaultUsers: ReadonlyArray<User> = [
  {
    id: 'admin-001',
    email: 'admin@surveyapp.com',
    password: 'admin123', // In production, use environment variables and proper hashing
    name: 'Admin User',
    role: 'admin',
    isDefault: true,
  },
  {
    id: 'public-001',
    email: 'user@surveyapp.com',
    password: 'user123', // In production, use environment variables and proper hashing
    name: 'Public User',
    role: 'public',
    isDefault: true,
  },
];

// Helper function to get default admin user
export const getDefaultAdmin = (): User | undefined => {
  return defaultUsers.find(user => user.role === 'admin' && user.isDefault);
};

// Helper function to get default public user
export const getDefaultPublicUser = (): User | undefined => {
  return defaultUsers.find(user => user.role === 'public' && user.isDefault);
};
