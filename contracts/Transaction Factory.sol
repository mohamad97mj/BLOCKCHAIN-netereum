pragma solidity ^0.5.0;

import "./Transaction.sol";

contract TransactionFactory {
    function create(address _buyer, address _seller,
        address _buyerCoordinator, address _sellerCoordinator,
        uint256 _buyerCost, uint256 _sellerCost,address _NetereumAddress) public returns(Transaction)
    {
        return new Transaction(_buyer, _seller, _buyerCoordinator, _sellerCoordinator,
            _buyerCost, _sellerCost,_NetereumAddress);
    }
}
