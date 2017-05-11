var ProductSales = artifacts.require("./ProductSales.sol");

contract('productsales', function(accounts) {

    it("should be able to add a product", () => {
        var PizzaID = 123;
        var PizzaName = "Pizza";
        var PizzaInventory = 99;
        var PizzaPrice = 1049;

        return ProductSales.deployed().then(instance => {
            return instance.addProduct(PizzaID, PizzaName, PizzaInventory, PizzaPrice, { from: accounts[0] }).then(txResult => {
                assert.equal(txResult.logs.length, 1); // make sure it fired
                assert.equal(txResult.logs[0].event, "NewProduct");
                assert.equal(txResult.logs[0].args['_ID'], PizzaID);
                assert.equal(txResult.logs[0].args['_name'], PizzaName);
                assert.equal(txResult.logs[0].args['_inventory'], PizzaInventory);
                assert.equal(txResult.logs[0].args['_price'], PizzaPrice);
            });
        });
    });
});