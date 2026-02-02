require('dotenv').config();
const database = require('./config/database');
const User = require('./models/User');
const Service = require('./models/Service');

const testDatabase = async () => {
  try {
    await database.connect();
    
    // Получить всех пользователей
    const users = await User.findAll();
    console.log('👥 Users found:', users.length);
    
    // Получить все услуги
    const services = await Service.findAll();
    console.log('📦 Services found:', services.length);
    
    // Получить одного пользователя
    const user = await User.findById(1);
    if (user) {
      console.log('👤 User #1:', user.name, '- Balance:', user.time_balance, 'hours');
    } else {
      console.log('⚠️ User #1 not found. Ensure seed data was loaded.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
};

testDatabase();
