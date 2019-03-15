// var inquirer = require("inquirer");
// var mysql = require("mysql");

// var connection = mysql.createConnection({
//   host: "localhost",
//   port: 3306,
//   user: "root",
//   password: "12345",
//   database: "bamazon_db"
// });

// connection.connect(function(err, res) {
//   if (err) throw err;
//   console.log("connected to " + connection.threadId);
//   menuOpt();
// });


// function menuOpt() {
// //   viewProducts();
//   inquirer
//     .prompt({
//       name: "menu",
//       type: "list",
//       message: "what would you like to view?",
//       choices: [
//         "View products for sale",
//         "View low inventory",
//         "Add to inventory",
//         "Add to product",
//         "Exit"
//       ]
//     })
//     .then(function(answer) {
//       switch (answer.menu) {
//         case "View products for sale":
//           viewProducts();
//           break;
//         case "View low inventory":
//           lowInventory();
//           break;
//         case "Add to inventory":
//           viewProducts(addInventory);
//           break;
//         case "Add to product":
//           addProduct();
//           break;
//         case "Exit":
//           connection.end();
//         default:
//           console.log("Thank you. You have been logged out");
//           break;
//       }
//     });
// }

// function viewProducts(cb) {
//   console.log('\n');
//   console.log(
//     "Here is the table of products we have on hand currently" +
//     '\n****************************************************');
//   connection.query("select * from products", function(err, data) {
//     if (err) throw err;
//     console.log("\n");
//     console.table(data);
//     console.log('\n')
//     // if cb is passed in as a param, then treats it as an empty f(x). this
//     // bypass the 'cb isn't a f(x) err
//     if (typeof cb !== "undefined") {
//       cb();
//     }
 
//   // inquirer.prompt([
//   //     {
//   //         // ????????????????this is showing up on addinventory()!!
//   //         name: 'goBack',
//   //         type:'confirm',
//   //         message: 'Would you like to return to the main page?',  
//   //         default: true      
//   //     }
//   // ]).then(function(rly){
//   //   console.log(rly,'reply')
//   //   console.log(err, 'err')
//   //     if(rly.goBack === true){
//   //         menuOpt();
//   //     } else{
//   //         console.log('You have been logged out');
//   //         connection.end();
//   //     }
//   // })
//  });
// }

// function lowInventory() {
//   console.log('\n\n')
//   connection.query(
//     "select * from products where stock_quantity <5",
//     function(err, dataRes) {
//       console.log("\n");
//       console.table(dataRes);
//       console.log('\n')
//     });
//     // menuOpt();
//   inquirer.prompt([
//       {
//         name: "action",
//         type: "confirm",
//         message: "Would you like to add to the inventory?",
//         default: true
//       }
//     ])
//     .then(function(promptAnswer) {
//       console.log(promptAnswer)
//       if (promptAnswer.action == true) {
//         addInventory();
//       } else {
//         connection.end();
//       };
//     });
// };

// function addInventory() {
//   //??????????????????????// prompt from view product is showing up!!
//   inquirer
//     .prompt([
//       {
//         name: "item",
//         type: "input",
//         message: "What item would you like to add to?"
//       },
//       {
//         name: "num",
//         type: "input",
//         message: "How many do you want to add?"
//       }
//     ])
//     .then(function(ans) {
//       connection.query(
//         "select * from products where ?",
//         [
//           {
//             item_id: ans.item
//           }
//         ],
//         function(err, response) {
//           if (err) throw err;
//           console.log("err:", err, "res:", response[0].product_name, "!!!");
//           var newQty = response[0].stock_quantity + parseInt(ans.num);

//           console.log(newQty + "newQty");
//           connection.query(
//             "update products set ? where ?",
//             [
//               {
//                 stock_quantity: newQty
//               },
//               {
//                 item_id: ans.item
//               }
//             ],
//             function(err, res) {
//               console.log(
//                 ans.num +
//                   " " +
//                   response[0].product_name +
//                   " has been added!\n The new total is " +
//                   newQty +
//                   response[0].product_name
//               );
//               // viewProducts();
//             }
//           );
//         }
//       );
//     });
// }

// function addProduct() {
//   inquirer
//     .prompt([
//       {
//         name: "addName",
//         type: "input",
//         message: "What is the name of the product would you like to add?"
//       },
//       {
//         name: "dept",
//         type: "input",
//         message: "What department is this product from?"
//       },
//       {
//         name: "price",
//         type: "input",
//         message: "How much do you want to price it per unit?"
//       },
//       {
//         name: "qty",
//         type: "input",
//         message: "How many units do you want to add?"
//       }
//     ])
//     .then(function(results) {
//       console.log("test");
//       connection.query(
//         "insert into products set ?",

//         {
//           product_name: results.addName,
//           dept_name: results.dept,
//           price: results.price,
//           stock_quantity: results.qty
//         },

//         function(err, resp) {
         
//           console.log("---------------------------------");
//           console.log(
//             "Product Name: " +
//               results.addName +
//               "\n Department: " +
//               results.dept +
//               "\n Price: " +
//               results.price +
//               "\n Quantity: " +
//               results.qty +
//               "\n has been added to the inventory"
//           );
//           inquirer
//             .prompt([
//               {
//                 name: "toAdd",
//                 type: "confirm",
//                 message: "Confirm to proceed?",
//                 default: true
//               }
//             ])
//             .then(function(reply) {
//               if (true) {
//                 console.log('Item has been successfully added. You are now in the main page')
//                 viewProducts();
//                 menuOpt();
//               } else {
//                 addProduct();
//               }
//             });
//         }
//       );
//     });
// }
