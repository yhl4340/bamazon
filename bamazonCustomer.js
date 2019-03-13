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

var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "12345",
  database: "bamazon_db"
});

connection.connect(function(err, res) {
  if (err) throw err;
  console.log("connected to " + connection.threadId);
  showAllProducts();
});

// DONE--display all items first on page load
function showAllProducts() {
  connection.query("SELECT * FROM bamazon_db.products;", function(err, data) {
    if (err) throw err;
    console.table(data);
    console.log("This is what we have currently in stock. ");
    buyWhat();
  });
}
// DONE--inq prompt
function buyWhat() {
  // query db for all item-id

  inquirer
    .prompt([
      {
        name: "choice",
        type: "input",
        message: "Please enter the id number for the product you wish to buy"
      },
      {
        name: "number",
        type: "input",
        message: "How many would you like to purchase?"
      }
    ])
    .then(function(answer) {
      // console.log(answer.choice + "$$" + answer.number);

      //query mysql and target the item_id prop
      connection.query(
        "select item_id from products where ?",
        [
          {
            item_id: answer.choice
          }
        ],
        function(resp) {
          connection.query(
            "select * from products where ? ",
            [
              {
                item_id: answer.choice
              }
            ],
            function(err, response) {
            //   console.log(response);
              if (answer.number > response[0].stock_quantity) {
                console.log(response[0].stock_quantity + '%%%'+ response[0].product_name)
                console.log("Sorry, insufficient stock. Please order less");
                buyWhat();
              } else {
                console.log("We have enough in stock for your order!");
                if (answer.number <= response[0].stock_quantity) {
                  var newQty = response[0].stock_quantity - answer.number;
                  var total = parseInt(answer.number * response[0].price);
                  connection.query(
                    "update products set ? where ?",
                    [
                      {
                        stock_quantity: newQty
                      },
                      {
                        item_id: answer.choice
                      }
                    ],
                    function(err, reply) {
                       
                      console.log(
                        "============================ \n Order has been placed.\n **************************\n Here is a recap: \n Name of product: " +
                          response[0].product_name +
                          "\n Quantity purchased: " +
                          answer.number +
                          "\n Total is : " +
                          total +
                          "\n *************************** \n ============================="
                      ); 
                      console.log(
                          '\n\n' +
                          newQty + ' Remaining quantity for ' +
                          response[0].product_name + ': ' + answer.number)
                    }
                  );
                }
              }
            }
          );
        }
      );
    });
}
