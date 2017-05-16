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
                return voting.voters.call(Bob).then(voter => {
                    assert.equal(voter[0], false);
                    assert.equal(voter[1].toNumber(), 0);
                    assert.equal(voter[2], true);
                });
            });
        });
    });

    it("should be able to vote", () => {
        var voting;
        return Voting.deployed().then(instance => {
            voting = instance;
            return voting.giveRightToVote(Bob).then(txResult => {
                assert.equal(txResult.logs.length, 0);
            }).then(() => {
                return voting.vote(1, {from: Bob}).then(txResult => {
                    return voting.voters.call(Bob).then(voter => {
                        assert.isTrue(voter[0]);
                        assert.equal(voter[1].toNumber(), 1);
                        assert.isTrue(voter[2]);
                    });
                });
            });
        });
    });

    it("should not be able to vote twice", () => {
        var voting;
        return Voting.deployed().then(instance => {
            voting = instance;
            return voting.giveRightToVote(Sally).then(txResult => {
                assert.equal(txResult.logs.length, 0);
            }).then(() => {
                return voting.vote(1, {from: Sally}).then(txResult => {
                    return voting.voters.call(Sally).then(voter => {
                        assert.isTrue(voter[0]);
                        assert.equal(voter[1].toNumber(), 1);
                        assert.isTrue(voter[2]);
                    });
                });
            }).then(() => {
                return voting.vote(1, {from: Sally}).then(txResult => {
                    // should not reach here
                    assert.isTrue(false);
                }).catch(e => ThrowHandler(e));
            });
        });
    });

    it("should not be able to vote without rights", () => {
        return Voting.deployed().then(instance => {
            return instance.vote(1, {from: Jimmy}).then(txResult => {
                // should not reach here
                assert.isTrue(false);
            }).catch(e => ThrowHandler(e));
        });
    });

    xit("shouldn't return the wining proposal until time has expired", () => {
        return Voting.deployed().then(instance => {
            return instance.winningProposal.call({from: ChairPerson}).then(winner => {
                // should not reach here
                assert.isTrue(false);
            }).catch(e => ThrowHandler(e));
        });
    });

    it("should return the wining proposal", () => {
        return Voting.deployed().then(instance => {
            return instance.winningProposal.call({from: ChairPerson}).then(winner => {
                assert.equal(winner[0], 1);
                assert.equal(web3.toAscii(winner[1]).replace(/\u0000/g, ''), "Down");
            });
        });
    });
});