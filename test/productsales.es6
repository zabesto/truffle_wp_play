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

    it("should be able to update an existing product", () => {
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
            }).then(() => {
                return instance.updateProduct(PizzaID, PizzaName, PizzaInventory + 1, PizzaPrice).then(txResult => {
                  // console.log(txResult);
                })
            }).then(() => {
                return instance.products.call(PizzaID).then(product => {
                   assert.equal(product[0].toNumber(), PizzaID);
                   assert.equal(product[1], PizzaName);
                   assert.equal(product[2].toNumber(), PizzaInventory + 1);
                   assert.equal(product[3].toNumber(), PizzaPrice);
                });
            });
        });
    });

    xit("should not be able to update a product that doesn't exist", () => {
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
            }).then(() => {
                return instance.updateProduct(PizzaID + 1, PizzaName, PizzaInventory + 1, PizzaPrice).then(txResult => {
                    // console.log(txResult);
                })
            }).then(() => {
                return instance.products.call(PizzaID).then(product => {
                    assert.equal(product[0].toNumber(), PizzaID);
                    assert.equal(product[1], PizzaName);
                    assert.equal(product[2].toNumber(), PizzaInventory + 1);
                    assert.equal(product[3].toNumber(), PizzaPrice);
                });
            });
        });
    });

    it("should be able to register a buyer", () => {
        var BuyerName = "Bob Jones";
        var Email = "bob@jones.com";
        var MailingAddress = "1234 Fancy Street, Omaha, NB, 911011";

        return ProductSales.deployed().then(instance => {
            return instance.registerBuyer(BuyerName, Email, MailingAddress).then(txResult => {
                assert.equal(txResult.logs.length, 1); // make sure it fired
                assert.equal(txResult.logs[0].event, "NewBuyer");
                assert.equal(txResult.logs[0].args['_name'], BuyerName);
                assert.equal(txResult.logs[0].args['_email'], Email);
                assert.equal(txResult.logs[0].args['_mailingAddress'], MailingAddress);
            });
        })
    });
});