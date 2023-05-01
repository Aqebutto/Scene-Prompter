// typeormconfig.js
module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'whitespike',
  password: '54862353',
  database: 'mydb',
  entities: ['src/**/*.entity{.ts,.js}'],
  synchronize: true,
};
