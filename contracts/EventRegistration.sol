pragma solidity ^0.4.0;


contract EventRegistration {
    struct Registrant {
    uint amount;
    uint numTickets;
    string email;
    }

    address public owner;
    uint public numTicketsSold;
    uint public quota;
    uint public price;
    mapping (address => Registrant) registrantsPaid;

    event Deposit(address _from, uint _amount);
    event Refund(address _to, uint _amount);

    modifier onlyOwner() {
        if (msg.sender != owner) throw;
        _;
    }

    modifier soldOut() {
        if (numTicketsSold >= quota) throw;
        _;
    }

    function EventRegistration(uint _quota, uint _price) {
        owner = msg.sender;
        numTicketsSold = 0;
        quota = _quota;
        price = _price;
    }

    function buyTicket(string email, uint numTickets) payable soldOut {
        uint totalAmount = price * numTickets;
        if (msg.value < totalAmount) throw;

        if (registrantsPaid[msg.sender].amount > 0) {
            registrantsPaid[msg.sender].amount += totalAmount;
            registrantsPaid[msg.sender].email = email;
            registrantsPaid[msg.sender].numTickets += numTickets;
        } else {
            Registrant r = registrantsPaid[msg.sender];
            r.amount = totalAmount;
            r.email = email;
            r.numTickets = numTickets;
        }

        numTicketsSold = numTicketsSold + numTickets;

        if (msg.value > totalAmount) {
            uint refundAmount = msg.value - totalAmount;
            if (!msg.sender.send(refundAmount)) throw;
        }

        Deposit(msg.sender, msg.value);
    }

    function refundTicket(address buyer) onlyOwner {
        if (registrantsPaid[buyer].amount > 0) {
            if (this.balance >= registrantsPaid[buyer].amount) {
                numTicketsSold = numTicketsSold - registrantsPaid[buyer].numTickets;
                if (!buyer.send(registrantsPaid[buyer].amount)) throw;
                Refund(buyer, registrantsPaid[buyer].amount);
                registrantsPaid[buyer].amount = 0;
            }
        }
    }

    function withdrawFunds() onlyOwner returns (uint){
        uint balance = this.balance;
        if (!owner.send(balance)) throw;
        return (balance);
    }

    function getRegistrantAmountPaid(address buyer) returns (uint) {
        return registrantsPaid[buyer].amount;
    }

    function kill() onlyOwner {
        suicide(owner);
    }
}
