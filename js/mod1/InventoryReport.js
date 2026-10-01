function fetchProductsFromDatabase(){
    return new Promise((resolve,reject)=>{
        let serverAvilable=true;
        setTimeout(()=>{
            if(serverAvilable){
                resolve([
                    { id: 1, name: "Wireless Mouse", price: 799, stock: 12 },
                    { id: 2, name: "Mechanical Keyboard", price: 3499, stock: 0 },
                    { id: 3, name: "USB-C Hub", price: 1299, stock: 5 }
                ]);
            }else{
                reject("Server is down. Unable to fetch product data.");
            }
        },2000)
    });
}

async function generateInventoryReport(){
    try{
        //wait for products
        const products=await fetchProductsFromDatabase();

        //in stock count
        const inStock=products.filter((product)=>product.stock>0);

        //calculate toatl inventory
        const totalInventory=products.reduce((total,product)=>{
            return total+product.price*product.stock;
        },0);

        const report={
            totalProducts:products.length,
            inStockCount:inStock.length,
            totalInventoryValue:totalInventory
        }
        console.log("Inventory Report",report);
    }
    catch(error){
        console.log(error);
    }
}

generateInventoryReport();