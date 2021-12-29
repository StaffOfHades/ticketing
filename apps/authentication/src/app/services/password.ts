import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)

export const Password = {
  compare: async (storePassword: string, suppliedPassword: string) => {
    const [hashedPassword, salt] = storePassword.split('.');
    const buffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    return hashedPassword === buffer.toString('hex');
  },
  toHash: async (password: string) => {
    const salt = randomBytes(8).toString('hex');
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buffer.toString('hex')}.${salt}`
  },
}
