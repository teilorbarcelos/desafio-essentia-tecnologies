import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';
import { JWTProvider, AuthPayload } from '../../infra/auth/JWTProvider.js';
import { SessionManager } from '../../infra/auth/SessionManager.js';
import { UserRepository } from '../User/User.repository.js';

export class AuthService {
  private jwtProvider: JWTProvider;
  private userRepository: UserRepository;

  constructor(fastify: FastifyInstance) {
    this.jwtProvider = new JWTProvider(fastify);
    this.userRepository = new UserRepository();
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const payload: AuthPayload = { id: user.id, email: user.email };
    const tokens = await this.jwtProvider.generateTokenPair(payload);

    await SessionManager.createSession(user.id, tokens.token, tokens.refreshToken, payload);

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    };
  }

  async getMe(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new Error('User not found');

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtProvider.verifyToken(refreshToken);
      const isValid = await SessionManager.validateRefreshSession(payload.id, refreshToken);

      if (!isValid) throw new Error('Invalid refresh token');

      const user = await this.userRepository.findById(payload.id);
      if (!user) throw new Error('User not found');

      const newPayload: AuthPayload = { id: user.id, email: user.email };
      const tokens = await this.jwtProvider.generateTokenPair(newPayload);

      await SessionManager.invalidateRefreshSession(user.id, refreshToken);
      await SessionManager.createSession(user.id, tokens.token, tokens.refreshToken, newPayload);

      return tokens;
    } catch (err) {
      throw new Error('Unauthorized');
    }
  }

  async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const isValid = await bcrypt.compare(currentPass, user.password);
    if (!isValid) throw new Error('Current password incorrect');

    const hashedNewPass = await bcrypt.hash(newPass, 12);
    await this.userRepository.updatePassword(userId, hashedNewPass);

    await SessionManager.invalidateAllUserSessions(userId);
  }
}
