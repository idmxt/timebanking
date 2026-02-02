require('dotenv').config();
const database = require('./config/database');

const testPerformance = async () => {
  await database.connect();

  console.log('⚡ Testing Performance...\n');

  // Test 1: Загрузка услуг
  console.time('Load 100 services');
  await database.all('SELECT * FROM services LIMIT 100');
  console.timeEnd('Load 100 services');

  // Test 2: Сложный join запрос
  console.time('Complex join query');
  await database.all(`
    SELECT 
      b.*,
      s.title,
      u1.name as requester_name,
      u2.name as provider_name
    FROM bookings b
    JOIN services s ON b.service_id = s.id
    JOIN users u1 ON b.requester_id = u1.id
    JOIN users u2 ON b.provider_id = u2.id
    LIMIT 100
  `);
  console.timeEnd('Complex join query');

  process.exit(0);
};

testPerformance();
