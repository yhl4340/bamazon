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
    console.log("Here is the table of products we have on hand currently \n***************")
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
    then(function(err,promptAnswer){
        if(true){
            addInventory();
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
            
            console.log(newQty + 'newQty')
            connection.query('update products set ? where ?', 
            [
            {
                stock_quantity:newQty
                
            },
            {
                item_id: ans.item
                
            }
            ],
            function(err,res){
               
                viewProducts(menuOpt);
            })
        })
    })
}