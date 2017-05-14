pragma solidity ^0.4.0;


contract throwtest {
    function throwtest(uint data){
        if (data < 11)
            throw;
    }

    function returntest(uint data){
        if (data < 11)
            return;
    }
}
