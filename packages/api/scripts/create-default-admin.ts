/// <reference types="dotenv" />

import {
  PrismaClient,
  Permission as PrismaPermission,
} from '@sunrin-para/database';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

async function main() {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();

    const { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PW, SALT_ROUND } = process.env;
    if (!DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PW || !SALT_ROUND) {
      throw new Error(
        '기본 관리자 계정을 생성하기 위한 정보가 입력되지 않았습니다.',
      );
    }
    const salt = await bcrypt.genSalt(parseInt(SALT_ROUND));
    const encryptedPassword = await bcrypt.hash(DEFAULT_ADMIN_PW, salt);
    await this.authRepository.createUser({
      email: DEFAULT_ADMIN_EMAIL,
      name: 'PARA Default Admin',
      permission: PrismaPermission.SUPER,
      password: encryptedPassword,
    });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch();
