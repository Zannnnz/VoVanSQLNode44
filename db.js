import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost', //dia chi host cua mysqsl duoi local
    user: 'root', // ten nguoi dung
    password: '123456',//mật khẩu user
    database: 'node44',
    port:3307
});

export default pool;