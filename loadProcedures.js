const mysql = require('mysql2/promise');

exports.registerUser = async (req, res) => {
    const { name, email, phonenumber, password } = req.body;

    try {
        const connection = await mysql.createConnection({
            host: '172.0.0.16',
            user: 'sameer',
            password: 'gonc3ojrak2fn',
            database: 'webscrap',
        });

        const [results] = await connection.query(
            'CALL RegisterUser(?, ?, ?, ?)',
            [name, email, phonenumber, password]
        );

        await connection.end();

        res.status(201).json({
            message: 'User registered successfully',
            data: results,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error registering user',
            error: error.message,
        });
    }
};
