// -bamazonCustomer.js.  will display all of the items available for sale. Include the ids, names, and prices of products for sale.

// -The app should then prompt users with two messages.
//     The first should ask them the ID of the product they would like to buy.
//     The second message should ask how many units of the product they would like to buy.
    
// -Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.



//     If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.

//     if your store does have enough of the product, you should fulfill the customer's order.


// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.

// npm packages

var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '12345',
    database: 'bamazon_db'
});

connection.connect(function(err,res){
    if(err) throw err;
    console.log('connected to ' + connection.threadId)
    showAllProducts();
});


// DONE--display all items first on page load
function showAllProducts(){
    connection.query('SELECT * FROM bamazon_db.products;', function(err,data){
        if(err) throw err;
        console.table(data)
        console.log('This is what we have currently in stock. ')   
        buyWhat();
    });
    
};
// DONE--inq prompt
function buyWhat(){
    // query db for all item-id
    // connection.query('select * from products',function(err,res){
    //     if(err) throw err;
    
        inquirer.prompt([
        {
            name: 'choice',
            type:'input',
            message: 'Please enter the id number for the product you wish to buy'
        },
        {
            name:'number',
            type: 'input',
            message: 'How many would you like to purchase?'
        }
    ])
    .then(function(answer){
        console.log(answer.choice + '$$' + answer.number)
        connection.query('select item_id from products where ? and ?',[
            {
                item_id : answer.choice
            },
            {
                stock_quantity : answer.number
            }], function(resp){
                  
                    console.log(answer.choice)
    
                    //working now.
                    connection.query('select stock_quantity from products', 
                    // [{
                    //     stock_quantity: ansnwer.number
                    // }],
                    function(err, response){
                         if(answer.number > response[0].stock_quantity) {
                        console.log(response[0].stock_quantity + '%%%')
                        console.log("Sorry, insufficient stock");
                        // buyWhat();
                        } else{
                        console.log('yay!')
                        }
                    })   
         }) 
    })
    
};
