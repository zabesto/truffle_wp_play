var CrowdFunding = artifacts.require("./CrowdFunding.sol");

contract('crowdfunding', function(accounts) {

    it("should be able to fund a crowdfunding", () => {
        return CrowdFunding.deployed().then(instance => {
            return instance.fund({ from: accounts[0], value: web3.toWei(4, 'ether') }).then(txResult => {
                    assert.equal(txResult.logs.length, 1); // make sure it fired
                    assert.equal(txResult.logs[0].event, "Deposit");
                    assert.equal(txResult.logs[0].args['_amount'], web3.toWei(4, 'ether'));
                }
            );
        });
    });

    it("should be able to check if the goal has been reached in a crowdfunding", () => {
        return CrowdFunding.deployed().then(instance => {
            return instance.fund({ from: accounts[0], value: web3.toWei(12, 'ether') }).then(txResult => {
                assert.equal(txResult.logs.length, 1); // make sure it fired
                assert.equal(txResult.logs[0].event, "Deposit");
                assert.equal(txResult.logs[0].args['_amount'], web3.toWei(12, 'ether'));
            }).then(() => {
                return instance.fund({ from: accounts[0], value: web3.toWei(9, 'ether') }).then(txResult => {
                    assert.equal(txResult.logs.length, 1); // make sure it fired
                    assert.equal(txResult.logs[0].event, "Deposit");
                    assert.equal(txResult.logs[0].args['_amount'], web3.toWei(9, 'ether'));
                })
            }).then(() => {
                return instance.checkGoalReached({ from: accounts[0] }).then(txResult => {
                    return instance.campaignStatus.call()
                }).then(status => {
                    assert.equal(status, "Campaign Succeeded!");
                });
            });
        });
    });
});