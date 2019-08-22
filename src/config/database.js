module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'rhapp',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
