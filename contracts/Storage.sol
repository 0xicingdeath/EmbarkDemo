pragma solidity 0.5.0;

contract Storage {
    uint public store;

    constructor (uint _store) public {
        store = _store;
    }

    function setMessage(uint newStore) public  {
        store = newStore;
    }

    function getMessage() public view returns (uint) {
        return store;
    }
}