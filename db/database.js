/*
const mysql = require('mysql2');

const connection = mysql.createPool({
      host: 'localhost',
      user: 'dlaz', // نام کاربری MySQL
      password: 'danial20811', // رمز عبور
      database: 'bank' // نام پایگاه داده
}).promise()

module.exports = connection;
*/
const mysql = require('mysql2');

// اطلاعات اتصال

  const db = mysql.createPool({
  user: 'dlaz',
  host: 'localhost',
  database: 'bank',
  password:"danial20811" ,
  multipleStatements:true
}).promise()


// اتصال به پایگاه 
module.exports=db