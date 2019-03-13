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

// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.



function menuOpt (){
    inquirer.prompt(
        {
            name: 'menu',
            type:'list',
            message: 'what would you like to view?',
            choices: [
                'View products for sale',
                'View low inventory',
                'Add to inventory',
                'Add to product'
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
                    addInventory();
                    break;
                case 'Add to product':
                    addProduct();
                    break;
                default:
                    break;
           }
        })
};

function viewProducts (){
    connection.query('select * from products', function(err,data){
        if(err) throw err;
        console.table(data)
    })
};

function lowInventory(){
    connection.query('select * from products where stock_quantity < 50 ', function(err,dataRes){
        console.table(dataRes);
    })
};

function addInventory(){
    viewProducts();
   inquirer.prompt(
       {
           name:'item',
           type: 'input',
           message: 'What item would you like to add to?'
       },
       {
           name: 'num',
           type:'input',
           message: 'How many do you want to add?'
       }).
       then(function(ans){
           console.log(ans)
           connection.query('select * from products where ?',
           [
               {
               item_id: ans.item,
               stock_quantity: ans.num
               }
           ] ),
           function(response){
               console.log(response)
               connection.query('update products where ?', 
               [
                {
                    item_id: ans.item,
                    stock_quantity: ans.num
                }
               ])
           }

       })
   
}