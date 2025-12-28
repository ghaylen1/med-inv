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
        const { productId, quantity } = JSON.parse(event.body);

        if (!productId || quantity === undefined) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Product ID and quantity required' 
                })
            };
        }

        const newQuantity = Math.max(0, parseInt(quantity));

        const result = await pool.query(
            `UPDATE products 
             SET quantity = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 
             RETURNING *`,
            [newQuantity, productId]
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
                error: 'Failed to update product', 
                details: error.message 
            })
        };
    }
};
