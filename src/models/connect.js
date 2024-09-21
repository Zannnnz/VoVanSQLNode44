import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    'Node44_youtube',//ten database
    'root',//ten user
    '123456',//password
    {
        host: 'localhost',
        port: 3307,
        dialect: "mysql"
    }
)

export default sequelize;