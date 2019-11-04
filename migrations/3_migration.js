
var Netereum = artifacts.require("./Netereum.sol");

module.exports = function(deployer) {
  deployer.deploy(Netereum);
};
