pragma solidity ^ 0.5.0;
import "./Agreement.sol";
import "./Transaction.sol";
import "./SafeMath.sol";
import "./Graph.sol";
import "./MainGraph.sol";
import "./AgreementFactory.sol";
import "./Transaction Factory.sol";
import "./Tools.sol";
import "./ToolFactory.sol";
contract Netereum
{
    using SafeMath for uint256;
    int256 public constant MAX_INT = int256(~(uint256(1) << 255));
    uint256 constant MAX_UINT = ~uint256(0);
    address owner;
    MainGraph mainGraph;
    AgreementFactory aFactory;
    TransactionFactory tFactory;
    ToolFactory toolFactory;
    Tools tool;
    constructor(/*AgreementFactory _aFactory,TransactionFactory tFactory,ToolFactory toolFactory*/) public
    {
        owner = msg.sender;
//        aFactory = _aFactory;
        aFactory = new AgreementFactory();
        tFactory = new TransactionFactory();
        toolFactory = new ToolFactory();
        tool = toolFactory.create();
    }
    function setMainGraph(address mainGraphAddress) public
    {
//        require(msg.sender == owner);
        mainGraph = MainGraph(address (mainGraphAddress));
    }
    //uint256 barterTime = 15669098070;
    address[] confirmedCoordinators;
    mapping(address => bool) isCoordinatorInserted;
    mapping(address => Transaction) createdTransactions;// these are all the transactions that have been created
    address [] public createdTransactionsAddress;
    mapping(address => uint8) public transactionsStatus ;// 0: not created  1:created 2: pending 3:added
    mapping(address => Agreement) createdAgreements;// these are all the Agreements that have been created
    mapping(address => uint8) public agreementsStatus;// 0: not created 1:offered 2:pending 3:expired 4:declined 5:altering
    address [] public createdAgreementsAddress;

    //mapping(address => bool) agreementExists;// this mapping shows if an agreement with a specific address has been created or not
    //mapping(address => bool) isAgreementAdded;// this mapping shows if an agreement has been added to the final agreements(for preventing that an agreement is added multiple times)
    Transaction[] public transactions;// These are the finalized transaction
    Agreement[] public agreements;//These are the finalized agreements QUESTION: SHOULD THESE TWO BE MAPS OR ARRAYS?
    mapping(address => uint256) transactionsExpireTime;
    uint256 public numberOfCreatedTransactions = 0;
    uint256 public numberOfCreatedAgreements = 0;
    uint256 public numberOfTransactions = 0;
    uint256 public numberOfAgreements = 0;
    uint256 public numberOfCoordinators = 0;
    //    event coordinatorAdded(address coordinator,bool added);
    //    event agreementCreated(address agreement);
    //    event transactionCreated(address transaction);
    //    event transactionAdded(address transaction, bool added);
    function addCoordinator(address coordinator) public
        // adding a coordinator to the list of valid coordinators
    {
        //require(msg.sender == owner);
        if (!isCoordinatorInserted[coordinator])
        {
            //nodes[coordinator].coordinator = coordinator;
            //nodes[coordinator].isInserted = true;
            confirmedCoordinators.push(coordinator);
            isCoordinatorInserted[coordinator] = true;
            numberOfCoordinators++;
            mainGraph.addNode(coordinator);
            //emit coordinatorAdded(coordinator,true);
        }
        //emit coordinatorAdded(coordinator,false);
    }

    function createAgreement(address _debtor, address _creditor,
        address _debtorCoordinator, address _creditorCoordinator,
        uint256 _debtorCost, uint256 _exchangeRate ,uint256 _expireTime,address agreementAddress)/*if the last field isn't 0, then this means that an agreement
        that has already been submitted needs to be change*/
    public returns(address)
    {
        uint256 cost = 0;
        if(agreementAddress == address(0))
        {
            //require(msg.sender == _debtor, "2");
            require(isCoordinatorInserted[_debtorCoordinator] == true, "3");
            require(isCoordinatorInserted[_creditorCoordinator] == true, "4");
//            require(_expireTime > block.timestamp,"5");
            cost = _debtorCost;
        }
        else
        {
            require(agreementsStatus[agreementAddress] == 2, "21");
            //require(msg.sender == createdAgreements[agreementAddress].debtor(), "2");
            agreementsStatus[agreementAddress] = 5;// altering
            cost = mainGraph.wrappedRemoveEdge(0,0,agreementAddress,1);
            require(cost> 0,"26");
        }
        require(_exchangeRate < uint256 (MAX_INT/2) && _exchangeRate > 0 ,"24");
        require(cost < (MAX_UINT / 1000000));
        //require(cost < (MAX_UINT / _exchangeRate));
        Agreement newAgreement = aFactory.create(
            _debtor, _creditor, _debtorCoordinator, _creditorCoordinator,
            cost,_exchangeRate,_expireTime,address (this)
        );
        address newAgreementAddress = address(newAgreement);
        numberOfCreatedAgreements++;
        createdAgreements[newAgreementAddress] = newAgreement;
        createdAgreementsAddress.push(newAgreementAddress);
        agreementsStatus[newAgreementAddress] = 1;//offered
        if(cost > 0 && agreementAddress != address (0))
            agreementsStatus[agreementAddress] = 2;// pending
        //emit agreementCreated(newAgreementAddress);
        return newAgreementAddress;
    }
    function addAgreement(address agreementAddress)
    external
    {
        require(agreementsStatus[agreementAddress] == 1, "6");
//        require(createdAgreements[agreementAddress].expireTime() > block.timestamp,"5");
        //require(createdAgreements[agreementAddress].counterPermission() == 4, "7 ");
        agreementsStatus[agreementAddress] = 2;// pending
        agreements.push(Agreement(address(agreementAddress)));
        numberOfAgreements++;
        mainGraph.wrappedAddEdge(createdAgreements[agreementAddress].creditorCoordinator(), createdAgreements[agreementAddress].debtorCoordinator(),
            createdAgreements[agreementAddress].exchangeRate(),tool.logarithm(int256(createdAgreements[agreementAddress].exchangeRate())),0,
            createdAgreements[agreementAddress].debtorCost() ,address(agreementAddress));
    }

    function createTransaction(address _buyer, address _seller,
        address _buyerCoordinator, address _sellerCoordinator,
        uint256 _buyerCost, uint256 _sellerCost) external returns(address)
    {
        //require(msg.sender == _buyer, "8");
        require(isCoordinatorInserted[_buyerCoordinator] == true, "3");
        require(isCoordinatorInserted[_sellerCoordinator] == true, "4");
        Transaction newTransaction =  tFactory.create(_buyer, _seller, _buyerCoordinator, _sellerCoordinator,
            _buyerCost, _sellerCost,address (this));
        address newTransactionAddress = address(newTransaction);
        createdTransactions[newTransactionAddress] = newTransaction;
        createdTransactionsAddress.push(newTransactionAddress);
        transactionsStatus[newTransactionAddress] = 1;// created
        numberOfCreatedTransactions++;
        //emit transactionCreated(addr);
        return newTransactionAddress;
    }
    /* When a customer is trying to execute a transaction, the parameters of the transaction are first sent to the Create transaction function which
       creates a transaction and returns the address of that transaction. then when all sides have given permission, then he transaction will be able to
       be sent to the do transaction function. if the transactions buyerCost is less than the buyerCost that the system can handle with its current state,
       the transaction will be added to the mapping "transactions" and can be executed by the coordinators. */
    uint256 public xy;
    function doTransaction(address addr) external
    {
        require(transactionsStatus[addr] == 1, "11");
        //require(createdTransactions[addr].counterPermission() == 4, "12");
        transactionsStatus[addr] = 2; //pending
        bool returnBool;
        uint256 returnFund;
        (returnBool,returnFund) = mainGraph.maxFund(createdTransactions[addr].buyerCoordinator(),
            createdTransactions[addr].sellerCoordinator(),
            createdTransactions[addr].buyerCost(),
            createdTransactions[addr].sellerCost() ,false);
        xy = returnFund;
        if (returnBool == true)
        {
            transactionsStatus[addr] = 3;
            transactions.push(Transaction(address(addr)));
            numberOfTransactions ++;
            //emit transactionAdded(addr,true);
        }
        else
        {
            transactionsStatus[addr] = 1;
            //emit transactionAdded(addr,false);
        }
    }
    //    function approximateMaxFee(address _buyerCoordinator, address _sellerCoordinator,
    //        uint256 _sellerCost) public returns(uint256)
    //    {
    ////        require(nodes[_buyerCoordinator].isInserted == true, "3");
    ////        require(nodes[_sellerCoordinator].isInserted == true, "4");
    //        bool temp;
    //        uint256 returnValue;
    //        (temp,returnValue) = maxFund(_buyerCoordinator,_sellerCoordinator,0, _sellerCost,true);
    //        return returnValue;
    //    }

//    function approveAgreement(address agreement) public{
//        agreementsStatus[agreement] = 2;
//    }

    function declineAgreement(address agreementAddress) public {
        require(agreementsStatus[agreementAddress] == 1, "14");
        require(msg.sender == agreementAddress);
        agreementsStatus[agreementAddress] = 4;
    }

    function declineTransaction(address transactionAddress) public {
        require(transactionsStatus[transactionAddress] == 1, "18");
        require(msg.sender == transactionAddress);
        transactionsStatus[transactionAddress] = 4;
    }
}

