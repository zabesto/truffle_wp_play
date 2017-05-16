var EventRegistration = artifacts.require("./EventRegistration.sol");
var ThrowHandler = e => {
    if ((e + "").indexOf("invalid JUMP") > -1 || (e + "").indexOf("out of gas") > -1) {
        // We are in TestRPC
    } else if ((e + "").indexOf("please check your gas amount") > -1) {
        // We are in Geth for a deployment
    } else {
        throw e;
    }
};


contract('eventregistration', function(accounts) {

    const Email = "bob@fish.com";
    const NumTickets = 3;
    const TicketCost = 1;
    const TicketQuota = 100;
    const TicketBatch = 10;


    it("should be able to buy a ticket", () => {
        const Amount = web3.toWei(TicketCost * TicketBatch, "ether");
        return EventRegistration.deployed().then(instance => {
            return instance.buyTicket(Email, TicketBatch, { from: accounts[4], value: Amount }).then(txResult => {
                    assert.equal(txResult.logs.length, 1); // make sure it fired
                    assert.equal(txResult.logs[0].event, "Deposit");
                    assert.equal(txResult.logs[0].args['_from'], accounts[4]);
                    assert.equal(txResult.logs[0].args['_amount'], Amount);
                }
            );
        });
    });

    it("should not buy a ticket without enough funds", () => {
        return EventRegistration.deployed().then(instance => {
            return instance.buyTicket(Email, NumTickets, { from: accounts[0], value: web3.toWei(TicketCost -1, "ether") }).then(txResult => {
                    // should not reach here
                    assert.equal(true, false);
                }
            ).catch(e => ThrowHandler(e));
        });
    });

    it("should be able to get the amount paid for a buyer", () => {
        var eventRegistration;
        return EventRegistration.deployed().then(instance => {
            eventRegistration = instance;
            const Amount = web3.toWei(TicketCost * TicketBatch, "ether");
            return eventRegistration.buyTicket(Email, TicketBatch, { from: accounts[1], value: Amount}).then(txResult => {
                    assert.equal(txResult.logs.length, 1); // make sure it fired
                    assert.equal(txResult.logs[0].event, "Deposit");
                    assert.equal(txResult.logs[0].args['_from'], accounts[1]);
                    assert.equal(txResult.logs[0].args['_amount'], Amount);
                }
            ).then(() => {
                return eventRegistration.getRegistrantAmountPaid.call(accounts[1]).then(amount => {
                    assert.equal(amount.toNumber(), Amount);
                });
            });
        });
    });

    it("should be able to refund a ticket", () => {
        var eventRegistration;
        return EventRegistration.deployed().then(instance => {
            eventRegistration = instance;
            const Amount = web3.toWei(TicketCost, "ether");
            return eventRegistration.buyTicket(Email, 1, { from: accounts[2], value: Amount}).then(txResult => {
                    assert.equal(txResult.logs.length, 1); // make sure it fired
                    assert.equal(txResult.logs[0].event, "Deposit");
                    assert.equal(txResult.logs[0].args['_from'], accounts[2]);
                    assert.equal(txResult.logs[0].args['_amount'], Amount);
                }
            ).then(() => {
                return eventRegistration.refundTicket(accounts[2]).then(txResult => {
                    assert.equal(txResult.logs.length, 1); // make sure it fired
                    assert.equal(txResult.logs[0].event, "Refund");
                    assert.equal(txResult.logs[0].args['_to'], accounts[2]);
                    assert.equal(txResult.logs[0].args['_amount'].toNumber(), Amount);
                });
            });
        });
    });

    it("should not be able to refund a ticket that hasn't been bought", () => {
        return EventRegistration.deployed().then(instance => {
            return instance.refundTicket(accounts[3]).then(txResult => {
                assert.equal(txResult.logs.length, 0);
            });
        });
    });

    it("should not be able to refund a ticket if not the owner", () => {
        var someGuy = accounts[1];
        return EventRegistration.deployed().then(instance => {
            return instance.refundTicket.call(someGuy, {from: someGuy}).then(() => {
                // should not reach here
                assert.equal(true, false);
            }).catch(e => ThrowHandler(e));
        });
    });

    /* NOTE: Has to be last for buying since we can't reset the transactions between tests */
    it("should not buy more tickets than the quota", () => {
        var eventRegistration;
        return EventRegistration.deployed().then(instance => {
            const SecondAmount = web3.toWei(TicketCost * TicketBatch);
            const SecondBatch = TicketBatch;
            const Amount = SecondAmount * 8;
            const Batch = SecondBatch * 8;
            eventRegistration = instance;
            return eventRegistration.buyTicket(Email, Batch, { from: accounts[5], value: Amount}).then(txResult => {
                    assert.equal(txResult.logs.length, 1); // make sure it fired
                    assert.equal(txResult.logs[0].event, "Deposit");
                    assert.equal(txResult.logs[0].args['_from'], accounts[5]);
                    assert.equal(txResult.logs[0].args['_amount'], Amount);
                }
            ).then(() => {
                return eventRegistration.buyTicket(Email, SecondBatch, { from: accounts[5], value: SecondAmount}).then(txResult => {
                    // should not reach here
                    assert.equal(true, false);
                }).catch(e => ThrowHandler(e));
            });
        });
    });

    it("should not be able to withdraw funds if not the owner", () => {
        var someGuy = accounts[1];
        return EventRegistration.deployed().then(instance => {
            return instance.withdrawFunds.call({from: someGuy}).then(() => {
                // should not reach here
                assert.equal(true, false);
            }).catch(e => ThrowHandler(e));
        });
    });

    /* NOTE: this has to be last */
    it("should be able to withdraw funds", () => {
        var eventRegistration;
        var owner = accounts[0];
        var origBalance = web3.fromWei(web3.eth.getBalance(owner), "ether");
        const ExpectedReward = 99.9971514;
        return EventRegistration.deployed().then(instance => {
            eventRegistration = instance;
            return eventRegistration.withdrawFunds({from: owner}).then(() => {
                var newBalance = web3.fromWei(web3.eth.getBalance(owner), "ether");
                assert.approximately(ExpectedReward, newBalance.toNumber() - origBalance.toNumber(), 0.000001);
            });
        });
    });
});