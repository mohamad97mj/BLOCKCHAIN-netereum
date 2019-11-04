pragma solidity ^ 0.5.0;

import "./Netereum.sol";

contract Agreement
{
    uint256 public expireTime;
    address public debtor;
    address public creditor;
    address public debtorCoordinator;
    address public creditorCoordinator;
    uint256 public debtorCost;
    uint256 public exchangeRate;
    //    bool public debtorPermission;
    uint public creditorPermission = 0;
    uint public debtorCoordinatorPermission = 0;
    uint public creditorCoordinatorPermission = 0;
    uint8 public counterPermission = 1;
    address public NetereumAddress;
    bool public NetereumCalled = false;

    //uint256 public numOfToken;

    function decline() public {

        require(
        //            msg.sender == debtor ||
            msg.sender == creditor || msg.sender == debtorCoordinator || msg.sender == creditorCoordinator, "17");

//        if (msg.sender == debtor && !debtorPermission)
//        {
//            declinedBy = 1;
//            Netereum(NetereumAddress).declineAgreement(address(this));
//        }

        if (msg.sender == creditor && creditorPermission == 0)
        {
            creditorPermission = 2;
            Netereum(NetereumAddress).declineAgreement(address(this));
        }
        if (msg.sender == debtorCoordinator && debtorCoordinatorPermission == 0)
        {
            debtorCoordinatorPermission = 2;
            Netereum(NetereumAddress).declineAgreement(address(this));
        }
        if (msg.sender == creditorCoordinator && creditorCoordinatorPermission == 0)
        {
            creditorCoordinatorPermission = 2;
            Netereum(NetereumAddress).declineAgreement(address(this));
        }
    }

    function approve() public
    {
        require(
        //            msg.sender == debtor ||
            msg.sender == creditor || msg.sender == debtorCoordinator || msg.sender == creditorCoordinator, "17");

        //        if (msg.sender == debtor && !debtorPermission)
        //        {
        //            counterPermission++;
        //            debtorPermission = true;
        //            Netereum(NetereumAddress).approveAgreement(address(this));
        //
        //        }
        if (msg.sender == creditor && creditorPermission == 0)
        {
            counterPermission++;
            creditorPermission = 1;
        }
        if (msg.sender == debtorCoordinator && debtorCoordinatorPermission == 0)
        {
            counterPermission ++;
            debtorCoordinatorPermission = 1;
        }
        if (msg.sender == creditorCoordinator && creditorCoordinatorPermission == 0)
        {
            counterPermission++;
            creditorCoordinatorPermission = 1;
        }
        if (!NetereumCalled && counterPermission == 4)
        {
            NetereumCalled = true;
        }
    }

    constructor(
        address _debtor, address _creditor,
        address _debtorCoordinator, address _creditorCoordinator,
        uint256 _debtorCost, uint256 _exchangeRate, uint256 _expireTime, address _NetereumAddress)
    public
    {
        debtor = _debtor;
        creditor = _creditor;
        debtorCoordinator = _debtorCoordinator;
        creditorCoordinator = _creditorCoordinator;
        debtorCost = _debtorCost;
        exchangeRate = _exchangeRate;
        expireTime = _expireTime;
        NetereumAddress = _NetereumAddress;
        //numOfToken = _numOfToken;
    }

    function changeCost(uint256 _debtorCost) public
    {
        require(msg.sender == NetereumAddress);
        debtorCost = _debtorCost;
    }
}