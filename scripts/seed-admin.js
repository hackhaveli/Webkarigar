const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'coderrohit2927@gmail.com';
  const password = 'Rohit@2927';
  const name = 'Rohit (Supreme Admin)';

  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      password: hash,
      name,
      role: 'admin',
      status: 'active',
      plan: 'pro',
      credits: 99999,
    },
    update: {
      password: hash,
      name,
      role: 'admin',
      status: 'active',
      plan: 'pro',
      credits: 99999,
    },
  });

  console.log('✅ Supreme Admin created/updated:');
  console.log('   Email   :', user.email);
  console.log('   Name    :', user.name);
  console.log('   Role    :', user.role);
  console.log('   Credits :', user.credits);
  console.log('   Plan    :', user.plan);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
