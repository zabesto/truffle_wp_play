var SmartSwitch = artifacts.require("./SmartSwitch.sol");

module.exports = function(deployer) {
    deployer.deploy(SmartSwitch, {gas: 1000000});
};