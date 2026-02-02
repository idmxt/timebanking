require('dotenv').config();
const database = require('./config/database');
const User = require('./models/User');
const timeBankService = require('./services/timeBank.service');

const testEdgeCases = async () => {
  await database.connect();

  console.log('🧪 Testing Edge Cases...\n');

  // Test 1: Недостаточный баланс
  console.log('Test 1: Insufficient balance');
  try {
    await timeBankService.transferTime(1, 2, 100, 999);
    console.log('❌ Should have failed!\n');
  } catch (error) {
    console.log(`✅ Correctly rejected: ${error.message}\n`);
  }

  // Test 2: Минимальный баланс
  console.log('Test 2: Minimum balance check');
  const user = await User.findById(1);
  const minBalance = parseFloat(process.env.MIN_TIME_BALANCE);
  console.log(`Current balance: ${user.time_balance}h`);
  console.log(`Minimum allowed: ${minBalance}h`);
  console.log(`Can transfer: ${user.time_balance - minBalance}h\n`);

  // Test 3: Дублирование отзыва
  console.log('Test 3: Duplicate review');
  const Review = require('./models/Review');
  try {
    // Ensuring the booking exists for the review test
    await database.run('INSERT OR IGNORE INTO users (id, email, password_hash, name) VALUES (1, "u1@test.com", "hash", "U1")');
    await database.run('INSERT OR IGNORE INTO users (id, email, password_hash, name) VALUES (2, "u2@test.com", "hash", "U2")');
    await database.run('INSERT OR IGNORE INTO services (id, user_id, title, category, duration, location_type) VALUES (1, 2, "S1", "C1", 1, "online")');
    await database.run('INSERT OR IGNORE INTO bookings (id, service_id, requester_id, provider_id, booking_date, booking_time, duration, status) VALUES (1, 1, 1, 2, "2026-01-30", "10:00", 1, "completed")');

    await Review.create({
      booking_id: 1,
      reviewer_id: 1,
      reviewed_user_id: 2,
      rating: 5,
      comment: 'Test'
    });
    await Review.create({
      booking_id: 1,
      reviewer_id: 1,
      reviewed_user_id: 2,
      rating: 5,
      comment: 'Duplicate'
    });
    console.log('❌ Should have prevented duplicate!\n');
  } catch (error) {
    console.log(`✅ Correctly prevented: ${error.message}\n`);
  }

  process.exit(0);
};

testEdgeCases();
