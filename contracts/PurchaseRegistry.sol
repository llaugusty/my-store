pragma solidity 0.4.24;

import "./Purchase.sol";

contract PurchaseRegistry{

      constructor()
        public
    {
        owner = msg.sender;
    }

  address public owner;

    mapping(address => Purchase[]) foo;
    mapping(address => uint) cnt;
    
    function add(address id, address _x) public returns(uint) {
        foo[id].push(new Purchase(_x, msg.sender));
        cnt[id] = cnt[id] + 1;

        return cnt[id];
    }

    function getPurchaseLength(address id) public constant returns(uint) {
        return cnt[id];
    }

    function getPurchase(address id, uint index) public constant returns(address addr, uint stage) {
        return (foo[id][index], uint(foo[id][index].stage()));
    }
}