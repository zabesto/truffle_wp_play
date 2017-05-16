var NameRegistrar = artifacts.require("./NameRegistrar.sol");

var ThrowHandler = e => {
    if ((e + "").indexOf("invalid JUMP") > -1 || (e + "").indexOf("out of gas") > -1) {
        // We are in TestRPC
    } else if ((e + "").indexOf("please check your gas amount") > -1) {
        // We are in Geth for a deployment
    } else {
        throw e;
    }
};

var Bytes32ToAscii = b => {
    return web3.toAscii(b).replace(/\u0000/g, '');
};

contract('nameregistrar', function(accounts) {

    const Names = ['Fancy Shirts', 'Pooperdoodle Inc', 'Bookface'];

    it("should be able to register a name", () => {
        return NameRegistrar.deployed().then(instance => {
            return instance.register(Names[0], { from: accounts[1] }).then(txResult => {
                assert.equal(txResult.logs.length, 1); // make sure it fired
                assert.equal(txResult.logs[0].event, "Registered");
                assert.equal(Bytes32ToAscii(txResult.logs[0].args['name']), Names[0]);
                assert.equal(txResult.logs[0].args['account'], accounts[1]);
            });
        });
    });

    it("should be able to unregister a name", () => {
        var nameregistrar;
        const name = Names[1];
        const account = accounts[2];
        return NameRegistrar.deployed().then(instance => {
            nameregistrar = instance;
            return nameregistrar.register(name, { from: account }).then(txResult => {
                assert.equal(txResult.logs.length, 1); // make sure it fired
                assert.equal(txResult.logs[0].event, "Registered");
                assert.equal(Bytes32ToAscii(txResult.logs[0].args['name']), name);
                assert.equal(txResult.logs[0].args['account'], account);
            }).then(() => {
                return nameregistrar.unregister(name, { from: account }).then(txResult => {
                    assert.equal(txResult.logs.length, 1); // make sure it fired
                    assert.equal(txResult.logs[0].event, "Deregistered");
                    assert.equal(Bytes32ToAscii(txResult.logs[0].args['name']), name);
                    assert.equal(txResult.logs[0].args['account'], account);
                });
            });
        });
    });

    it("should not be able to set the address of a name if not the owner", () => {
        var nameregistrar;
        const name = Names[0];
        const account = accounts[3];
        const invalidAddress = '0x0000000000000000000000000000000000000000';
        return NameRegistrar.deployed().then(instance => {
            nameregistrar = instance;
            const address = nameregistrar.address;
            return nameregistrar.setAddr(name, address, { from: account }).then(txResult => {
                assert.equal(txResult.logs.length, 0);
            }).then(() => {
                return nameregistrar.getAddr.call(name).then(result => {
                    assert.equal(result, invalidAddress);
                });
            });
        });
    });

    it("should be able to set the address of a name", () => {
        var nameregistrar;
        const name = Names[0];
        const account = accounts[1];
        return NameRegistrar.deployed().then(instance => {
            nameregistrar = instance;
            const address = nameregistrar.address;
            return nameregistrar.setAddr(name, address, { from: account }).then(txResult => {
                assert.equal(txResult.logs.length, 0);
            }).then(() => {
                return nameregistrar.getAddr.call(name).then(result => {
                   assert.equal(result, address);
                });
            });
        });
    });

    it("should not be able to set the address of an unregistered name", () => {
        const name = Names[2];  // assume it's not been used
        const invalidAddress = '0x0000000000000000000000000000000000000000';
        return NameRegistrar.deployed().then(instance => {
            return instance.getAddr.call(name).then(result => {
                assert.equal(result, invalidAddress);
            });
        });
    });

    it("should not be able to set the content of a name if not the owner", () => {
        var nameregistrar;
        const name = Names[0];
        const account = accounts[5];
        const content = web3.toHex("Fish tacos!");
        return NameRegistrar.deployed().then(instance => {
            nameregistrar = instance;
            return nameregistrar.setContent(name, content, { from: account }).then(txResult => {
                assert.equal(txResult.logs.length, 0);
            }).then(() => {
                return nameregistrar.getContent.call(name).then(result => {
                    assert.equal(Bytes32ToAscii(result), "");
                });
            });
        });
    });

    it("should be able to set the content of a name", () => {
        var nameregistrar;
        const name = Names[0];
        const account = accounts[1];
        const content = web3.toHex("Fish tacos!");
        return NameRegistrar.deployed().then(instance => {
            nameregistrar = instance;
            return nameregistrar.setContent(name, content, { from: account }).then(txResult => {
                assert.equal(txResult.logs.length, 0);
            }).then(() => {
                return nameregistrar.getContent.call(name).then(result => {
                    assert.equal(Bytes32ToAscii(result), Bytes32ToAscii(content));
                });
            });
        });
    });

});