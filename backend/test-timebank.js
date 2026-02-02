require('dotenv').config();
const database = require('./config/database');
const timeBankService = require('./services/timeBank.service');
const User = require('./models/User');

const testTimeBank = async () => {
  await database.connect();

  console.log('🧪 Testing Time Bank Service...\n');

  // Получаем двух пользователей
  const user1 = await User.findById(1);
  const user2 = await User.findById(2);

  if (!user1 || !user2) {
    console.error('❌ Test users not found. Make sure to seed the database first.');
    process.exit(1);
  }

  console.log(`User 1: ${user1.name} - Balance: ${user1.time_balance}h`);
  console.log(`User 2: ${user2.name} - Balance: ${user2.time_balance}h\n`);

  // Тест 1: Перевод времени
  console.log('Test 1: Transfer 2 hours from User 1 to User 2');
  try {
    // Сначала создаем фейковое бронирование чтобы не упасть на Foreign Key
    const db = require('./config/database');
    await db.run('INSERT OR IGNORE INTO bookings (id, service_id, requester_id, provider_id, booking_date, booking_time, duration, status) VALUES (999, 1, 1, 2, "2026-01-30", "10:00", 2, "accepted")');
    
    await timeBankService.transferTime(1, 2, 2, 999);

    const updated1 = await User.findById(1);
    const updated2 = await User.findById(2);
    console.log(`User 1: ${updated1.time_balance}h (${(user1.time_balance - updated1.time_balance).toFixed(1)} hours transferred)`);
    console.log(`User 2: ${updated2.time_balance}h (+${(updated2.time_balance - user2.time_balance).toFixed(1)} hours received)\n`);
  } catch (error) {
    console.error('Test 1 failed:', error.message);
  }

  // Тест 2: Добавить бонус
  console.log('Test 2: Add 1 bonus hour to User 1');
  try {
    await timeBankService.addBonus(1, 1, 'Test bonus');
    const bonus1 = await User.findById(1);
    console.log(`User 1: ${bonus1.time_balance}h (+1 hour bonus)\n`);
  } catch (error) {
    console.error('Test 2 failed:', error.message);
  }

  // Тест 3: Статистика
  console.log('Test 3: Get User 1 stats');
  try {
    const stats = await timeBankService.getUserTimeStats(1);
    console.log(stats);
  } catch (error) {
    console.error('Test 3 failed:', error.message);
  }

  process.exit(0);
};

testTimeBank();
