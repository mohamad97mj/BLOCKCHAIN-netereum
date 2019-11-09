pragma solidity ^ 0.5.0;
import "./Netereum.sol";
contract Transaction
{
    uint8 public counterPermission = 1;
    uint public sellerPermission = 0;
    uint public buyerCoordinatorPermission = 0;
    uint public sellerCoordinatorPermission = 0;
    address public buyer;
    address public seller;
    address public buyerCoordinator;
    address public sellerCoordinator;
    uint256 public buyerCost;
    uint256 public sellerCost;
    address public barterCubeAddress;
    bool public barterCubeCalled = false;
    uint8 public declinedBy = 0;
    function approve() public
    {
        require(msg.sender == seller || msg.sender == sellerCoordinator || msg.sender == buyerCoordinator, "19");
        require(declinedBy == 0, "22");
        if(msg.sender == seller && sellerPermission == 0)
        {
            sellerPermission = 1;
            counterPermission++;
        }
        else if(msg.sender == sellerCoordinator && sellerCoordinatorPermission == 0)
        {
            sellerCoordinatorPermission = 1;
            counterPermission++;
        }
        else if(msg.sender == buyerCoordinator && buyerCoordinatorPermission == 0)
        {
            buyerCoordinatorPermission = 1;
            counterPermission++;
        }
        // if all the four sides of a transactions have agreed, then the transaction will be done buy the barterCube if possible
        if(!barterCubeCalled && counterPermission == 4)
        {
            barterCubeCalled = true;
            Netereum(barterCubeAddress).doTransaction(address (this));//needs to be modified
        }
    }
    function decline() public {

        require(msg.sender == seller || msg.sender == sellerCoordinator || msg.sender == buyerCoordinator, "19");
        require(declinedBy == 0, "22");
        if(msg.sender == seller&& sellerPermission == 0)
        {
            declinedBy = 2;
            sellerPermission == 2;
            //BarterCube(barterCubeAddress).declineTransaction(address(this));
        }
        else if(msg.sender == sellerCoordinator && sellerCoordinatorPermission == 0)
        {
            sellerCoordinatorPermission == 2;
            declinedBy = 3;
            //BarterCube(barterCubeAddress).declineTransaction(address(this));
        }
        else if(msg.sender == buyerCoordinator && buyerCoordinatorPermission == 0)
        {
            buyerCoordinatorPermission == 2;
            declinedBy = 4;
            //BarterCube(barterCubeAddress).declineTransaction(address(this));
        }
    }

    function reset() internal
    {
        counterPermission =1;
        sellerPermission = 0;
        sellerCoordinatorPermission = 0;
        buyerCoordinatorPermission = 0;
    }
    // expire date should be created to
    //uint256 public sellerFee;
    // public buyerMaxFee;
    //uint256 public sellerMaxFee;
    constructor(
        address  _buyer,address  _seller,
        address  _buyerCoordinator,address _sellerCoordinator,
        uint256 _buyerCost,uint256 _sellerCost,address _barterCubeAddress)
    public
    {
        buyer = _buyer;
        seller = _seller;
        buyerCoordinator = _buyerCoordinator;
        sellerCoordinator = _sellerCoordinator;
        buyerCost = _buyerCost;
        sellerCost = _sellerCost;
        barterCubeAddress = _barterCubeAddress;
        // sellerFee = _sellerFee;
        //buyerMaxFee = _buyerMaxFee;
        //sellerMaxFee = _sellerMaxFee;
    }
    function setMaxFund(uint256 newBuyerCost) public
    {
        require(msg.sender == buyer);
        require(Netereum(barterCubeAddress).transactionsStatus(address(this)) == 1, "9");
        reset();
        buyerCost = newBuyerCost;
    }
}
