const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

async function testUpload() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Error: Missing Supabase credentials in .env');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const bucketName = 'cafe-website';
    const fileName = `test-upload-${Date.now()}.png`;
    // Create a minimal 1x1 PNG buffer
    const fileContent = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

    console.log(`Attempting to upload to bucket "${bucketName}"...`);

    try {
        const { data, error } = await supabase
            .storage
            .from(bucketName)
            .upload(fileName, fileContent, {
                contentType: 'image/png',
                upsert: true
            });

        if (error) {
            console.error('❌ Upload failed:', error.message);
            if (error.message.includes('row-level security')) {
                console.log('👉 Hint: Check your Storage Policies in Supabase. You need to allow INSERT/UPLOAD for the Anon role.');
            } else if (error.message.includes('not found')) {
                console.log(`👉 Hint: Verify that the bucket "${bucketName}" exists and is set to PUBLIC.`);
            }
        } else {
            console.log('✅ Upload successful!');
            console.log('Path:', data.path);

            const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(data.path);
            console.log('Public URL:', publicUrl);

            // Clean up
            console.log('Cleaning up...');
            await supabase.storage.from(bucketName).remove([data.path]);
            console.log('✅ Test file removed.');
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testUpload();
