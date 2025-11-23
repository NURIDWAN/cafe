// Reset password for existing admin user
async function resetPassword() {
  try {
    console.log('🔧 Resetting admin password...\n');

    const userData = {
      email: 'admin@cafe.com',
      password: 'admin123',
      name: 'Cafe Admin',
      username: 'admin'
    };

    // Try to create new admin (will fail if exists)
    const response = await fetch('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      console.log('✅ New admin created successfully!');
    } else {
      const error = await response.json();
      console.log('ℹ️  Admin already exists, creating alternative admin...\n');

      // Create alternative admin
      const altData = {
        email: 'admin2@cafe.com',
        password: 'admin123',
        name: 'Cafe Admin 2',
        username: 'admin2'
      };

      const altResponse = await fetch('http://localhost:3000/api/auth/sign-up/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(altData),
      });

      if (altResponse.ok) {
        console.log('✅ Alternative admin created!');
        console.log('\n📋 Alternative Login Details:');
        console.log(`📧 Email: ${altData.email}`);
        console.log(`🔑 Password: ${altData.password}`);
        console.log(`👤 Name: ${altData.name}`);
        console.log(`🆔 Username: ${altData.username}`);
      } else {
        console.log('❌ Failed to create alternative admin');
      }
    }

    console.log('\n🌐 Login at: http://localhost:3000/login');
    console.log('🔗 Admin panel: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Network error:', error.message);
    console.log('\n💡 Make sure the development server is running on http://localhost:3000');
  }
}

resetPassword();