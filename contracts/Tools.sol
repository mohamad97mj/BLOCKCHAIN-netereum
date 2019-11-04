pragma solidity ^0.5.0;

contract Tools {
    function logarithmBiggerThanOne(int256 x) internal returns(int256) /*for a given number x, this function returns the correct log(x) * 10 ^6                                                                       if x * 10^6 is given as the argument.
                                                                        note that x * 10^6 should be more than 10^6 and less than MAX_INT/2*/
    {
        int256 LOG = 0;
        while (x >= 1500000)
        {
            LOG = LOG + 405465;
            x = (x * 2) / 3;
        }
        x = x - 1000000;
        int256 y = x;
        int256 i = 1;
        while (i < 10)
        {
            LOG = LOG + (y / i);
            i = i + 1;
            y = y * x / 1000000;
            LOG = LOG - (y / i);
            i = i + 1;
            y = y * x / 1000000;
        }
        return LOG;
    }
    function logarithm(int256 x) public returns(int256)
    {
        if(x < 1000000)
        {
            return (logarithmBiggerThanOne(1000000 * x)) - 13815506;// 13815506 is logarithmBiggerThanOne(10^12)
        }
        else return logarithmBiggerThanOne(x);
    }
}
