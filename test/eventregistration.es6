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


    it("should be able to buy a ticket", () => {
        return EventRegistration.deployed().then(instance => {
            return instance.buyTicket(Email, NumTickets, { from: accounts[0], value: TicketCost * NumTickets }).then(txResult => {
                    assert.equal(txResult.logs.length, 1); // make sure it fired
                    assert.equal(txResult.logs[0].event, "Deposit");
                    assert.equal(txResult.logs[0].args['_from'], accounts[0]);
                    assert.equal(txResult.logs[0].args['_amount'], TicketCost * NumTickets);
                }
            );
        });
    });

    it("should not buy a ticket without enough funds", () => {
        return EventRegistration.deployed().then(instance => {
            return instance.buyTicket(Email, NumTickets, { from: accounts[0], value: TicketCost -1 }).then(txResult => {
                    // should not reach here
                    // assert.equal(txResult.logs.length, 2); // make sure it fired
                    assert.equal(true, false);
                }
            ).catch(e => ThrowHandler(e));
        });
    });

});