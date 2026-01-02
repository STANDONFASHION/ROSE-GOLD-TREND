const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

module.exports = async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'missing token' });

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await db('users').where({ id: payload.id }).first();
    if (!user) return res.status(401).json({ error: 'invalid token' });

    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' });
  }
};
