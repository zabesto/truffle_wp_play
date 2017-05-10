var Greeter = artifacts.require("./Greeter.sol");

contract ('greeter', function(accounts) {
  it("should create a new greeter", function() {
    return Greeter.deployed().then(function(instance) {
      return instance.greet.call();
    }).then(function(greeting) {
      assert.equal(greeting.valueOf(), "Hello Mr. Fish!", "Incorrect greeting returned");
    });
  });


});