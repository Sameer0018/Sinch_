const db = require('./src/config/db'); // Adjust the path as needed

async function testDBConnection() {
    try {
        const [rows] = await db.query('SELECT 1');
        console.log('DB Connection Successful:', rows);
    } catch (err) {
        console.error('DB Connection Error:', err.message);
    }
}

testDBConnection();
