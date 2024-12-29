import bcrypt from 'bcrypt'

/**
 * Validates if the input is a 4-digit PIN
 */
export const isValidPin = (pin: string): boolean => {
  return /^\d{4}$/.test(pin)
}

/**
 * Hashes a PIN for secure storage
 */
export const hashPin = async (pin: string): Promise<string> => {
  return await bcrypt.hash(pin, 10)
}

/**
 * Validates user credentials
 */
export const validateCredentials = (
  username: string,
  pin: string
): { isValid: boolean; error?: string } => {
  if (!username) {
    return { isValid: false, error: 'Username is required' }
  }

  if (!isValidPin(pin)) {
    return { isValid: false, error: 'PIN must be exactly 4 digits' }
  }

  return { isValid: true }
} 