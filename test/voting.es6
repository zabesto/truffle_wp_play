var Voting = artifacts.require("./Voting.sol");
var ThrowHandler = e => {
    if ((e + "").indexOf("invalid JUMP") > -1 || (e + "").indexOf("out of gas") > -1) {
        // We are in TestRPC
    } else if ((e + "").indexOf("please check your gas amount") > -1) {
        // We are in Geth for a deployment
    } else {
        throw e;
    }
};


contract('voting', function(accounts) {

    const Email = "bob@fish.com";
    const ChairPerson = accounts[0];
    const Bob = accounts[1];
    const Sally = accounts[2];
    const Jimmy = accounts[3];

    it("should be able to give right to vote", () => {
        var voting;
        return Voting.deployed().then(instance => {
            voting = instance;
            return voting.giveRightToVote(Bob).then(txResult => {
                assert.equal(txResult.logs.length, 0);
            }).then(() => {
                voting.voters.call(Bob).then(voter => {
                    console.log(voter);
                    assert.equal(voter[0], false);
                    assert.equal(voter[1].toNumber(), 0);
                    assert.equal(voter[2], true);
                });
            });
        });
    });
});