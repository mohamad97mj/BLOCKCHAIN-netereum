pragma solidity ^0.5.0;

library Graph {
    /* The algorithm for computing the maximum fee and also executing the transactions needs a graph that represents
   the coordinators and the agreements between them. Therefore the elements of a graph are going to be declared as
   struct and they will be used in the Netereum contract*/
    /* Node : Each node represents a coordinator and the fields parent and distance will be used for the bellman ford algorithm in the
       max fee function */
    struct Node
    {
        address coordinator;
        address parent;// the key of the parent in the nodes list
        int256 distance;
        bool isInserted;
    }
    /* Edge : each edge describes the relation between two coordinators. In fact, every edge has a list of agreements
    between the two coordinators. The lowest fee in the agreements will be considered  as the weight of the edge. */
    struct Edge
    {
        address source;
        address destination; // FIRST IT WAS SUPPOSED TO BE A NODE, BUT SOLIDITY DOESN'T SUPPORT SAME POINTER TO MULTIPLE STRUCTS
        //WeightElement[] weights;
        mapping(uint256 => WeightElement) weights;
        uint256 numberOfWeights;
        uint256 minIndex;// index of the weight element with the minimum fee
    }
    /* WeightElement: this struct (data structure) is used to store the data  for each weight of an edge
     the numerator and denominator are part of a fraction which is used in division or multiplication when iterating through the graph */
    struct WeightElement
    {
        uint256 exchangeRate;
        int256 exchangeRateLog;// the log of exchange rate. this attribute is going to be used as the weight of the edge
        uint8 reverse;// if 1, the reverse of the exchange rate should be used
        uint256 sourceAmount;
        address agreementAddress;// the address of the associated agreement
    }
}
