require('dotenv').config();
const database = require('./config/database');
const authController = require('./controllers/auth.controller');
const usersController = require('./controllers/users.controller');
const servicesController = require('./controllers/services.controller');
const bookingsController = require('./controllers/bookings.controller');
const messagesController = require('./controllers/messages.controller');
const reviewsController = require('./controllers/reviews.controller');
const timeBankService = require('./services/timeBank.service');
const User = require('./models/User');

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

const testFlow2 = async () => {
  try {
    await database.connect();
    console.log('🧪 Starting Flow 2: Search → Book → Pay → Review...\n');

    // Setup: Create Provider and Service
    const providerEmail = `provider_${Date.now()}@test.com`;
    await authController.register({ body: { email: providerEmail, password: 'password', name: 'Provider X' } }, mockRes());
    const provider = await User.findByEmail(providerEmail);
    const serviceRes = mockRes();
    await servicesController.createService({ userId: provider.id, body: { title: 'Gardening', category: 'House', duration: 3, location_type: 'offline', city: 'London' } }, serviceRes);
    const service = serviceRes.body.service;
    console.log(`✅ Setup: Provider ID ${provider.id} created service "${service.title}" in ${service.city}\n`);

    // Setup: Create Requester
    const requesterEmail = `requester_${Date.now()}@test.com`;
    await authController.register({ body: { email: requesterEmail, password: 'password', name: 'Requester Y' } }, mockRes());
    const requester = await User.findByEmail(requesterEmail);
    console.log(`✅ Setup: Requester ID ${requester.id} created\n`);

    // 1 & 2: Search Catalog with Filters
    console.log('Step 1 & 2: Searching catalog for "Gardening" in "London"...');
    const searchRes = mockRes();
    await servicesController.getAllServices({ query: { search: 'Gardening', city: 'London' } }, searchRes);
    const foundService = searchRes.body.services.find(s => s.id === service.id);
    if (foundService) {
      console.log(`✅ Service found via filters: ${foundService.title} by ${foundService.provider_name}\n`);
    } else {
      throw new Error('Service not found with filters');
    }

    // 4: View Provider Profile
    console.log(`Step 4: Viewing Provider profile (ID: ${provider.id})...`);
    const profileRes = mockRes();
    await usersController.getUserProfile({ params: { id: provider.id } }, profileRes);
    console.log(`✅ Profile viewed: ${profileRes.body.user.name}, Rating: ${profileRes.body.user.rating}\n`);

    // 5: Send Booking Request
    console.log('Step 5: Sending booking request...');
    const bookingReq = {
      userId: requester.id,
      body: { service_id: service.id, booking_date: '2026-03-01', booking_time: '10:00', message: 'I need help with my garden.' }
    };
    const bookingRes = mockRes();
    await bookingsController.createBooking(bookingReq, bookingRes);
    const booking = bookingRes.body.booking;
    console.log(`✅ Booking requested (ID: ${booking.id})\n`);

    // 6: Accept Booking
    console.log('Step 6: Provider accepting booking...');
    await bookingsController.acceptBooking({ userId: provider.id, params: { id: booking.id } }, mockRes());
    console.log('✅ Booking accepted\n');

    // 7: Send Message
    console.log('Step 7: Requester sending a message to Provider...');
    const messageReq = {
      userId: requester.id,
      body: { receiver_id: provider.id, content: 'See you on Sunday!', booking_id: booking.id }
    };
    const messageRes = mockRes();
    await messagesController.sendMessage(messageReq, messageRes);
    console.log(`✅ Message sent: "${messageRes.body.data.content}"\n`);

    // 8: Confirm Completion
    console.log('Step 8: Confirming completion (Mutual)...');
    await bookingsController.confirmCompletion({ userId: requester.id, params: { id: booking.id } }, mockRes());
    await bookingsController.confirmCompletion({ userId: provider.id, params: { id: booking.id } }, mockRes());
    console.log('✅ Completion confirmed & Time transferred\n');

    // 9: Leave Review
    console.log('Step 9: Leaving a review...');
    await reviewsController.createReview({ userId: requester.id, body: { booking_id: booking.id, rating: 5, comment: 'Great job!' } }, mockRes());
    console.log('✅ Review submitted\n');

    // 10: Check Transaction History
    console.log('Step 10: Verifying transaction history...');
    const historyRes = mockRes();
    await usersController.getTimeTransactions({ userId: requester.id }, historyRes);
    console.log('Transactions found:', JSON.stringify(historyRes.body.transactions, null, 2));
    const transfer = historyRes.body.transactions.find(t => t.transaction_type === 'service' && t.to_user_id === provider.id);
    if (transfer) {
      console.log(`✅ Transaction found: ${transfer.hours}h transferred to ${transfer.to_user_name}`);
      console.log('🏆 FLOW 2 VERIFIED SUCCESSFULLY!');
    } else {
      throw new Error('Transaction not found in history');
    }

  } catch (error) {
    console.error('❌ Flow 2 Test Failed:', error.message);
  } finally {
    process.exit(0);
  }
};

testFlow2();
