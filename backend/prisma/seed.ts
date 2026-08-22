import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/utils/security.js';

async function main() {
  const defaultPassword = 'Password123!';
  const hashedPassword = await hashPassword(defaultPassword);

  // 1. Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dayflow.io' },
    update: { role: 'ADMIN', emailVerified: true, isActive: true },
    create: {
      email: 'admin@dayflow.io',
      employeeId: 'EMP-ADM-001',
      passwordHash: hashedPassword,
      role: 'ADMIN',
      emailVerified: true,
      isActive: true,
      profile: {
        create: {
          firstName: 'Elena',
          lastName: 'Vance',
          phone: '+1 (555) 019-2834',
          department: 'Executive',
          designation: 'Managing Director',
          employmentStatus: 'ACTIVE',
          joiningDate: new Date('2022-01-15')
        }
      }
    },
    include: { profile: true }
  });

  // 2. HR Officer
  const hr = await prisma.user.upsert({
    where: { email: 'hr@dayflow.io' },
    update: { role: 'HR', emailVerified: true, isActive: true },
    create: {
      email: 'hr@dayflow.io',
      employeeId: 'EMP-HR-002',
      passwordHash: hashedPassword,
      role: 'HR',
      emailVerified: true,
      isActive: true,
      profile: {
        create: {
          firstName: 'Amara',
          lastName: 'Okonjo',
          phone: '+1 (555) 014-9821',
          department: 'Human Resources',
          designation: 'Head of People',
          employmentStatus: 'ACTIVE',
          joiningDate: new Date('2023-03-01')
        }
      }
    },
    include: { profile: true }
  });

  // 3. Employee 1
  const emp1 = await prisma.user.upsert({
    where: { email: 'employee@dayflow.io' },
    update: { role: 'EMPLOYEE', emailVerified: true, isActive: true },
    create: {
      email: 'employee@dayflow.io',
      employeeId: 'EMP-ENG-003',
      passwordHash: hashedPassword,
      role: 'EMPLOYEE',
      emailVerified: true,
      isActive: true,
      profile: {
        create: {
          firstName: 'Rohan',
          lastName: 'Kapoor',
          phone: '+1 (555) 018-7231',
          department: 'Engineering',
          designation: 'Senior Frontend Engineer',
          employmentStatus: 'ACTIVE',
          joiningDate: new Date('2023-06-15')
        }
      }
    },
    include: { profile: true }
  });

  // 4. Employee 2
  const emp2 = await prisma.user.upsert({
    where: { email: 'maya@dayflow.io' },
    update: { role: 'EMPLOYEE', emailVerified: true, isActive: true },
    create: {
      email: 'maya@dayflow.io',
      employeeId: 'EMP-DES-004',
      passwordHash: hashedPassword,
      role: 'EMPLOYEE',
      emailVerified: true,
      isActive: true,
      profile: {
        create: {
          firstName: 'Maya',
          lastName: 'Nichols',
          phone: '+1 (555) 012-3456',
          department: 'Design',
          designation: 'Lead Product Designer',
          employmentStatus: 'ACTIVE',
          joiningDate: new Date('2023-08-01')
        }
      }
    },
    include: { profile: true }
  });

  // 5. Employee 3
  const emp3 = await prisma.user.upsert({
    where: { email: 'sofia@dayflow.io' },
    update: { role: 'EMPLOYEE', emailVerified: true, isActive: true },
    create: {
      email: 'sofia@dayflow.io',
      employeeId: 'EMP-FIN-005',
      passwordHash: hashedPassword,
      role: 'EMPLOYEE',
      emailVerified: true,
      isActive: true,
      profile: {
        create: {
          firstName: 'Sofia',
          lastName: 'Chen',
          phone: '+1 (555) 017-6543',
          department: 'Finance',
          designation: 'Finance Controller',
          employmentStatus: 'ACTIVE',
          joiningDate: new Date('2024-01-10')
        }
      }
    },
    include: { profile: true }
  });

  // Add sample salary structures if not existing
  for (const emp of [admin, hr, emp1, emp2, emp3]) {
    if (emp.profile) {
      const existingSalary = await prisma.salaryStructure.findFirst({
        where: { employeeId: emp.profile.id }
      });
      if (!existingSalary) {
        const basic = emp.role === 'ADMIN' ? 120000 : emp.role === 'HR' ? 85000 : 75000;
        const allowances = Math.round(basic * 0.15);
        const deductions = Math.round(basic * 0.1);
        const gross = basic + allowances;
        await prisma.salaryStructure.create({
          data: {
            employeeId: emp.profile.id,
            basicSalary: basic,
            allowances: allowances,
            deductions: deductions,
            grossSalary: gross,
            netSalary: gross - deductions,
            effectiveDate: new Date('2026-01-01')
          }
        });
      }
    }
  }

  console.log('Seed completed successfully!');
  console.log('Admin:', admin.email);
  console.log('HR:', hr.email);
  console.log('Employee:', emp1.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
