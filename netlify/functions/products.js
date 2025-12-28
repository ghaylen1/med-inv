// Products API - Netlify Serverless Function
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
};

exports.handler = async (event) => {
    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const { httpMethod } = event;
        const params = event.queryStringParameters || {};

        switch (httpMethod) {
            case 'GET':
                return await handleGet(params);
            case 'POST':
                return await handlePost(JSON.parse(event.body));
            case 'PUT':
                return await handlePut(JSON.parse(event.body));
            case 'DELETE':
                return await handleDelete(params.id);
            default:
                return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Server error', message: error.message })
        };
    }
};

// GET - Fetch products
async function handleGet(params) {
    if (params.id) {
        const result = await sql`SELECT * FROM products WHERE id = ${params.id}`;
        return {
            statusCode: result.length ? 200 : 404,
            headers,
            body: JSON.stringify(result[0] || { error: 'Not found' })
        };
    }

    const result = await sql`SELECT * FROM products ORDER BY category, name`;
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, count: result.length, products: result })
    };
}

// POST - Create product
async function handlePost(data) {
    const { name, unit, quantity, type, category, partner, remarks, brand, expired } = data;

    if (!name) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Name required' }) };
    }

    const result = await sql`
        INSERT INTO products (name, unit, quantity, type, category, partner, remarks, brand, expired)
        VALUES (${name}, ${unit || null}, ${quantity || 0}, ${type || null}, ${category || 'medical'}, ${partner || null}, ${remarks || null}, ${brand || null}, ${expired || false})
        RETURNING *
    `;

    return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ success: true, product: result[0] })
    };
}

// PUT - Update product
async function handlePut(data) {
    const { id, ...updates } = data;

    if (!id) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'ID required' }) };
    }

    // Build update dynamically
    const fields = Object.keys(updates).filter(k => updates[k] !== undefined);
    if (fields.length === 0) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'No fields to update' }) };
    }

    // Simple quantity update
    if (fields.length === 1 && fields[0] === 'quantity') {
        const result = await sql`
            UPDATE products SET quantity = ${updates.quantity}, updated_at = NOW() WHERE id = ${id} RETURNING *
        `;
        if (result.length === 0) {
            return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
        }
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, product: result[0] }) };
    }

    // Full update
    const result = await sql`
        UPDATE products SET
            name = COALESCE(${updates.name}, name),
            unit = COALESCE(${updates.unit}, unit),
            quantity = COALESCE(${updates.quantity}, quantity),
            type = COALESCE(${updates.type}, type),
            category = COALESCE(${updates.category}, category),
            partner = COALESCE(${updates.partner}, partner),
            remarks = COALESCE(${updates.remarks}, remarks),
            brand = COALESCE(${updates.brand}, brand),
            expired = COALESCE(${updates.expired}, expired),
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
    `;

    if (result.length === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, product: result[0] }) };
}

// DELETE - Remove product
async function handleDelete(id) {
    if (!id) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'ID required' }) };
    }

    const result = await sql`DELETE FROM products WHERE id = ${id} RETURNING id, name`;

    if (result.length === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, deleted: result[0] }) };
}
