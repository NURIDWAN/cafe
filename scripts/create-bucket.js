const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

async function createBucket() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Error: Missing Supabase credentials in .env');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        console.log('Creating "cafe-website" bucket...');
        const { data, error } = await supabase.storage.createBucket('cafe-website', {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        });

        if (error) {
            if (error.message.includes('already exists')) {
                console.log('✅ Bucket "images" already exists.');
            } else {
                console.error('❌ Failed to create bucket:', error.message);
                console.log('Note: If you are using the Anon Key, you might not have permission to create buckets. Please create it manually in the Supabase Dashboard.');
            }
        } else {
            console.log('✅ Bucket "images" created successfully!');
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

createBucket();
