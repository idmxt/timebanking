const { initDatabase } = require('./init');
const User = require('../models/User');
const Service = require('../models/Service');
const database = require('../config/database');

const categories = [
  'Образование',
  'IT и технологии',
  'Ремонт и строительство',
  'Творчество и дизайн',
  'Кулинария',
  'Консультации',
  'Красота и здоровье',
  'Языки',
  'Транспорт',
  'Помощь по дому'
];

const seedUsers = async () => {
  const users = [
    {
      email: 'john@example.com',
      password: 'password123',
      name: 'Иван Петров',
      city: 'Алматы',
      bio: 'Преподаватель английского языка',
      occupation: 'Преподаватель английского языка',
      phone: '+7 701 123 4567',
      languages: 'Русский, Казахский, Английский',
      first_name: 'Иван',
      last_name: 'Петров',
      patronymic: 'Сергеевич',
      birth_date: '1990-05-15',
      gender: 'male'
    },
    { email: 'sarah@example.com', password: 'password123', name: 'Асем Кайтаровна', city: 'Алматы', bio: 'Веб-разработчик и дизайнер' },
    { email: 'mike@example.com', password: 'password123', name: 'Асан Аскарович', city: 'Астана', bio: 'Мастер по ремонту' },
    { email: 'anna@example.com', password: 'password123', name: 'Айдын Арманулы', city: 'Алматы', bio: 'Кондитер и кулинар' },
    { email: 'alex@example.com', password: 'password123', name: 'Александр Волков', city: 'Астана', bio: 'Юрист и консультант' }
  ];

  const createdUsers = [];
  for (const userData of users) {
    const user = await User.create(userData);
    createdUsers.push(user);
    console.log(`✅ Created user: ${user.name}`);
  }

  return createdUsers;
};

const seedServices = async (users) => {
  const services = [
    {
      user_id: users[0].id,
      title: 'Репетиторство английского языка',
      description: 'Помогу подтянуть английский язык для работы или путешествий. Индивидуальный подход.',
      category: 'Образование',
      duration: 1.0,
      location_type: 'online',
      city: 'Алматы'
    },
    {
      user_id: users[1].id,
      title: 'Создание сайта-визитки',
      description: 'Разработаю простой сайт-визитку для вашего бизнеса на React',
      category: 'IT и технологии',
      duration: 3.0,
      location_type: 'online',
      city: 'Almaty'
    },
    {
      user_id: users[1].id,
      title: 'Уроки веб-дизайна в Figma',
      description: 'Научу основам работы в Figma и созданию дизайна сайтов',
      category: 'Творчество и дизайн',
      duration: 1.5,
      location_type: 'online',
      city: 'Алматы'
    },
    {
      user_id: users[2].id,
      title: 'Мелкий ремонт в квартире',
      description: 'Помогу с мелким ремонтом: повесить полки, собрать мебель, заменить розетки',
      category: 'Ремонт и строительство',
      duration: 2.0,
      location_type: 'offline',
      address: 'Район Медеу',
      city: 'Алматы'
    },
    {
      user_id: users[3].id,
      title: 'Мастер-класс по выпечке тортов',
      description: 'Научу печь вкусные торты и украшать их кремом',
      category: 'Кулинария',
      duration: 2.5,
      location_type: 'offline',
      address: 'Район Алмалы',
      city: 'Алматы'
    },
    {
      user_id: users[3].id,
      title: 'Приготовление домашней пасты',
      description: 'Покажу как делать свежую пасту с нуля',
      category: 'Кулинария',
      duration: 1.0,
      location_type: 'offline',
      city: 'Алматы'
    },
    {
      user_id: users[4].id,
      title: 'Юридическая консультация',
      description: 'Консультация по жилищным и семейным вопросам',
      category: 'Консультации',
      duration: 1.0,
      location_type: 'online',
      city: 'Астана'
    },
    {
      user_id: users[0].id,
      title: 'Разговорный английский клуб',
      description: 'Неформальное общение на английском для практики',
      category: 'Языки',
      duration: 1.0,
      location_type: 'online',
      city: 'Алматы'
    }
  ];

  for (const serviceData of services) {
    const service = await Service.create(serviceData);
    console.log(`✅ Created service: ${service.title}`);
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    await initDatabase();
    await database.connect(); // Ensure the model singleton is connected
    const users = await seedUsers();
    await seedServices(users);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Запуск если файл запущен напрямую
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };