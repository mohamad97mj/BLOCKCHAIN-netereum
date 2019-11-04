pragma solidity ^ 0.5.0;

import "./Netereum.sol";

contract Transaction
{
    uint8 public counterPermission = 1;
    //    uint public senderPermission;
    uint public receiverPermission;
    uint public senderCoordinatorPermission;
    uint public receiverCoordinatorPermission;
    address public senderAccount;
    address public receiverAccount;
    address public senderCoordinator;
    address public receiverCoordinator;
    uint256 public receiverAmount;
    uint256 public senderAmount;
    uint256 public maxFee;
    address public NetereumAddress;
    bool public NetereumCalled = false;
//    uint8 public declinedBy = 0;

    function decline() public {

        require(msg.sender == senderAccount || msg.sender == receiverAccount || msg.sender == senderCoordinator || msg.sender == receiverCoordinator, "19");
//        require(declinedBy == 0, "22");

//        if (msg.sender == senderAccount && senderPermission == 0)
//        {
//            senderPermission = 2;
//            Netereum(NetereumAddress).declineTransaction(address(this));
//
//        }
        if (msg.sender == receiverAccount && receiverPermission == 0)
        {
            receiverPermission = 2;
            Netereum(NetereumAddress).declineTransaction(address(this));
        }
        else if (msg.sender == senderCoordinator && senderCoordinatorPermission == 0)
        {
            senderCoordinatorPermission = 2;
            Netereum(NetereumAddress).declineTransaction(address(this));
        }
        else if (msg.sender == receiverCoordinator && senderCoordinatorPermission == 0)
        {
            receiverCoordinatorPermission = 2;
            Netereum(NetereumAddress).declineTransaction(address(this));
        }

    }

    function approve() public
    {
        require(msg.sender == senderAccount || msg.sender == receiverAccount || msg.sender == senderCoordinator || msg.sender == receiverCoordinator, "19");
//        require(declinedBy == 0, "22");

        //        if(msg.sender == senderAccount && !senderPermission)
        //        {
        //            senderPermission = true;
        //            counterPermission ++;
        //        }
        if (msg.sender == receiverAccount && receiverPermission == 0)
        {
            receiverPermission = 1;
            counterPermission++;
        }
        else if (msg.sender == senderCoordinator && senderCoordinatorPermission == 0)
        {
            senderCoordinatorPermission = 1;
            counterPermission++;
        }
        else if (msg.sender == receiverCoordinator && receiverCoordinatorPermission == 0)
        {
            receiverCoordinatorPermission = 1;
            counterPermission++;
        }
        // if all the four sides of a transactions have agreed, then the transaction will be done buy the Netereum if possible
        if (!NetereumCalled && counterPermission == 4)
        {
            NetereumCalled = true;
            Netereum(NetereumAddress).doTransaction(address(this));
            //needs to be modified
        }
    }
    // expire date should be created to
    //uint256 public sellerFee;
    // public buyerMaxFee;
    //uint256 public sellerMaxFee;
    constructor(
        address _sender, address _receiver,
        address _senderCoordinator, address _receiverCoordinator,
        uint256 _senderAmount, uint256 _receiverAmount, address _NetereumAddress)
    public
    {
        senderAccount = _sender;
        receiverAccount = _receiver;
        senderCoordinator = _senderCoordinator;
        receiverCoordinator = _receiverCoordinator;
        senderAmount = _senderAmount;
        receiverAmount = _receiverAmount;
        NetereumAddress = _NetereumAddress;

    }
    function setMaxFee(uint256 _maxFee) public
    {
        require(tx.origin == senderAccount);
        require(msg.sender == NetereumAddress);
        require(Netereum(NetereumAddress).transactionsStatus(address(this)) == 1, "9");
    maxFee = _maxFee;
    }
}