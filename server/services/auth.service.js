const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const AuthService = {
  generateToken(data, expiresIn = '30d') {
    let token;
    try {
      token = JWT.sign(data, process.env.JWT_SECRET, {
        expiresIn: expiresIn,
      });
    } catch (e) {
      token = null;
      throw Error(e.message);
    }
    return token;
  },
  VerifyToken(token) {
    const data = JWT.decode(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return {};
      else return decoded;
    });
    return data;
  },
  async generateHashPassword(password) {
    let hashPassword = 'NA';
    try {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
      return hashPassword;
    } catch (e) {
      throw Error(e.message);
    }
  },
  async verifyPassword(password, hashPassword) {
    let data = false;
    try {
      data = await bcrypt.compare(password, hashPassword);
      return data;
    } catch (e) {
      throw Error(e.message);
    }
  },
  generateRandomPassword(length = 12) {
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$_';

    const allChars = upperCaseChars + lowerCaseChars + numbers + specialChars;

    const getRandomChar = (characters) =>
      characters[Math.floor(Math.random() * characters.length)];
    let password =
      getRandomChar(upperCaseChars) +
      getRandomChar(lowerCaseChars) +
      getRandomChar(numbers) +
      getRandomChar(specialChars);

    for (let i = password.length; i < length; i++) {
      password += getRandomChar(allChars);
    }

    password = password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');

    return password;
  },
};

module.exports = AuthService;
