import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userId = '5c03994c-fc16-47e0-bd02-d218a370a078';
  await prisma.user.upsert({
    where: {
      id: userId,
    },
    create: {
      id: userId,
      name: 'Ukko',
      password: 'Ukko123',
    },
    update: {},
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
