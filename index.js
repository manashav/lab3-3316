const express = require('express');
const newConnection = require('./DBConnection');

const app = express();

//serve static contents
app.use(express.static('static'));

//dynamic handling

//this function is called to display the screen for the guests.

app.get('/guest', (request, response) => {
    
    let conn = newConnection();
    conn.connect();

    //a variable to hold the value of the rows
    let timeList;
    conn.query(`SELECT * FROM Availability`, (err, rows, fields) =>{
    
        timeList = rows; 
        let content = '';
        content += '<table style="width:100%" border="1px solid black">'; //displays table so that the guest can see previous responses while making their decision
        content += '<tr>';
        content += '<th>Name</th>';
        content += '<th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th>';
        content += '</tr>';
        for (t of timeList) //iterate over all the values in timeList
        {
            content += '<tr style="text-align:center">'; //displays table values
            content += '<td>'+t.Name+'</td><td>'+ t.Option1 +'</td><td>'+ t.Option2 +'</td><td>'+ t.Option3 +'</td><td>'+ t.Option4 +'</td><td>'+ t.Option5 +'</td>';
            content += '<td>'+ t.Option6 +'</td><td>'+ t.Option7 +'</td><td>'+ t.Option8 +'</td><td>'+ t.Option9 +'</td><td>' + t.Option10 +'</td>';
            content += '</tr>';
        }
        content += '</table>';

        //displays a form that when submitted takes you to /guest-answer.
        //the form is made up of checkboxes that let you choose which option you want. 
        content += `<form action='/guest-answer' method='post'> 
        Enter Your Name:
        <input name='name' type='text'/>
        <br>
        <input type="checkbox" id="option1" name="Option1" value="one">
        <label for="option1"> Option 1 </label><br>
        <input type="checkbox" id="option2" name="Option2" value="two">
        <label for="option2"> Option 2 </label><br>
        <input type="checkbox" id="option3" name="Option3" value="three">
        <label for="option3"> Option 3 </label><br>
        <input type="checkbox" id="option4" name="Option4" value="four">
        <label for="option4"> Option 4 </label><br>
        <input type="checkbox" id="option5" name="Option5" value="five">
        <label for="option5"> Option 5 </label><br>
        <input type="checkbox" id="option6" name="Option6" value="six">
        <label for="option6"> Option 6 </label><br>
        <input type="checkbox" id="option7" name="Option7" value="seven">
        <label for="option7"> Option 7 </label><br>
        <input type="checkbox" id="option8" name="Option8" value="eight">
        <label for="option8"> Option 8 </label><br>
        <input type="checkbox" id="option9" name="Option9" value="nine">
        <label for="option9"> Option 9 </label><br>
        <input type="checkbox" id="option10" name="Option10" value="ten">
        <label for="option10"> Option 10 </label><br>
        <input type="submit" value="Submit">
    </form>`
    response.send(content);
    })
    conn.end();
})

//this is used to access the body of the code
app.use(express.urlencoded({
    extended: true
}))

//to make sure that the admin credentials are correct.
app.post('/login', (request, response) => {
    let userName = request.body.usr;
    let password = request.body.pwd;
    let message = "Access Denied";

    if(userName == 'admin' && password=='123') //if the username and password are correct then redirect them to the admin page
    {
        response.redirect('./adminPage.html');
    }
    else
    {
        response.send(message);
    }
    
})

//this the function that deals with the selected time frames and inserts them into the database for the admin
app.get('/time-frames', (request,response) =>{

    //these are the values receieved from adminPage.html
    let one = request.query.f1;
    let two = request.query.f2;
    let three = request.query.f3;
    let four = request.query.f4;
    let five = request.query.f5;
    let six = request.query.f6;
    let seven = request.query.f7;
    let eight = request.query.f8;
    let nine = request.query.f9;
    let ten = request.query.f10;

    let conn = newConnection();
    conn.connect();

    //insert the values into the Availability Table
    conn.query(`INSERT INTO Availability values ("Admin",'${one}',
    '${two}','${three}', '${four}','${five}','${six}','${seven}',
    '${eight}','${nine}','${ten}')`
    ,(err,rows,fields) =>{
        response.redirect('/times'); //redirect to /times. 
    })

    conn.end();
})

//this displays the results of the database
app.get('/times',(request,response) => {
    let conn = newConnection();
    conn.connect();
    let timeList;
    conn.query(`SELECT * FROM Availability`, (err, rows, fields) =>{
    
        timeList = rows; //get all the rows
        let content = '';
        content += '<table style="width:100%" border="1px solid black">'; //create the table
        content += '<tr>';
        content += '<th>Name</th>';
        content += '<th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th>';
        content += '</tr>';
        for (t of timeList)
        {
            content += '<tr style="text-align:center">'; //display the collected values in the table
            content += '<td>'+t.Name+'</td><td>'+ t.Option1 +'</td><td>'+ t.Option2 +'</td><td>'+ t.Option3 +'</td><td>'+ t.Option4 +'</td><td>'+ t.Option5 +'</td>';
            content += '<td>'+ t.Option6 +'</td><td>'+ t.Option7 +'</td><td>'+ t.Option8 +'</td><td>'+ t.Option9 +'</td><td>' + t.Option10 +'</td>';
            content += '</tr>';
        }
        content += '</table>';

        content += '<a href="/guest"> Fill out as a Guest </a><br>'; //now they may be able to select their availability as a guest
        content += '<a href="./login.html"> Edit as Admin</a><br>'; //they can edit the times as an admin but this will require them to login again to prove they are the admin
        content += '<a href="./index.html"> Home Page </a><br>'; //they can return to the homepage. 
        response.send(content);
    })


    conn.end();
})

//adds the guest answers into the database
app.post('/guest-answer', (request, response) =>{

    //the guest name
    let nGuest = request.body.name;

    let one = "";
    let two = "";
    let three = "";
    let four = "";
    let five = "";
    let six = "";
    let seven = "";
    let eight = "";
    let nine = "";
    let ten = "";

    //if the corresponding checkbox was checked then change the value of its corresponding variable to ✓
    if(request.body.Option1){one = '✓';}
    if(request.body.Option2){two = '✓';}
    if(request.body.Option3){three = '✓';}
    if(request.body.Option4){four = '✓';}
    if(request.body.Option5){five = '✓';}
    if(request.body.Option6){six = '✓';}
    if(request.body.Option7){seven = '✓';}
    if(request.body.Option8){eight = '✓';}
    if(request.body.Option9){nine = '✓';}
    if(request.body.Option10){ten = '✓';}
    
   

    let conn = newConnection();
    conn.connect();
    //insert them into the database
    conn.query(`INSERT INTO Availability values ('${nGuest}','${one}',
    '${two}','${three}', '${four}','${five}','${six}','${seven}',
    '${eight}','${nine}','${ten}')`
    ,(err,rows,fields) =>{
        response.redirect('/times');
    })

    conn.end();
})


app.listen(80);
