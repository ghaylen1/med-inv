const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { productId } = JSON.parse(event.body);

        if (!productId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Product ID required' })
            };
        }

        const result = await pool.query(
            `UPDATE products 
             SET quantity = GREATEST(quantity - 1, 0),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $1 
             RETURNING *`,
            [productId]
        );

        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Product not found' })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result.rows[0])
        };
    } catch (error) {
        console.error('Database error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to update quantity', 
                details: error.message 
            })
        };
    }
};
