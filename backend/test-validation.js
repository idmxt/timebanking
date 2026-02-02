require('dotenv').config();
const database = require('./config/database');
const authController = require('./controllers/auth.controller');
const servicesController = require('./controllers/services.controller');
const reviewsController = require('./controllers/reviews.controller');
const usersController = require('./controllers/users.controller');

const mockRes = () => {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.body = data;
    return res;
  };
  return res;
};

const testValidation = async () => {
  try {
    await database.connect();
    console.log('🧪 Testing Validation Rules...\n');

    // 1. Email Format Validation
    console.log('Test 1: Invalid Email Format');
    const emailRes = mockRes();
    await authController.register({ 
      body: { email: 'invalid-email', password: 'password123', name: 'Test' } 
    }, emailRes);
    // Note: Depends on whether express-validator is used in routes or logic in controller
    console.log(`Result: ${emailRes.statusCode} - ${JSON.stringify(emailRes.body)}\n`);

    // 2. Password Length
    console.log('Test 2: Short Password (< 6 chars)');
    const passRes = mockRes();
    await authController.register({ 
      body: { email: `test${Date.now()}@test.com`, password: '123', name: 'Test' } 
    }, passRes);
    console.log(`Result: ${passRes.statusCode} - ${JSON.stringify(passRes.body)}\n`);

    // 3. Required Fields - Service
    console.log('Test 3: Missing Fields in Service Creation');
    const serviceRes = mockRes();
    await servicesController.createService({ 
      userId: 1, 
      body: { title: 'Missing duration and category' } 
    }, serviceRes);
    console.log(`Result: ${serviceRes.statusCode} - ${JSON.stringify(serviceRes.body)}\n`);

    // 4. Rating Range
    console.log('Test 4: Invalid Rating Range (e.g., 6)');
    const reviewRes = mockRes();
    await reviewsController.createReview({ 
      userId: 1, 
      body: { booking_id: 1, rating: 6, comment: 'Too high' } 
    }, reviewRes);
    console.log(`Result: ${reviewRes.statusCode} - ${JSON.stringify(reviewRes.body)}\n`);

    // 5. File Size (Mocking multer limit check is hard, but we can check the config)
    console.log('Test 5: File Size Limit Check');
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 5242880;
    console.log(`Configured MAX_FILE_SIZE: ${maxSize} bytes (${(maxSize/1024/1024).toFixed(1)}MB)\n`);

    console.log('🏁 Validation tests completed.');
  } catch (error) {
    console.error('❌ Validation Test Error:', error);
  } finally {
    process.exit(0);
  }
};

testValidation();
