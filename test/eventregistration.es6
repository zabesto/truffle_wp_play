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
    const TicketCost = 101;
    const TicketQuota = 100;
    const TicketBatch = 10;


    it("should be able to buy a ticket", () => {
        return EventRegistration.deployed().then(instance => {
            return instance.buyTicket(Email, NumTickets, { from: accounts[0], value: TicketCost * TicketBatch }).then(txResult => {
                    assert.equal(txResult.logs.length, 1); // make sure it fired
                    assert.equal(txResult.logs[0].event, "Deposit");
                    assert.equal(txResult.logs[0].args['_from'], accounts[0]);
                    assert.equal(txResult.logs[0].args['_amount'], TicketCost * TicketBatch);
                }
            );
        });
    });

    it("should not buy a ticket without enough funds", () => {
        return EventRegistration.deployed().then(instance => {
            return instance.buyTicket(Email, NumTickets, { from: accounts[0], value: TicketCost -1 }).then(txResult => {
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
            return eventRegistration.buyTicket(Email, TicketBatch, { from: accounts[1], value: TicketCost * TicketBatch}).then(txResult => {
                    assert.equal(txResult.logs.length, 1); // make sure it fired
                    assert.equal(txResult.logs[0].event, "Deposit");
                    assert.equal(txResult.logs[0].args['_from'], accounts[1]);
                    assert.equal(txResult.logs[0].args['_amount'], TicketCost * TicketBatch);
                }
            ).then(() => {
                return eventRegistration.getRegistrantAmountPaid.call(accounts[1]).then(amount => {
                    assert.equal(amount.toNumber(), TicketCost * TicketBatch);
                });
            });
        });
    });


    /* NOTE: Has to be last since we can't reset the transactions between tests */
    it("should not buy more tickets than the quota", () => {
        var eventRegistration;
        return EventRegistration.deployed().then(instance => {
            eventRegistration = instance;
            return eventRegistration.buyTicket(Email, TicketQuota * 5, { from: accounts[0], value: TicketCost * TicketQuota * 5}).then(txResult => {
                    assert.equal(txResult.logs.length, 1); // make sure it fired
                    assert.equal(txResult.logs[0].event, "Deposit");
                    assert.equal(txResult.logs[0].args['_from'], accounts[0]);
                    assert.equal(txResult.logs[0].args['_amount'], TicketCost * TicketQuota * 5);
                }
            ).then(() => {
                return eventRegistration.buyTicket(Email, TicketQuota, { from: accounts[0], value: TicketCost * TicketQuota}).then(txResult => {
                    // should not reach here
                    assert.equal(true, false);
                }).catch(e => ThrowHandler(e));
            });
        });
    });


});