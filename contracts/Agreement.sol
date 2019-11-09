pragma solidity ^ 0.5.0;

import "./Netereum.sol";

contract Agreement
{
    uint256 public expireTime;
    address public debtor;
    address public creditor;
    address public debtorCoordinator;
    address public creditorCoordinator;
    uint256 public debtAmount;
    uint256 public exchangeRate;
    uint public creditorPermission = 0;
    uint public debtorCoordinatorPermission = 0;
    uint public creditorCoordinatorPermission = 0;
    uint8 public counterPermission = 1;
    address public netereumAddress;
    bool public netereumCalled = false;

    function decline() public {

        require(msg.sender == creditor || msg.sender == debtorCoordinator || msg.sender == creditorCoordinator, "17");

        if (msg.sender == creditor && creditorPermission == 0)
        {
            creditorPermission = 2;
        }
        else if (msg.sender == debtorCoordinator && debtorCoordinatorPermission == 0)
        {
            debtorCoordinatorPermission = 2;
        }
        else if (msg.sender == creditorCoordinator && creditorCoordinatorPermission == 0)
        {
            creditorCoordinatorPermission = 2;
        }

        if(!netereumCalled){
            netereumCalled = true;
            Netereum(netereumAddress).declineAgreement(address(this));
        }
    }

    function approve() public
    {
        require(
            msg.sender == creditor || msg.sender == debtorCoordinator || msg.sender == creditorCoordinator, "17");
        if (msg.sender == creditor && creditorPermission == 0)
        {
            counterPermission++;
            creditorPermission = 1;
            //BarterCube(netereumAddress).approveAgreement(address(this));
        }
        else if (msg.sender == debtorCoordinator && debtorCoordinatorPermission == 0)
        {
            counterPermission ++;
            debtorCoordinatorPermission = 1;
            //BarterCube(netereumAddress).approveAgreement(address(this));
        }
        else if (msg.sender == creditorCoordinator && creditorCoordinatorPermission == 0)
        {
            counterPermission++;
            creditorCoordinatorPermission = 1;
            //BarterCube(netereumAddress).approveAgreement(address(this));
        }
        if (!netereumCalled && counterPermission == 4)
        {
            netereumCalled = true;
            Netereum(netereumAddress).addAgreement(address(this));
        }
    }

    constructor(
        address _debtor, address _creditor,
        address _debtorCoordinator, address _creditorCoordinator,
        uint256 _debtAmount, uint256 _exchangeRate, uint256 _expireTime, address _netereumAddress)
    public
    {
        debtor = _debtor;
        creditor = _creditor;
        debtorCoordinator = _debtorCoordinator;
        creditorCoordinator = _creditorCoordinator;
        debtAmount = _debtAmount;
        exchangeRate = _exchangeRate;
        expireTime = _expireTime;
        netereumAddress = _netereumAddress;
    }

    function changeCost(uint256 _debtAmount) public
    {
        require(msg.sender == netereumAddress);
        debtAmount = _debtAmount;
    }
}
