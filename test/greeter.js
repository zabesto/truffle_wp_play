var Greeter = artifacts.require("./Greeter.sol");

contract('greeter', function(accounts) {
    it("should create a new greeter", function() {
        return Greeter.deployed().then(function(instance) {
            return instance.greet.call();
        }).then(function(greeting) {
            assert.equal(greeting.valueOf(), "Hello Mr. Fish!", "incorrect greeting returned");
        });
    });

    it("should be able to kill a greeter", function() {
        return Greeter.deployed().then(function(instance) {
            return instance.kill.call();
        }).then(function(result) {
            assert.equal(result.valueOf(), "", "unable to kill the greeter");
        });
    });
});