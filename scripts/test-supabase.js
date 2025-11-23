const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

async function testConnection() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('Testing Supabase Connection...');
    console.log('URL:', supabaseUrl ? 'Set' : 'Missing');
    console.log('Key:', supabaseKey ? 'Set' : 'Missing');

    if (!supabaseUrl || !supabaseKey) {
        console.error('Error: Missing Supabase credentials in .env');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { data, error } = await supabase.storage.listBuckets();
        if (error) {
            console.error('Connection failed:', error.message);
        } else {
            console.log('Connection successful!');
            console.log('Buckets:', data.map(b => b.name));

            const imagesBucket = data.find(b => b.name === 'images');
            if (imagesBucket) {
                console.log('✅ "images" bucket found.');
            } else {
                console.warn('⚠️ "images" bucket NOT found. Please create it in your Supabase dashboard.');
            }
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
