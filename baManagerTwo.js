var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "12345",
  database: "bamazon_db"
});

connection.connect(function(err,res){
    if(err) throw err;
    console.log("connected to " + connection.threadId)
    menuOpt();
})

function menuOpt (){
    inquirer.prompt(
        {
            name: 'menu',
            type:'list',
            message: 'what would you like to view?',
            choices: 
            [
                'View products for sale',
                'View low inventory',
                'Add to inventory',
                'Add to product',
                'Exit'

            ]
        }).
        then(function(answer){
           switch (answer.menu){
               case 'View products for sale':
                    viewProducts();
                    break;
               case 'View low inventory':
                    lowInventory();
                    break;
                case 'Add to inventory':
                    viewProducts(addInventory);
                    break;
                case 'Add to product':
                    addProduct();
                    break;
                case 'Exit':
                    connection.end();
                default:
                    console.log('Thank you. You have been logged out')
                    break;
           }
        })
};

function viewProducts (cb){
    console.log("------------------------------------------------------")
    console.log('Here is the table of products we have on hand currently')
    connection.query('select * from products', function(err,data){
        if(err) throw err;
        console.log('\n');
        console.table(data)
        if (typeof cb !== 'undefined') {
            cb();
        };
    })
    
};

function lowInventory(){
    connection.query('select * from products where stock_quantity < 50 ', function(err,dataRes){
        console.log('\n\n');
        console.table(dataRes);
    })
    inquirer.prompt([
        {
            name: 'action',
            type: 'confirm',
            message: 'Would you like to add to the inventory?',
            default: true
        }
    ]).
    then(function(promptAnswer){
        console.log('res:', promptAnswer)
        if(promptAnswer.action == true){
            addInventory();
        } else {
            menuOpt();
        }
    })
};

function addInventory(){
   inquirer.prompt([
       {
           name:'item',
           type: 'input',
           message: 'What item would you like to add to?'
       },
       {
           name: 'num',
           type:'input',
           message: 'How many do you want to add?'
       }
    ]).
    then(function(ans){
        connection.query('select * from products where ?',
        [
            {
            item_id: ans.item
            }
        ],
        function(err,response){
            if(err) throw err;
            console.log('err:', err, 'res:',response[0].product_name,'!!!')
            var newQty = response[0].stock_quantity + parseInt(ans.num);     
            // console.log(newQty + 'newQty')
            connection.query('update products set ? where ?', 
            [
            {
                stock_quantity:newQty
                
            },
            {
                item_id: ans.item
                
            }
            ],
            function(res){ 
                console.log("--------------------------------------------");
                console.log(ans.num +' units of ' + response[0].product_name 
                + ' has been added! The new total remaining is ' + newQty)
                viewProducts(menuOpt);
            })
        })
    })
}

function addProduct() {
    inquirer
      .prompt([
        {
          name: "addName",
          type: "input",
          message: "What is the name of the product would you like to add?"
        },
        {
          name: "dept",
          type: "input",
          message: "What department is this product from?"
        },
        {
          name: "price",
          type: "input",
          message: "How much do you want to price it per unit?"
        },
        {
          name: "qty",
          type: "input",
          message: "How many units do you want to add?"
        }
      ])
      .then(function(results) {
        console.log("test");
        connection.query(
          "insert into products set ?",
  
          {
            product_name: results.addName,
            dept_name: results.dept,
            price: results.price,
            stock_quantity: results.qty
          },
  
          function(err, resp) {
           
            console.log("---------------------------------");
            console.log(
              "Product Name: " +
                results.addName +
                "\n Department: " +
                results.dept +
                "\n Price: " +
                results.price +
                "\n Quantity: " +
                results.qty +
                "\n has been added to the inventory"
            );
            inquirer
              .prompt([
                {
                  name: "toAdd",
                  type: "confirm",
                  message: "Confirm to proceed?",
                  default: true
                }
              ])
              .then(function(reply) {
                  console.log(reply, 'reply')
                if (reply.toAdd == true) {
                  console.log('Item has been successfully added. You are now in the main page')
                  viewProducts();
                  menuOpt();
                } else {
                  addProduct();
                }
              });
          }
        );
      });
  }
  