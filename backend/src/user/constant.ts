export const bcryptConstants = {
  saltRounds: (process.env['BCRYPT_SALT_ROUNDS'] && parseInt(process.env['BCRYPT_SALT_ROUNDS'])) || 10,
};
