pragma solidity ^0.5.0;
import "./Graph.sol";
import "./SafeMath.sol";
import "./Agreement.sol";
contract MainGraph {
    using SafeMath for uint256;
    int256 public constant MAX_INT = int256(~(uint256(1) << 255));
    uint256 constant MAX_UINT = ~uint256(0);
    address public netereumAddress;
    address[] confirmedCoordinators;
    uint256 public numberOfCoordinators = 0;
//    constructor(address _NetereumAddress) public
//    {
//        NetereumAddress = _NetereumAddress;
//    }
    function setRequirements(address addr) public
    {
        netereumAddress = addr;
    }
    mapping(address => Graph.Node) public  nodes;
    mapping(uint256 => Graph.Edge)  public edges;
    uint256 public numberOfNodes;
    uint256 public numberOfEdges;
    function addNode(address coordinator) public
    {
        require(msg.sender == netereumAddress);
        nodes[coordinator].coordinator = coordinator;
        numberOfNodes ++;
        nodes[coordinator].isInserted = true;
        confirmedCoordinators.push(coordinator);

        numberOfCoordinators++;
    }
    mapping(address => mapping(address => uint256)) public  edgeIndex;/* a mapping that maps a combined key containing the source coordinator
    and the destination coordinator to the index + 1 of that edge in the edges array*/

    function addEdge(address sourceCoordinator, address destinationCoordinator,
        uint256 exchangeRate,int256 exchangeRateLog,uint8 reverse,uint256 sourceAmount,address agreementAddress,uint8 flag)
        // if flag = 0, then the function has been called normally otherwise the edge may create a negative cycle thus an additional algorithm will be executed
    internal
    {
        if (nodes[sourceCoordinator].isInserted && nodes[destinationCoordinator].isInserted)
        {
            uint256 index = edgeIndex[sourceCoordinator][destinationCoordinator];
            if (index == 0)//it means that this edge is a new edge
            {
                edges[numberOfEdges].source = sourceCoordinator;
                edges[numberOfEdges].destination = destinationCoordinator;
                edges[numberOfEdges].weights[0].exchangeRate = exchangeRate;
                edges[numberOfEdges].weights[0].exchangeRateLog = exchangeRateLog;
                edges[numberOfEdges].weights[0].reverse = reverse;
                edges[numberOfEdges].weights[0].sourceAmount = sourceAmount;
                edges[numberOfEdges].weights[0].agreementAddress = agreementAddress;
                edges[numberOfEdges].numberOfWeights++;
                numberOfEdges++;
                edgeIndex[sourceCoordinator][destinationCoordinator] = numberOfEdges;
            }
            else
            {
                uint256 index2 = 0;
                index --;
                for (index2 = 0; index2 < edges[index].numberOfWeights; index2 ++)
                    if (edges[index].weights[index2].agreementAddress == agreementAddress)
                        break;
                if (index2 == edges[index].numberOfWeights)// if the associated weight element was not found
                {
                    edges[index].weights[edges[index].numberOfWeights].exchangeRate = exchangeRate;
                    edges[index].weights[edges[index].numberOfWeights].exchangeRateLog = exchangeRateLog;
                    edges[index].weights[edges[index].numberOfWeights].sourceAmount = sourceAmount;
                    edges[index].weights[edges[index].numberOfWeights].reverse = reverse;
                    edges[index].weights[edges[index].numberOfWeights].agreementAddress = agreementAddress;
                    edges[index].numberOfWeights++;
                    if (exchangeRate < edges[index].weights[edges[index].minIndex].exchangeRate)
                    {
                        edges[index].minIndex = edges[index].numberOfWeights - 1;
                    }
                }
                else
                {
                    edges[index].weights[index2].sourceAmount += sourceAmount;
                }
            }
            if(flag == 1)
            {
                if(exchangeRateLog > 0)
                    return;
                else
                {
                    //running the bellman ford with source = sourceCoordinator
                    while(true)
                    {
                        for (uint256 i = 0; i < numberOfCoordinators; i++)
                        {

                            if (nodes[confirmedCoordinators[i]].coordinator == sourceCoordinator)
                            {
                                nodes[confirmedCoordinators[i]].distance = 0;
                            }
                            else
                            {
                                nodes[confirmedCoordinators[i]].distance = MAX_INT;
                            }

                            nodes[confirmedCoordinators[i]].parent = address(0);
                            //SHOULD BE MODIFIED
                        }

                        /*the Bellman-Ford algorithm for finding the shortest path and distance between
                        our source coordinator and destination coordinator*/

                        for (uint i = 1; i < numberOfNodes; i++)// we can use number of coordinators instead of number of nodes
                        {
                            for (uint j = 0; j < numberOfEdges; j++)
                            {
                                if (nodes[edges[j].source].distance != MAX_INT &&
                                nodes[edges[j].source].distance +
                                edges[j].weights[edges[j].minIndex].exchangeRateLog <
                                nodes[edges[j].destination].distance)
                                {
                                    nodes[edges[j].destination].distance =
                                    nodes[edges[j].source].distance +
                                    edges[j].weights[edges[j].minIndex].exchangeRateLog;
                                    nodes[edges[j].destination].parent = edges[j].source;
                                }
                            }
                        }

                        address tempDestination ;
                        bool containsNegativeCycle = false;
                        for (uint256 j = 0; j < numberOfEdges; j++)
                        {
                            if (nodes[edges[j].source].distance != MAX_INT &&
                            nodes[edges[j].source].distance +
                            edges[j].weights[edges[j].minIndex].exchangeRateLog <
                            nodes[edges[j].destination].distance)
                            {
                                indexxx++;
                                tempDestination = nodes[edges[j].destination].coordinator;
                                containsNegativeCycle = true;
                                break;
                            }
                        }
                        if(!containsNegativeCycle)
                            break;
                        else
                        {
                            uint256 transferAmount = 0;
                            uint256 destAmount = 0;
                            address [] memory cycle = new address[](2 * numberOfEdges);//array of the indexes of the edges
                            uint256 cycleLength = 0;
                            address tempDestination2 = tempDestination;

                            while (true)
                            {
                                cycle[cycleLength] = tempDestination;
                                cycle[cycleLength + 1] = nodes[tempDestination].parent;
                                cycleLength += 2;
//                                path.push(tempDestination);
//                                path.push(nodes[tempDestination].parent);
                                tempDestination = nodes[tempDestination].parent;
                                if(tempDestination == tempDestination2)
                                    break;
                            }
                            for(uint256 i = cycleLength - 1;i >= 1 ; i-=2)
                            {
                                index = edgeIndex[cycle[i]][cycle[i-1]] - 1;
                                if(i == cycleLength - 1)
                                {
                                    if(edges[index].weights[edges[index].minIndex].reverse == 0)
                                    {
                                        transferAmount = (edges[index].weights[edges[index].minIndex].sourceAmount * 1000000)/
                                        edges[index].weights[edges[index].minIndex].exchangeRate  ;
                                    }
                                    else
                                    {
                                        uint256 temp = edges[index].weights[edges[index].minIndex].sourceAmount *edges[index].weights[edges[index].minIndex].exchangeRate;
                                        transferAmount = temp/ 1000000;
                                        if(temp % 1000000 != 0)
                                            transferAmount++;//for getting the upper bound of the result in the division
                                    }
                                }
                                else if(i  < cycleLength - 1)
                                {
                                    if(transferAmount > edges[index].weights[edges[index].minIndex].sourceAmount )
                                        transferAmount = edges[index].weights[edges[index].minIndex].sourceAmount;
                                    if(edges[index].weights[edges[index].minIndex].reverse == 0)
                                    {
                                        transferAmount = (transferAmount *1000000) /
                                        edges[index].weights[edges[index].minIndex].exchangeRate;
                                    }
                                    else
                                    {
                                        uint256 temp = transferAmount * edges[index].weights[edges[index].minIndex].exchangeRate;
                                        transferAmount = temp / 1000000 ;
                                        if(temp % 1000000 != 0)
                                            transferAmount++;
                                    }
                                }
//                                pathAmounts[cycleLength - 1 - i] = transferAmount;
                                if(i == 1)
                                    break;
                            }
                            for(uint256 i = 0;i < cycleLength  ; i+=2)
                            {
                                index = edgeIndex[cycle[i+1]][cycle[i]] - 1;

                                if(edges[index].weights[edges[index].minIndex].reverse == 0)
                                {
                                    uint256 temp = transferAmount *edges[index].weights[edges[index].minIndex].exchangeRate;
                                    transferAmount = temp/ 1000000;
                                    if(temp % 1000000 != 0)
                                        transferAmount++;
                                    removeEdge(index,transferAmount,address(0),uint8(0));
                                }
                                else
                                {
                                    transferAmount = (transferAmount * 1000000)/edges[index].weights[edges[index].minIndex].exchangeRate;
//                                    if(edges[index].weights[edges[index].minIndex].exchangeRate % 1000000 != 0)
//                                        transferAmount ++;
                                    removeEdge(index,transferAmount,address(0),uint8(0));
                                }
//                                pathAmounts[pathLength / 2] = transferAmount;
                            }
                        }
                        //break;
                    }
                }
            }
        }
    }
    uint256 public indexxx = 20;
    function wrappedAddEdge(address sourceCoordinator, address destinationCoordinator,
        uint256 exchangeRate,int256 exchangeRateLog,uint8 reverse,uint256 sourceAmount,address agreementAddress) public
    {
        require(msg.sender == netereumAddress);
        require(nodes[sourceCoordinator].isInserted == true, "3");
        require(nodes[destinationCoordinator].isInserted == true, "4");
        addEdge(sourceCoordinator,destinationCoordinator,
            exchangeRate, exchangeRateLog, reverse, sourceAmount, agreementAddress , 1);
    }
    //app.wrappedAddEdge('0x3c28ee5a77b6aa58c79E10C8416f32C8d916705a','0xfBa507d4eAc1A2D4144335C793Edae54d212fa22',1000000000,2000000,8,15687229690,'0x3c28ee5a77b6aa58c79E10C8416f32C8d916705a')
    function removeEdge(uint256 index, uint256 sourceAmount,address agreementAddress,uint8 flag) internal returns(uint256)
    {
        uint256 mainIndex ;
        uint256 weightIndex = 0;
        uint256  remainingAmount = 0;
        if(flag == 0)
        {
            weightIndex = edges[index].minIndex;
            mainIndex = index;
        }
        else
        {
            mainIndex = edgeIndex[Agreement(agreementAddress).creditorCoordinator()][Agreement(agreementAddress).debtorCoordinator()] - 1 ;
            for(uint256 i = 0;i < edges[mainIndex].numberOfWeights;i++)
            {
                if(edges[mainIndex].weights[i].agreementAddress == agreementAddress)
                {
                    weightIndex = i;
                    break;
                }
            }
        }
        edges[mainIndex].weights[weightIndex].sourceAmount -= sourceAmount;
        uint8 forLength = 1;
        if(flag == 2)
        {
            forLength = 2;
        }
        for(uint8 j = 0; j < forLength; j++)
        {
            if (edges[mainIndex].weights[weightIndex].sourceAmount == 0|| flag > 0)
            {
                if(j == 0)
                {
                    remainingAmount = edges[mainIndex].weights[weightIndex].sourceAmount;
                }
                edges[mainIndex].weights[weightIndex].exchangeRate =
                edges[mainIndex].weights[edges[mainIndex].numberOfWeights - 1].exchangeRate;
                edges[mainIndex].weights[weightIndex].exchangeRateLog =
                edges[mainIndex].weights[edges[mainIndex].numberOfWeights - 1].exchangeRateLog;
                edges[mainIndex].weights[weightIndex].reverse =
                edges[mainIndex].weights[edges[mainIndex].numberOfWeights - 1].reverse;
                edges[mainIndex].weights[weightIndex].sourceAmount =
                edges[mainIndex].weights[edges[mainIndex].numberOfWeights - 1].sourceAmount;
                edges[mainIndex].weights[weightIndex].agreementAddress =
                edges[mainIndex].weights[edges[mainIndex].numberOfWeights - 1].agreementAddress;
                edges[mainIndex].numberOfWeights --;
                uint256 min = MAX_UINT;
                for (uint256 i = 0; i < edges[mainIndex].numberOfWeights; i++)
                {
                    if (min > edges[mainIndex].weights[i].exchangeRate)
                    {
                        min = edges[mainIndex].weights[i].exchangeRate;
                        edges[mainIndex].minIndex = i;
                    }
                }
                if (edges[mainIndex].numberOfWeights == 0)
                {
                    //swapping the current edge with the last edge and decrementing the number of edges
                    edgeIndex[edges[mainIndex].source][edges[mainIndex].destination] = 0;
                    edgeIndex[edges[numberOfEdges - 1].source][edges[numberOfEdges - 1].destination] = mainIndex+1;
                    edges[mainIndex].source = edges[numberOfEdges - 1].source;
                    edges[mainIndex].destination = edges[numberOfEdges - 1].destination;
                    // code for swapping the weights of the desired edge and the last edge
                    for (uint256 i = 0; i < edges[numberOfEdges - 1].numberOfWeights; i ++)
                    {
                        edges[mainIndex].weights[i].exchangeRateLog = edges[numberOfEdges - 1].weights[i].exchangeRateLog;
                        edges[mainIndex].weights[i].exchangeRate = edges[numberOfEdges - 1].weights[i].exchangeRate;
                        edges[mainIndex].weights[i].reverse= edges[numberOfEdges - 1].weights[i].reverse;
                        edges[mainIndex].weights[i].sourceAmount = edges[numberOfEdges - 1].weights[i].sourceAmount;
                        edges[mainIndex].weights[i].agreementAddress = edges[numberOfEdges - 1].weights[i].agreementAddress;
                    }
                    edges[mainIndex].numberOfWeights = edges[numberOfEdges - 1].numberOfWeights;
                    edges[mainIndex].minIndex = edges[numberOfEdges - 1].minIndex;
                    numberOfEdges --;
                }
            }
            if(flag == 2 && j == 0)
            {
                mainIndex = edgeIndex[Agreement(agreementAddress).creditorCoordinator()][Agreement(agreementAddress).debtorCoordinator()];
                if(mainIndex > 0)
                {
                    mainIndex --;
                    for(uint256 i = 0;i < edges[mainIndex].numberOfWeights;i++)
                    {
                        if(edges[mainIndex].weights[i].agreementAddress == agreementAddress)
                        {
                            weightIndex = i;
                            break;
                        }
                    }
                }
                else
                    break;
            }
        }
        if(agreementAddress == address (0))
            remainingAmount = 0;
        return remainingAmount;
    }
    function wrappedRemoveEdge(uint256 index, uint256 sourceAmount,address agreementAddress,uint8 flag) public returns(uint256)
    {
        require(msg.sender == netereumAddress);
        return removeEdge(index,sourceAmount,agreementAddress,flag);
    }
    address[] public  path;
    mapping(uint256 => uint256) public pathAmounts;
    uint256 public pathLength;
    function maxFund(address _buyerCoordinator, address _sellerCoordinator,uint256 _buyerCost,
        uint256 _sellerCost,bool virtual) public returns (bool,uint256)
    {
        require(msg.sender == netereumAddress);
//                for(uint256 i = numberOfAgreements - 1;i >= 0; i--)//removing the agreements and edges that have expired
//                {
//                    if(agreements[i].expireTime() < block.timestamp)
//                    {
//                        removeEdge(0,0,address(agreements[i]),2);
////                        agreementStatus[address(agreements[i])] = 3;//expired
////                        agreements[i] = agreements[numberOfAgreements - 1];//needs to be Checkeddddd
////                        agreements.pop();
//                    }
//                    if(i == 0)
//                        break;
//                }

        if(pathLength > 0)
        {
            for (uint256 i = pathLength - 1; i >= 1; i -= 2)/*  the variable i could have been int256 too,
                    but that required the conversion of pathLength to int256 which would be hazardous */
            {
                path.pop();
                path.pop();
                pathAmounts[i] = 0;
                pathAmounts[i-1] = 0;
                if(i == 1)// because of i being uint, when i == 1 the next iteration will start with i = MAX_uint
                    break;
            }
        }
        pathLength = 0;
        uint256 pathStart = 0;// the index that the path for the current iteration starts
        uint256 sum = 0;
        uint256 amount = 0;// the amount that the sender has to pay if the transaction is accepted by the system
        while (sum < _sellerCost)
        {
            // initializing the distance of the nodes
            for (uint i = 0; i < numberOfCoordinators; i++)
            {

                if (nodes[confirmedCoordinators[i]].coordinator == _buyerCoordinator)
                {
                    nodes[confirmedCoordinators[i]].distance = 0;
                }
                else
                {
                    nodes[confirmedCoordinators[i]].distance = MAX_INT;
                }

                nodes[confirmedCoordinators[i]].parent = address(0);
                //SHOULD BE MODIFIED
            }

            /*the Bellman-Ford algorithm for finding the shortest path and distance between
            our source coordinator and destination coordinator*/

            for (uint i = 1; i < numberOfNodes; i++)// we can use number of coordinators instead of number of nodes
            {
                for (uint j = 0; j < numberOfEdges; j++)
                {
                    if (nodes[edges[j].source].distance != MAX_INT &&
                    nodes[edges[j].source].distance +
                    edges[j].weights[edges[j].minIndex].exchangeRateLog <
                    nodes[edges[j].destination].distance)
                    {
                        nodes[edges[j].destination].distance =
                        nodes[edges[j].source].distance +
                        edges[j].weights[edges[j].minIndex].exchangeRateLog;
                        nodes[edges[j].destination].parent = edges[j].source;
                    }
                }
            }


            // /* backtracking from the destination Coordinator to the source Coordinator to
            // find the maximum amount that can be transferred through this path*/
            uint256 transferAmount = 0;// the amount that the current path can transfer
            uint256 minAmount = 0; // the minimum amount that can be sent to the receiver
            address tempDestination = _sellerCoordinator;
            require(nodes[tempDestination].parent != address(0), "13");
            while (tempDestination != _buyerCoordinator)
            {
                path.push(tempDestination);
                path.push(nodes[tempDestination].parent);
                pathLength += 2;
                uint index = edgeIndex[nodes[tempDestination].parent][tempDestination] - 1;
                uint256 destAmount = 0;
                if(edges[index].weights[edges[index].minIndex].reverse == 0)
                {
                    destAmount = (edges[index].weights[edges[index].minIndex].sourceAmount * 1000000)/
                    edges[index].weights[edges[index].minIndex].exchangeRate  ;
                }
                else
                {
                    uint256 temp = edges[index].weights[edges[index].minIndex].sourceAmount *edges[index].weights[edges[index].minIndex].exchangeRate;
                    destAmount = temp / 1000000;
                    if(temp % 1000000 != 0)
                        destAmount++;
                }
                if(pathLength == 2)
                {
                    if(destAmount < _sellerCost - sum)
                    {
                        transferAmount =  edges[index].weights[edges[index].minIndex].sourceAmount;
                    }
                    else
                    {
                        if(edges[index].weights[edges[index].minIndex].reverse == 0)
                        {
                            uint256 temp = (_sellerCost - sum) * edges[index].weights[edges[index].minIndex].exchangeRate;
                            transferAmount = temp / 1000000   ;
                            if(temp % 1000000 != 0)
                                transferAmount++;
                        }
                        else
                        {
                            transferAmount = ((_sellerCost - sum) *1000000) /
                            edges[index].weights[edges[index].minIndex].exchangeRate;
                        }
                    }
                }
                else if(pathLength > 2)
                {
                    if(transferAmount > destAmount )
                        transferAmount = destAmount;
                    if(edges[index].weights[edges[index].minIndex].reverse == 0)
                    {
                        uint256 temp = transferAmount * edges[index].weights[edges[index].minIndex].exchangeRate;
                        transferAmount = temp / 1000000   ;
                        if(temp % 1000000 != 0)
                            transferAmount++;
                    }
                    else
                    {
                        transferAmount = (transferAmount *1000000) /
                        edges[index].weights[edges[index].minIndex].exchangeRate;
                    }
                }
                tempDestination = nodes[tempDestination].parent;
            }
            amount += transferAmount;
            minAmount = transferAmount;
            // backtracking again to reduce the weights of the edges
            for(uint256 i = pathLength - 1;i >= pathStart + 1 ; i-=2)
            {
                uint256 index = edgeIndex[path[i]][path[i-1]] - 1;
                pathAmounts[i-1] = minAmount;
                if(edges[index].weights[edges[index].minIndex].reverse == 0)
                {
                    uint256 temp = (minAmount * 1000000)/edges[index].weights[edges[index].minIndex].exchangeRate;
                    addEdge(path[i-1],path[i],
                        edges[index].weights[edges[index].minIndex].exchangeRate,
                        -1 * edges[index].weights[edges[index].minIndex].exchangeRateLog,
                        1,temp, edges[index].weights[edges[index].minIndex].agreementAddress,0);
                    removeEdge(index,minAmount,address(0),uint8(0));
                    minAmount = temp;
                }
                else
                {
                    uint256 temp = (minAmount *edges[index].weights[edges[index].minIndex].exchangeRate);
                    if(temp % 1000000 != 0)
                    {
                        temp = temp / 1000000;
                        temp ++;
                    }
                    else
                        temp = temp /1000000;
                    addEdge(path[i-1],path[i],
                        edges[index].weights[edges[index].minIndex].exchangeRate,
                        -1 * edges[index].weights[edges[index].minIndex].exchangeRateLog,
                        0,temp, edges[index].weights[edges[index].minIndex].agreementAddress,0);
                    removeEdge(index,minAmount,address(0),uint8(0));
                    minAmount = temp;
                }
                pathAmounts[i] = minAmount;
                if(i == pathStart + 1)
                    break;
            }
            sum += minAmount;
            pathStart = pathLength;
        }
                if (amount > _buyerCost || virtual)//changing the graph to the previous state //BE CAREFUL HEREEEEEE
                {
                    // neutralizing the effects that our computation had on the graph
                    for (uint256 i = pathLength - 1; i >= 1; i -= 2)
                    {
                        uint256 index = edgeIndex[path[i - 1]][path[i]] -1;

                        if(edges[index].weights[edges[index].minIndex].reverse == 0)
                        {
                            addEdge(path[i],path[i-1],
                                edges[index].weights[edges[index].minIndex].exchangeRate,
                                -1 * edges[index].weights[edges[index].minIndex].exchangeRateLog,
                                1,pathAmounts[i-1],
                                edges[index].weights[edges[index].minIndex].agreementAddress,0);
                            removeEdge(index,pathAmounts[i],address(0),0);

                        }
                        else
                        {
                            addEdge(path[i],path[i-1],
                                edges[index].weights[edges[index].minIndex].exchangeRate,
                                -1 * edges[index].weights[edges[index].minIndex].exchangeRateLog,
                                0,pathAmounts[i-1],
                                edges[index].weights[edges[index].minIndex].agreementAddress,0);
                            removeEdge(index,pathAmounts[i],address(0),0);
                        }
                        if(i == 1)
                            break;
                    }
                    return (false,amount);
                }
                else
        return (true,amount);
    }
    function getParent(address addr) public returns(address)
    {
        return nodes[addr].parent;
    }
    function getMinIndex(uint256 i) public returns(uint256)
    {
        return edges[i].minIndex;
    }
    function getNumberOfWeights(uint256 i) public returns(uint256)
    {
        return edges[i].numberOfWeights;
    }
    function getAmount(uint256 i,uint256 j) public returns(uint256)
    {
        return edges[i].weights[j].sourceAmount;
    }
    function getRate(uint256 i,uint256 j) public returns(uint256)
    {
        return edges[i].weights[j].exchangeRate;
    }
    function getLog(uint256 i,uint256 j) public returns(int256)
    {
        return edges[i].weights[j].exchangeRateLog;
    }
}
