var CrowdFunding = artifacts.require("./CrowdFunding.sol");

module.exports = function(deployer) {
  var deadline = new Date().getTime() + 1000000;
  var goal = 100;
  deployer.deploy(CrowdFunding, deadline, goal);
};