var CrowdFunding = artifacts.require("./CrowdFunding.sol");

contract ('crowdfunding', function(accounts) {

  it("should be able to fund a crowdfunding", () => {
    return CrowdFunding.deployed().then(instance => {
      return instance.fund({ from: accounts[0], value: web3.toWei(4, 'ether') }).then((txResult) => {
          assert.equal(txResult.logs.length, 1); // make sure it fired
          assert.equal(txResult.logs[0].event, "Deposit");
          assert.equal(txResult.logs[0].args['_amount'], web3.toWei(4, 'ether'));
        }
      );
    });
  });

});