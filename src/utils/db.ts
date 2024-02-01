import mysql, { ConnectionOptions } from "mysql2";

const ConnectionConfig: ConnectionOptions = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || "3306"),
    database: process.env.DB_DATABASE || 'test',
};

const connection =mysql.createConnection(ConnectionConfig)

connection.connect((error:Error | unknown)=>{
    if(error){
        console.error("Error connecting to MySQL database: ", error)
    }else{
        console.log('Connected to MySQL database!')
    }
})

export default connection