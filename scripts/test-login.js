// Test login script
async function testLogin() {
  try {
    console.log('🔐 Testing login...\n');

    const loginData = {
      email: 'admin@cafe.com',
      password: 'admin123'
    };

    console.log('📝 Login details:');
    console.log(`📧 Email: ${loginData.email}`);
    console.log(`🔑 Password: ${loginData.password}\n`);

    const response = await fetch('http://localhost:3000/api/auth/sign-in/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Login successful!');
      console.log('🎉 You can now access the admin panel at: http://localhost:3000/admin');
    } else {
      const error = await response.text();
      console.log('❌ Login failed:', error);

      if (response.status === 401) {
        console.log('\n💡 Incorrect password or email');
        console.log('🔍 Trying to check if user exists...');

        // Check if user exists
        const checkResponse = await fetch('http://localhost:3000/api/auth/sign-up/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'admin@cafe.com',
            password: 'admin123',
            name: 'Cafe Admin',
            username: 'admin'
          }),
        });

        if (checkResponse.status === 400) {
          console.log('✅ User exists, but password might be incorrect');
          console.log('💡 Try resetting password or creating a new admin user');
        }
      }
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    console.log('\n💡 Make sure the development server is running on http://localhost:3000');
  }
}

testLogin();