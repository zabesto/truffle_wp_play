pragma solidity ^0.4.0;

contract SmartSwitch {

    address public owner;
    mapping (address => uint) public usersPaid;
    uint public numUsers;

    event Deposit(address _from, uint _amount);
    event Refund(address _to, uint _amount);

    modifier onlyOwner() {
        if (msg.sender != owner) throw;
        _;
    }

    function SmartSwitch(){
        owner = msg.sender;
        numUsers = 0;
    }

    function payToSwitch() payable {
        usersPaid[msg.sender] = msg.value;
        numUsers++;
        Deposit(msg.sender, msg.value);
    }

    function refundUser(address recipient, uint amount) onlyOwner {
        if (usersPaid[recipient] == amount) {
            if (this.balance >= amount) {
                if (!recipient.send(amount)) throw;
                Refund(recipient, amount);
                usersPaid[recipient] = 0;
                numUsers--;
            }
        }
    }

    function withdrawFunds() onlyOwner {
        if (!owner.send(this.balance)) throw;
    }

    function kill() onlyOwner {
        suicide(owner);
    }
}
