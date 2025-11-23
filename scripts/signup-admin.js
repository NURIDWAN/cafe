// Simple script to create admin user via Better Auth API
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createAdmin() {
  try {
    console.log('🔧 Creating admin user...\n');

    // User details
    const userData = {
      email: 'admin@cafe.com',
      password: 'admin123',
      name: 'Cafe Admin',
      username: 'admin'
    };

    console.log('📝 User details:');
    console.log(`📧 Email: ${userData.email}`);
    console.log(`🔑 Password: ${userData.password}`);
    console.log(`👤 Name: ${userData.name}`);
    console.log(`🆔 Username: ${userData.username}\n`);

    // Use Better Auth API directly
    const response = await fetch('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Admin user created successfully!');
      console.log('\n🌐 Login at: http://localhost:3000/login');
      console.log('🔗 Admin panel: http://localhost:3000/admin');
    } else {
      const error = await response.json();
      console.log('❌ Error:', error.message);

      if (error.message?.includes('already exists')) {
        console.log('\n💡 Admin user already exists. You can login with:');
        console.log(`📧 Email: ${userData.email}`);
        console.log(`🔑 Password: ${userData.password}`);
        console.log('\n🌐 Login at: http://localhost:3000/login');
      }
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    console.log('\n💡 Make sure the development server is running on http://localhost:3000');
  }

  rl.close();
}

createAdmin();