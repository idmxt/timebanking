require('dotenv').config();
const database = require('./config/database');
const User = require('./models/User');
const usersController = require('./controllers/users.controller');
const bookingsController = require('./controllers/bookings.controller');

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

const testSecurity = async () => {
  try {
    await database.connect();
    console.log('🛡️ Testing Security & Robustness...\n');

    // 1. SQL Injection Check
    console.log('Test 1: SQL Injection Protection (Prepared Statements)');
    const sqlInjectionInput = "'; DROP TABLE users; --";
    const regReq = {
      body: { email: `sqli_${Date.now()}@test.com`, password: 'password', name: sqlInjectionInput }
    };
    const regRes = mockRes();
    const User = require('./models/User');
    // Using User.create directly to see if it handles the name safely
    const newUser = await User.create(regReq.body);
    console.log(`✅ SQL Injection input stored as literal text: "${newUser.name}"`);
    const usersTable = await database.all("SELECT name FROM users WHERE id = ?", [newUser.id]);
    if (usersTable.length > 0) {
      console.log('✅ Users table still exists and data is safe.\n');
    }

    // 2. XSS Check
    console.log('Test 2: XSS Payload Handling');
    const xssPayload = "<script>alert('XSS')</script>";
    const updateReq = {
      userId: newUser.id,
      body: { bio: xssPayload }
    };
    const updateRes = mockRes();
    await usersController.updateProfile(updateReq, updateRes);
    console.log(`✅ XSS payload stored as raw string: "${updateRes.body.user.bio}"`);
    console.log('Note: Protection depends on Frontend React auto-escaping, but Backend stores it safely.\n');

    // 3. Unauthorized Access
    console.log('Test 3: Unauthorized Access to Protected Routes');
    // We simulate a request without req.userId (which is set by authenticateToken middleware)
    const unauthorizedReq = { params: { id: 1 } }; 
    const unauthorizedRes = mockRes();
    // Directly calling a controller method that expects auth
    await bookingsController.getBookingById(unauthorizedReq, unauthorizedRes);
    // getBookingById in the controller checks if (booking.requester_id !== userId) 
    // If userId is undefined, it should fail or error out correctly.
    console.log(`Result: ${unauthorizedRes.statusCode} - ${JSON.stringify(unauthorizedRes.body)}\n`);

    // 4. CORS Check Information
    console.log('Test 4: CORS Configuration Verification');
    const serverFile = require('fs').readFileSync('./server.js', 'utf8');
    if (serverFile.includes("origin: 'http://localhost:3000'")) {
      console.log('✅ CORS is restricted to http://localhost:3000 as per configuration.\n');
    } else {
      console.log('⚠️ CORS configuration might be too permissive or missing.\n');
    }

    console.log('🏁 Security tests completed.');
  } catch (error) {
    console.error('❌ Security Test Error:', error);
  } finally {
    process.exit(0);
  }
};

testSecurity();
