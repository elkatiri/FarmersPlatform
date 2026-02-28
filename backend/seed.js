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
    email: (process.env.ADMIN_EMAIL || 'admin@agri-maroc.com').toLowerCase(),
    password: hashedPassword,
    name: 'Administrateur Plateforme',
  });

  await WorkerProfile.insertMany([
    {
      name: 'Ahmed El Fassi',
      phone: '+212600111111',
      regions: ['Agadir', 'Taroudant'],
      skills: ['récolte', 'taille'],
      experienceLevel: 'expert',
      availability: 'immediate',
      transportFlexibility: 'yes',
      status: 'approved',
    },
    {
      name: 'Fatima Zahra Ait Ali',
      phone: '+212600222222',
      regions: ['Chtouka', 'Biougra'],
      skills: ['emballage', 'tri'],
      experienceLevel: 'intermediate',
      availability: 'within_week',
      transportFlexibility: 'depends',
      status: 'pending',
    },
    {
      name: 'Youssef Benali',
      phone: '+212600333333',
      regions: ['Marrakech', 'Chichaoua'],
      skills: ['récolte'],
      experienceLevel: 'beginner',
      availability: 'seasonal',
      transportFlexibility: 'no',
      status: 'approved',
    },
    {
      name: 'Khadija Amrani',
      phone: '+212600444444',
      regions: ['Oulad Teima', 'Taroudant'],
      skills: ['cueillette', 'conditionnement'],
      experienceLevel: 'expert',
      availability: 'immediate',
      transportFlexibility: 'yes',
      status: 'approved',
    },
  ]);

  await FarmerRequest.insertMany([
    {
      workType: 'récolte',
      location: 'Chtouka Ait Baha',
      startDate: new Date('2026-03-10'),
      endDate: new Date('2026-03-30'),
      workersNeeded: 30,
      transportInfo: 'Bus depuis Agadir',
      housingProvided: true,
      mealsProvided: true,
      whatsapp: '+212611111111',
      notes: 'Expérience en fruits rouges souhaitée',
      status: 'new',
    },
    {
      workType: 'taille',
      location: 'Taroudant',
      startDate: new Date('2026-04-05'),
      endDate: new Date('2026-04-15'),
      workersNeeded: 15,
      transportInfo: 'Transport assuré par l’agriculteur',
      housingProvided: false,
      mealsProvided: true,
      whatsapp: '+212622222222',
      notes: '',
      status: 'matched',
    },
    {
      workType: 'cueillette des oranges',
      location: 'Berkane',
      startDate: new Date('2026-02-15'),
      endDate: new Date('2026-03-05'),
      workersNeeded: 40,
      transportInfo: 'Point de rassemblement au centre-ville',
      housingProvided: true,
      mealsProvided: false,
      whatsapp: '+212633333333',
      notes: 'Travail saisonnier',
      status: 'new',
    },
  ]);

  await FAQ.insertMany([
    {
      question: 'Puis-je réserver 100 ouvriers ?',
      answer: 'Oui, cela dépend de la disponibilité des ouvriers dans votre région.',
    },
    {
      question: 'Qui paie le transport ?',
      answer: 'Le transport est défini entre l’agriculteur et les ouvriers avant la validation.',
    },
    {
      question: 'Comment le prix est-il fixé ?',
      answer: 'Le prix est négocié entre les deux parties selon le type de travail.',
    },
    {
      question: 'Puis-je contacter les ouvriers sur WhatsApp ?',
      answer: 'Oui, chaque demande contient un numéro WhatsApp pour faciliter la communication.',
    },
  ]);

  console.log('Données marocaines insérées avec succès 🇲🇦');
  process.exit(0);
};

runSeed().catch((error) => {
  console.error('Erreur lors du seed:', error);
  process.exit(1);
});