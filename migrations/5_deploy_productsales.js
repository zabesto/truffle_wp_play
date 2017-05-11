var ProductSales = artifacts.require("./ProductSales.sol");

module.exports = function(deployer) {
  deployer.deploy(ProductSales);
};