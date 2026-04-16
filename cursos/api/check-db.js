const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkUsers() {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ DB Connected');

        const Usuario = mongoose.model('Usuario', new mongoose.Schema({ email: String, rol: String }));
        const users = await Usuario.find({});

        console.log('Total users found:', users.length);
        users.forEach(u => console.log(`- ${u.email} (${u.rol})`));

        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

checkUsers();
