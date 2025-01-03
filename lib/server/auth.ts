import bcrypt from 'bcrypt'

export async function hashPin(pin: string): Promise<string> {
  return await bcrypt.hash(pin, 10)
}

export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(pin, hash)
} 