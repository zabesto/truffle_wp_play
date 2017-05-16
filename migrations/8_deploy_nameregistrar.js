var NameRegistrar = artifacts.require("./NameRegistrar.sol");

module.exports = function(deployer) {
    deployer.deploy(NameRegistrar, {gas: 1000000});
};