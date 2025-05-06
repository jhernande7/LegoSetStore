import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sql3 = sqlite3.verbose();




const db = new sql3.Database('./database/mydb.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if(err){
        console.error('Database connection error: ' + err.message);
        return
    }
    console.log('Connected to the database.'); 

    // we need to read and exectue the sql file to create the tables 
    const createTablesPath = path.join(__dirname, 'database','create_tables.sql');

    fs.readFile(createTablesPath, 'utf8', (err, sql) => {
        if (err) {
            console.error('Error reading SQL file: ' + err.message);
            return;
        }
        db.exec(sql, (err) => {
            if (err) {
                console.error('Error executing SQL: ' + err.message);
                return;
            } 
            console.log('Tables created successfully.');


            // check to see if data is present
            db.get(`SELECT COUNT(*) as count FROM categories`, (err, row) => {
                if (err) {
                    console.error('Error checking categories table: ' + err.message);
                    seedDatabase();
                } else if (row.count === 0) {
                    console.log('No data found in categories table. seeding database...');
                    seedDatabase();
                } else {
                    console.log('Database already seeded with data.');
                }
            });
    });
});
});


//function for seeding the database
function seedDatabase() {
    const seedPath = path.join(__dirname, 'database', 'seed.sql');
    fs.readFile(seedPath, 'utf8', (err, seedSql) => {
        if (err) {
            console.error('Error reading seed SQL file: ' + err.message);
            return;
        }
        console.log('Seed SQL FILE read successfully. Executing SQL.');
        db.exec(seedSql, (err) => {
            if (err) {
                console.error('Error executing seed SQL: ' + err.message);
                return;
            } 
            console.log('Database seeded successfully.');
        });
    });
}

export default db;

