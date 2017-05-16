var Voting = artifacts.require("./Voting.sol");

module.exports = function(deployer) {
    var proposalNames = ["Up", "Down", "Left", "Right"];
    var proposalTime =  60; // in seconds
    deployer.deploy(Voting, proposalNames, proposalTime, {gas: 1000000});
};