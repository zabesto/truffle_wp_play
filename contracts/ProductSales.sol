pragma solidity ^0.4.0;

contract ProductSales {

    struct Product {
        uint ID;
        string name;
        uint inventory;
        uint price;
    }

    struct Buyer {
        string name;
        string email;
        string mailingAddress;
        uint totalOrders;
        bool isActive;
    }

    struct Order {
        uint orderID;
        uint productID;
        uint quantity;
        address buyer;
    }

    address public owner;
    mapping (address => Buyer) public buyers;
    mapping (uint => Product) public products;
    mapping (uint => Order) public orders;

    uint public numProducts;
    uint public numBuyers;
    uint public numOrders;

    event NewProduct(uint _ID, string _name, uint _inventory, uint _price);
    event NewBuyer(string _name, string _email, string _mailingAddress);
    event NewOrder(uint orderID, uint _ID, uint quantity, address _from);

    modifier onlyOwner() {
        if (msg.sender != owner) throw;
        _;
    }

    function ProductSales() {
        owner = msg.sender;
        numBuyers = 0;
        numProducts = 0;
    }

    function addProduct(uint _ID, string _name, uint _inventory, uint _price) onlyOwner {
        Product p = products[_ID];
        p.ID = _ID;
        p.name = _name;
        p.inventory = _inventory;
        p.price = _price;
        numProducts++;
        NewProduct(_ID, _name, _inventory, _price);
    }

    function updateProduct(uint _ID, string _name, uint _inventory, uint _price) onlyOwner {
        products[_ID].name = _name;
        products[_ID].inventory = _inventory;
        products[_ID].price = _price;
    }

    function registerBuyer(string _name, string _email, string _mailingAddress) {
        Buyer b = buyers[msg.sender];
        b.name = _name;
        b.email = _email;
        b.mailingAddress = _mailingAddress;
        b.totalOrders = 0;
        b.isActive = true;
        numBuyers++;
        NewBuyer(_name, _email, _mailingAddress);
    }

    function buyProduct(uint _ID, uint _quantity) payable returns (uint newOrderID) {
        if (products[_ID].inventory < _quantity) throw;

        uint orderAmount = products[_ID].price * _quantity;
        if (msg.value < orderAmount) throw;

        if (buyers[msg.sender].isActive != true) throw;

        buyers[msg.sender].totalOrders += 1;
        newOrderID = uint(msg.sender) + block.timestamp;

        Order o = orders[newOrderID];
        o.orderID = newOrderID;
        o.productID = _ID;
        o.quantity = _quantity;
        o.buyer = msg.sender;

        numOrders++;

        products[_ID].inventory = products[_ID].inventory - 1;

        if (msg.value > orderAmount) {
            uint refundAmount = msg.value - orderAmount;
            if (!msg.sender.send(refundAmount)) throw;
        }

        NewOrder(newOrderID, _ID, _quantity, msg.sender);
    }

    function withdrawFunds() onlyOwner {
        if (!owner.send(this.balance)) throw;
    }

    function kill() onlyOwner {
        suicide(owner);
    }
}