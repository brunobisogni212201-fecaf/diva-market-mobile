// Master Admin Configuration
// This file contains the security configuration for admin access

export const MASTER_ADMIN_EMAILS = [
  'bruno@oceanoazul.dev.br'
];

/**
 * Check if a user has admin privileges
 * @param email - User email to check
 * @returns boolean - True if user is admin
 */
export const isAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  
  // Normalize email for case-insensitive comparison
  const normalizedEmail = email.toLowerCase().trim();
  
  return MASTER_ADMIN_EMAILS.some(adminEmail => 
    adminEmail.toLowerCase().trim() === normalizedEmail
  );
};

/**
 * Check if a user has super admin privileges (highest level)
 * @param email - User email to check
 * @returns boolean - True if user is super admin
 */
export const isSuperAdmin = (email?: string | null): boolean => {
  return isAdmin(email); // For now, all admins are super admins
};

/**
 * Get admin role based on email
 * @param email - User email to check
 * @returns string - Role name or 'user'
 */
export const getAdminRole = (email?: string | null): string => {
  if (isSuperAdmin(email)) return 'super_admin';
  if (isAdmin(email)) return 'admin';
  return 'user';
};

/**
 * Security levels for different operations
 */
export const SECURITY_LEVELS = {
  PUBLIC: 0,
  USER: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
} as const;

/**
 * Check if user has required security level
 * @param email - User email to check
 * @param requiredLevel - Required security level
 * @returns boolean - True if user has required level
 */
export const hasSecurityLevel = (
  email: string | null, 
  requiredLevel: number
): boolean => {
  const userRole = getAdminRole(email);
  
  const roleLevels = {
    'user': SECURITY_LEVELS.USER,
    'admin': SECURITY_LEVELS.ADMIN,
    'super_admin': SECURITY_LEVELS.SUPER_ADMIN,
  };
  
  return (roleLevels[userRole as keyof typeof roleLevels] || 0) >= requiredLevel;
};
