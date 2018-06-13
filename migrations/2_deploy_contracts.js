var UserRegistry = artifacts.require("./UserRegistry.sol");
var ListingsRegistry = artifacts.require("./ListingsRegistry.sol");
var PurchaseLibrary = artifacts.require("./PurchaseLibrary.sol")
var Listing = artifacts.require("./Listing.sol")

module.exports = function(deployer) {
  return deployer.then(() => {
    return test(deployer);
  })
};


async function test(deployer) {
  await deployer.deploy(PurchaseLibrary)
  await deployer.link(PurchaseLibrary, ListingsRegistry)
  await deployer.link(PurchaseLibrary, Listing)

  await deployer.deploy(UserRegistry);
  await deployer.deploy(ListingsRegistry);
}