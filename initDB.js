const mysql = require('mysql');

let conn = mysql.createConnection({
    host:'34.122.94.188',
    user:'root',
    password:'mypassword',
    database:'Doodle'
});

conn.connect();

//drops the table if it was created before to be able to reset and initialize it again. 
conn.query(`DROP Table Availability`,
                (err,rows,fields) => {
                    if (err)
                        console.log(err);
                    else
                        console.log('Table Dropped');
                }
            )

//creates the tables and sets the columns
conn.query(`CREATE TABLE Availability
            (
                Name varchar(100),
                Option1 varchar(100),
                Option2 varchar(100),
                Option3 varchar(100),
                Option4 varchar(100),
                Option5 varchar(100),
                Option6 varchar(100),
                Option7 varchar(100),
                Option8 varchar(100),
                Option9 varchar(100),
                Option10 varchar(100)
            )
            ` 
            , (err,rows,fields) => {
                if (err)
                    console.log(err);
                else
                    console.log('Table Created');
            })

conn.end();