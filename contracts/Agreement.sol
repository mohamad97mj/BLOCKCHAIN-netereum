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
    uint public creditorPermission = 0;
    uint public debtorCoordinatorPermission = 0;
    uint public creditorCoordinatorPermission = 0;
    uint8 public counterPermission = 1;
    address public barterCubeAddress;
    bool public barterCubeCalled = false;
    uint8 public declinedBy = 0;

//    function decline() public {
//
//        require(declinedBy == 0, "20");
//        require(msg.sender == creditor || msg.sender == debtorCoordinator || msg.sender == creditorCoordinator, "17");
//
//        if (msg.sender == creditor && !creditorPermission)
//        {
//            declinedBy = 2;
//            //BarterCube(barterCubeAddress).declineAgreement(address(this));
//        }
//        else if (msg.sender == debtorCoordinator && !debtorC
//        if (msg.sender == debtorCoordinator && debtorCoordinatorPermission == 0)
//        {
//            counterPermission ++;
//            debtorCoordinatorPermission = 1;
//            //BarterCube(barterCubeAddress).approveAgreement(address(this));
//        }
//        if (msg.sender == creditorCoordinator && creditorCoordinatorPermission == 0)
//        {
//            counterPermission++;
//            creditorCoordinatorPermission = 1;
//            //BarterCube(barterCubeAddress).approveAgreement(address(this));
//        }
//        if (!barterCubeCalled && counterPermission == 4)
//        {oordinatorPermission)
//        {
//            declinedBy = 3;
//            //BarterCube(barterCubeAddress).declineAgreement(address(this));
//        }
//        else if (msg.sender == creditorCoordinator && !creditorCoordinatorPermission)
//        {
//            declinedBy = 4;
//            //BarterCube(barterCubeAddress).declineAgreement(address(this));
//        }
//    }
    //uint256 public numOfToken;
    function approve() public
    {
        require(declinedBy == 0, "16");
        require(
            msg.sender == creditor || msg.sender == debtorCoordinator || msg.sender == creditorCoordinator, "17");
        if (msg.sender == creditor && creditorPermission == 0)
        {
            counterPermission++;
            creditorPermission = 1;
            //BarterCube(barterCubeAddress).approveAgreement(address(this));
        }
        if (msg.sender == debtorCoordinator && debtorCoordinatorPermission == 0)
        {
            counterPermission ++;
            debtorCoordinatorPermission = 1;
            //BarterCube(barterCubeAddress).approveAgreement(address(this));
        }
        if (msg.sender == creditorCoordinator && creditorCoordinatorPermission == 0)
        {
            counterPermission++;
            creditorCoordinatorPermission = 1;
            //BarterCube(barterCubeAddress).approveAgreement(address(this));
        }
        if (!barterCubeCalled && counterPermission == 4)
        {
            barterCubeCalled = true;
            Netereum(barterCubeAddress).addAgreement(address(this));
        }
    }

    constructor(
        address  _debtor,address _creditor,
        address  _debtorCoordinator,address  _creditorCoordinator,
        uint256 _debtorCost,uint256 _exchangeRate,uint256 _expireTime,address _barterCubeAddress)
    public
    {
        debtor = _debtor;
        creditor = _creditor;
        debtorCoordinator = _debtorCoordinator;
        creditorCoordinator = _creditorCoordinator;
        debtorCost = _debtorCost;
        exchangeRate = _exchangeRate;
        expireTime = _expireTime;
        barterCubeAddress = _barterCubeAddress;
        //numOfToken = _numOfToken;
    }

    function changeCost(uint256 _debtorCost) public
    {
        require(msg.sender == barterCubeAddress);
        debtorCost = _debtorCost;
    }
}
