require('dotenv').config();
const database = require('./config/database');
const authController = require('./controllers/auth.controller');
const usersController = require('./controllers/users.controller');
const servicesController = require('./controllers/services.controller');
const bookingsController = require('./controllers/bookings.controller');
const reviewsController = require('./controllers/reviews.controller');
const User = require('./models/User');
const Service = require('./models/Service');
const Booking = require('./models/Booking');

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

const testFullFlow = async () => {
  try {
    await database.connect();
    console.log('🧪 Starting Full User Flow Test...\n');

    // --- Step 1 & 2: Register & Profile ---
    console.log('Step 1 & 2: Registering User A...');
    const regReqA = {
      body: {
        email: `usera_${Date.now()}@test.com`,
        password: 'password123',
        name: 'User A'
      }
    };
    const regResA = mockRes();
    await authController.register(regReqA, regResA);
    const userA = regResA.body.user;
    console.log(`✅ Registered User A: ${userA.email} (ID: ${userA.id})`);

    console.log('Updating Profile for User A...');
    const updateReqA = {
      userId: userA.id,
      body: {
        city: 'Tbilisi',
        bio: 'Expert in JS and Woodworking',
        skills: ['JavaScript', 'Woodworking']
      }
    };
    const updateResA = mockRes();
    await usersController.updateProfile(updateReqA, updateResA);
    console.log('✅ Profile updated\n');

    // --- Step 3: Create Service ---
    console.log('Step 3: Creating Service for User A...');
    const serviceReq = {
      userId: userA.id,
      body: {
        title: 'JavaScript Mentoring',
        description: 'I will teach you how to code in JS',
        category: 'Education',
        duration: 2,
        location_type: 'online'
      }
    };
    const serviceRes = mockRes();
    await servicesController.createService(serviceReq, serviceRes);
    const service = serviceRes.body.service;
    console.log(`✅ Service created: ${service.title} (ID: ${service.id}, Duration: ${service.duration}h)\n`);

    // --- Step 4: Register User B ---
    console.log('Step 4: Registering User B...');
    const regReqB = {
      body: {
        email: `userb_${Date.now()}@test.com`,
        password: 'password123',
        name: 'User B'
      }
    };
    const regResB = mockRes();
    await authController.register(regReqB, regResB);
    const userB = regResB.body.user;
    console.log(`✅ Registered User B: ${userB.email} (ID: ${userB.id})\n`);

    // --- Step 5: Search & Book ---
    console.log('Step 5: User B searching and booking User A\'s service...');
    const bookingReq = {
      userId: userB.id,
      body: {
        service_id: service.id,
        booking_date: '2026-02-15',
        booking_time: '14:00',
        message: 'I want to learn JS!'
      }
    };
    const bookingRes = mockRes();
    await bookingsController.createBooking(bookingReq, bookingRes);
    if (bookingRes.statusCode === 400) {
        console.error('❌ Booking failed:', bookingRes.body.error);
        process.exit(1);
    }
    const booking = bookingRes.body.booking;
    console.log(`✅ Booking created (ID: ${booking.id}, Status: ${booking.status})\n`);

    // --- Step 7: Accept Booking ---
    console.log('Step 7: User A accepting the booking...');
    const acceptReq = {
      userId: userA.id,
      params: { id: booking.id }
    };
    const acceptRes = mockRes();
    await bookingsController.acceptBooking(acceptReq, acceptRes);
    console.log(`✅ Booking accepted (Status: ${acceptRes.body.booking.status})\n`);

    // --- Step 8: Confirm Completion ---
    console.log('Step 8: Confirming completion (Mutual)...');
    
    console.log('User B (Requester) confirms completion...');
    const confirmReqB = {
      userId: userB.id,
      params: { id: booking.id }
    };
    const confirmResB = mockRes();
    await bookingsController.confirmCompletion(confirmReqB, confirmResB);
    console.log(`Status after B: ${confirmResB.body.message}`);

    console.log('User A (Provider) confirms completion...');
    const confirmReqA = {
      userId: userA.id,
      params: { id: booking.id }
    };
    const confirmResA = mockRes();
    await bookingsController.confirmCompletion(confirmReqA, confirmResA);
    console.log(`✅ Status after A: ${confirmResA.body.message}\n`);

    // --- Step 9: Leave Review ---
    console.log('Step 9: User B leaving a review for User A...');
    const reviewReq = {
      userId: userB.id,
      body: {
        booking_id: booking.id,
        rating: 5,
        comment: 'Excellent mentor! Highly recommended.'
      }
    };
    const reviewRes = mockRes();
    await reviewsController.createReview(reviewReq, reviewRes);
    console.log(`✅ Review created (ID: ${reviewRes.body.review.id}, Rating: 5/5)\n`);

    // --- Step 10: Verify Balance & Rating ---
    console.log('Step 10: Verifying updates...');
    const finalUserA = await User.findById(userA.id);
    const finalUserB = await User.findById(userB.id);

    console.log(`User A (Provider) - Final Balance: ${finalUserA.time_balance}h (Expected: 7.0h)`);
    console.log(`User A (Provider) - Final Rating: ${finalUserA.rating} (Expected: 5.0)`);
    console.log(`User A (Provider) - Total Reviews: ${finalUserA.total_reviews} (Expected: 1)`);
    
    console.log(`User B (Requester) - Final Balance: ${finalUserB.time_balance}h (Expected: 3.0h)`);

    if (finalUserA.time_balance === 7.0 && finalUserB.time_balance === 3.0 && finalUserA.rating === 5.0) {
      console.log('\n🏆 ALL TESTS PASSED! FULL USER FLOW VERIFIED.');
    } else {
      console.log('\n⚠️ SOME RESULTS DIFFER FROM EXPECTATIONS. Check logic.');
    }

  } catch (error) {
    console.error('❌ Unexpected Error during test:', error);
  } finally {
    process.exit(0);
  }
};

testFullFlow();
