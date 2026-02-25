const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const WorkerProfile = require('./models/WorkerProfile');
const FarmerRequest = require('./models/FarmerRequest');
const FAQ = require('./models/FAQ');

dotenv.config();

const runSeed = async () => {
  await connectDB();

  await Promise.all([
    Admin.deleteMany({}),
    WorkerProfile.deleteMany({}),
    FarmerRequest.deleteMany({}),
    FAQ.deleteMany({}),
  ]);

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);

  await Admin.create({
    email: (process.env.ADMIN_EMAIL || 'admin@farmworkers.com').toLowerCase(),
    password: hashedPassword,
    name: 'Platform Admin',
  });

  await WorkerProfile.insertMany([
    {
      name: 'Ravi Kumar',
      phone: '+919999111111',
      regions: ['Nashik', 'Pune'],
      skills: ['pruning', 'harvesting'],
      experienceLevel: 'expert',
      availability: 'immediate',
      transportFlexibility: 'yes',
      status: 'approved',
    },
    {
      name: 'Asha Patil',
      phone: '+919999222222',
      regions: ['Aurangabad'],
      skills: ['packing', 'sorting'],
      experienceLevel: 'intermediate',
      availability: 'within_week',
      transportFlexibility: 'depends',
      status: 'pending',
    },
    {
      name: 'Mahesh Jadhav',
      phone: '+919999333333',
      regions: ['Nashik', 'Ahmednagar'],
      skills: ['harvesting'],
      experienceLevel: 'beginner',
      availability: 'seasonal',
      transportFlexibility: 'no',
      status: 'approved',
    },
  ]);

  await FarmerRequest.insertMany([
    {
      workType: 'harvesting',
      location: 'Nashik',
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-03-20'),
      workersNeeded: 25,
      transportInfo: 'Bus pickup from central point',
      housingProvided: true,
      mealsProvided: true,
      whatsapp: '+919888111111',
      notes: 'Need experience in grape harvesting',
      status: 'new',
    },
    {
      workType: 'pruning',
      location: 'Pune',
      startDate: new Date('2026-04-10'),
      endDate: new Date('2026-04-18'),
      workersNeeded: 12,
      transportInfo: 'Farmer-arranged local transport',
      housingProvided: false,
      mealsProvided: true,
      whatsapp: '+919888222222',
      notes: '',
      status: 'matched',
    },
  ]);

  await FAQ.insertMany([
    {
      question: 'Can I book 100 workers?',
      answer: 'Yes, large bookings are possible based on worker availability in your region.',
    },
    {
      question: 'Who pays transport?',
      answer: 'Transport responsibility is discussed between farmer and workers before final match.',
    },
    {
      question: 'How is pricing decided?',
      answer: 'Pricing is TBD and will be finalized by mutual agreement.',
    },
  ]);

  console.log('Seed data inserted successfully');
  process.exit(0);
};

runSeed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
