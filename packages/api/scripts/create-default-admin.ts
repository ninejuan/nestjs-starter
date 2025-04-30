/// <reference types="dotenv" />

import {
  PrismaClient,
  Permission as PrismaPermission,
} from '@your-organization/database';
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

    await prisma.user.create({
      data: {
        email: DEFAULT_ADMIN_EMAIL,
        name: 'Default Admin',
        permission: PrismaPermission.ADMIN,
      },
    });

    console.log('기본 관리자 계정이 생성되었습니다.');
  } catch (error) {
    console.error('관리자 계정 생성 중 오류가 발생했습니다:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('스크립트 실행 중 오류가 발생했습니다:', error);
  process.exit(1);
});
