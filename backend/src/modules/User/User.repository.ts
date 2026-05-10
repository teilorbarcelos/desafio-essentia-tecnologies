import { PrismaProvider } from '../../infra/database/PrismaProvider.js';

export class UserRepository {
  private prisma = PrismaProvider.getInstance();

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  async updatePassword(id: string, passwordHash: string) {
    return this.prisma.user.update({
      where: { id },
      data: { password: passwordHash }
    });
  }
}
