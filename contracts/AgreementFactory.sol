pragma solidity ^0.5.0;
import "./Agreement.sol";
contract AgreementFactory {
    function create(address  _debtor,address _creditor,
        address  _debtorCoordinator,address  _creditorCoordinator,
        uint256 _debtAmount,uint256 _exchangeRate, uint256 _expireTime,address _netereumAddress) public returns(Agreement)
    {
        return new Agreement(
            _debtor, _creditor, _debtorCoordinator, _creditorCoordinator,
            _debtAmount,_exchangeRate,_expireTime,_netereumAddress
        );
    }
}
