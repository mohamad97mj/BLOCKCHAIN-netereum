pragma solidity ^0.5.0;
import "./Tools.sol";
contract ToolFactory {
    function create() public returns(Tools)
    {
        return new Tools();
    }
}
