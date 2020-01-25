//******************************************************/
//  Main functionality.... Installing dependencies   
//******************************************************/

let express=require('express');
let path=require('path');
let fs=require('fs');

//***************************************/
//  Setting port functionality
//***************************************/

let serverPort=3200;                             // defining port for server to listen
let app=express();                               // creating application using express
app.use(express.urlencoded({extended: true}));   // allowing data parsing using json/html
app.use(express.json());

//********************************************************************************/
//  If we get to the root of the application, we will serve the file index.html
//********************************************************************************/
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'index.html'))
});

//*****************************************************************/
//  If we get to /tables then we will serve the file tables.html        WORKS
//*****************************************************************/
app.get('/tables',function(req,res){
    res.sendFile(path.join(__dirname,'tables.html'))
});

//*****************************************************************/
//  If we get to /reserve then we will serve the file reserve.html     WORKS
//*****************************************************************/
app.get('/reserve',function(req,res){
    res.sendFile(path.join(__dirname,'reserve.html'))
});

//***************************************************************/
//  Setting the route if we get a request to view the tables           WORKS
//***************************************************************/
app.get('/api/tables/',function(req,res){
    let tablesraw=fs.readFileSync('tables.json','utf8');
    let tablesjson=JSON.parse(tablesraw);
    return res.json(tablesjson);
});

//***************************************************************/
//  Setting the route if we get a request to view the waitlist          WORKS
//***************************************************************/
app.get('/api/waitlist/',function(req,res){
    let waitlistraw=fs.readFileSync('waitlist.json','utf8');
    let waitlistjson=JSON.parse(waitlistraw);
    return res.json(waitlistjson);
});


//**************************************************************************************/
//  Setting the route if we get a request to clear the waitlist and tables reservations     WORKS
//**************************************************************************************/
app.post('/api/clear/',function(req,res){
    let emptylist=[];
    fs.writeFileSync('tables.json',JSON.stringify(emptylist));
    fs.writeFileSync('waitlist.json',JSON.stringify(emptylist));
    console.log('Just cleaned the JSON tables (both of them the reservations and the waitlist)')
    return;
});

//*******************************************************************************/
//  If we get a request to post a reservation, then we will add it to the table
//*******************************************************************************/
app.post('/api/tables/',function(req,res){
    console.log('getting request to post api/tables');
    let newReservation=req.body;
    let tables=JSON.parse(fs.readFileSync('./tables.json','utf8'));           // Reading the tables
    console.log(tables.length);
    if(tables.length<5){                                                      // If  there are tables available
        tables.push(newReservation);                                          // Pushes into the array
        fs.writeFileSync('./tables.json',JSON.stringify(tables));             // Rewriting the file
        console.log('Reserving the table for the client, returning true');
        return res.json(true);                                                          // Tells the application they have a seat at the table
    } else {                                                                  // If there are no tables, goes into the waitlist
        let waitlist=JSON.parse(fs.readFileSync('./waitlist.json','utf8'));   // reads file
        waitlist.push(newReservation);                                        // appends new reservation
        fs.writeFileSync('./waitlist.json',JSON.stringify(waitlist));         // Rewriting the file
        console.log('Putting customer on waitlist, returning false');
        return res.json(false);
    }
});


//******************************************/
//  setting the server to start listening  
//******************************************/
app.listen(serverPort,function(){
    console.log('I am listening at port 3200');
})