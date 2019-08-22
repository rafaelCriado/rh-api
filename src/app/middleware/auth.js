import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  try {
    const authHeaders = req.headers.authorization;

    //Verifica se existe a authorization
    if (!authHeaders) {
      return res.status(400).json({ error: 'Token not provided' });
    }

    const [, token] = authHeaders.split(' ');

    var decoded = jwt.verify(token, authConfig.secret);

    //Toda rota autorizada recebe o campo userID no body
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json(err);
  }
};
