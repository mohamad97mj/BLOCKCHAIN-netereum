pragma solidity ^0.5.0;
import "./Netereum.sol";
contract test {
    Netereum bart;
    function set(address addr) public
    {
        bart = Netereum(address (addr));
    }
    function build() public
    {
        bart.addCoordinator(0x78bc47CeA54A29a3604F0750f77a67C1Ab399B55);//mellat
        bart.addCoordinator(0x9e1f8a4f804CE710e06C2155033B3d6dEb767a30);//wells fargo
        bart.addCoordinator(0x896727C6198ddA989eA9998D52548ec26F59a80b);//vtb
        bart.addCoordinator(0x2989BD5a3C39fd3FeDAD5158B56320384C087e34);//macau
        bart.addCoordinator(0xc30043BC49b05eDCd975EC4cd245B257078A0728);//bank of china
        bart.addCoordinator(0xdFA926750561eD3b3EcA9899e6576958D85149D5);//tejarat
        //mellat to vtb
        bart.addAgreement(bart.createAgreement(0x3c28ee5a77b6aa58c79E10C8416f32C8d916705a,0xfBa507d4eAc1A2D4144335C793Edae54d212fa22,
        0x896727C6198ddA989eA9998D52548ec26F59a80b,0x78bc47CeA54A29a3604F0750f77a67C1Ab399B55,2000000000,2000000,15687229690,address(0)));
        // vtb to macau
        bart.addAgreement(bart.createAgreement(0x3c28ee5a77b6aa58c79E10C8416f32C8d916705a,0xfBa507d4eAc1A2D4144335C793Edae54d212fa22,
            0x2989BD5a3C39fd3FeDAD5158B56320384C087e34,0x896727C6198ddA989eA9998D52548ec26F59a80b,3000000000,250000,15687229690,address(0)));
        //mellat to macau
        bart.addAgreement(bart.createAgreement(0x3c28ee5a77b6aa58c79E10C8416f32C8d916705a,0xfBa507d4eAc1A2D4144335C793Edae54d212fa22,
            0x2989BD5a3C39fd3FeDAD5158B56320384C087e34,0x78bc47CeA54A29a3604F0750f77a67C1Ab399B55,6000000000,666666,15687229690,address(0)));
        //vtb to mellat
        bart.addAgreement(bart.createAgreement(0x3c28ee5a77b6aa58c79E10C8416f32C8d916705a,0xfBa507d4eAc1A2D4144335C793Edae54d212fa22,
            0x78bc47CeA54A29a3604F0750f77a67C1Ab399B55,0x896727C6198ddA989eA9998D52548ec26F59a80b,1000000000,666666,15687229690,address(0)));
    }
    function build2() public
    {
        bart.addAgreement(bart.createAgreement(0x3c28ee5a77b6aa58c79E10C8416f32C8d916705a,0xfBa507d4eAc1A2D4144335C793Edae54d212fa22,
        0x78bc47CeA54A29a3604F0750f77a67C1Ab399B55, 0x2989BD5a3C39fd3FeDAD5158B56320384C087e34,600000000,666666,15687229690,address(0)));
    }

//app.createTransaction.call('0x7792793A427B086480732279a3377f494FbFF5a7','0x2F61Bc9f8e2028de340d854ffF7187A2bC9C6f6d','0x78bc47CeA54A29a3604F0750f77a67C1Ab399B55','0x2989BD5a3C39fd3FeDAD5158B56320384C087e34','400000000','600000000')
//Netereum.deployed().then(function(instance){app = instance})
//test.deployed().then(function(instance){app = instance})
    //app.getAmount.call(0,0).then(function(inst){inst = inst.toNumber(); console.log(inst)})
}


//app.createTransaction.call('0x7792793A427B086480732279a3377f494FbFF5a7','0x2F61Bc9f8e2028de340d854ffF7187A2bC9C6f6d','0x78bc47CeA54A29a3604F0750f77a67C1Ab399B55','0x2989BD5a3C39fd3FeDAD5158B56320384C087e34','400000000','3000000000')