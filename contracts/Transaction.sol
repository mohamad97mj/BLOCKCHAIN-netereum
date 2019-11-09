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
    address public netereumAddress;
    bool public netereumCalled = false;
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
        if(!netereumCalled && counterPermission == 4)
        {
            netereumCalled = true;
            Netereum(netereumAddress).doTransaction(address (this));//needs to be modified
        }
    }
    function decline() public {

        require(msg.sender == seller || msg.sender == sellerCoordinator || msg.sender == buyerCoordinator, "19");
        require(declinedBy == 0, "22");

        if(msg.sender == seller&& sellerPermission == 0)
        {
            sellerPermission == 2;
        }
        else if(msg.sender == sellerCoordinator && sellerCoordinatorPermission == 0)
        {
            sellerCoordinatorPermission == 2;
        }
        else if(msg.sender == buyerCoordinator && buyerCoordinatorPermission == 0)
        {
            buyerCoordinatorPermission == 2;
        }

        if(!netereumCalled){
            Netereum(netereumAddress).declineTransaction(address(this));
        }
    }

    function reset() internal
    {
        counterPermission =1;
        sellerPermission = 0;
        sellerCoordinatorPermission = 0;
        buyerCoordinatorPermission = 0;
    }

    constructor(
        address  _buyer,address  _seller,
        address  _buyerCoordinator,address _sellerCoordinator,
        uint256 _buyerCost,uint256 _sellerCost,address _netereumAddress)
    public
    {
        buyer = _buyer;
        seller = _seller;
        buyerCoordinator = _buyerCoordinator;
        sellerCoordinator = _sellerCoordinator;
        buyerCost = _buyerCost;
        sellerCost = _sellerCost;
        netereumAddress = _netereumAddress;
        // sellerFee = _sellerFee;
        //buyerMaxFee = _buyerMaxFee;
        //sellerMaxFee = _sellerMaxFee;
    }
    function setMaxFund(uint256 newBuyerCost) public
    {
        require(msg.sender == buyer);
        require(Netereum(netereumAddress).transactionsStatus(address(this)) == 1, "9");
        reset();
        buyerCost = newBuyerCost;
    }
}
