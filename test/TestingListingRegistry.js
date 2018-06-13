const ListingsRegistry = artifacts.require("./ListingsRegistry.sol")

const isEVMError = function(err) {
  let str = err.toString()
  return str.includes("revert")
}

const timetravel = async function(seconds) {
  var transaction = await web3.currentProvider.send({
    jsonrpc: "2.0",
    method: "evm_increaseTime",
    params: [seconds],
    id: 0
  })
  await web3.currentProvider.send({
    jsonrpc: "2.0",
    method: "evm_mine",
    params: [],
    id: 0
  })
}

const ipfsHash =
  "0x6b14cac30356789cd0c39fec0acc2176c3573abdb799f3b17ccc6972ab4d39ba"
const price = 33
const unitsAvailable = 42
const LISTING_EXPIRATION_SECONDS = 60 * 24 * 60 * 60

contract("ListingRegistry", accounts => {
  var owner = accounts[0];
  var instance;
  
  beforeEach(async function() {
    instance = await ListingsRegistry.new({from: owner});
  })

  it("shoud return proper information", async function() {
    const initPrice = 2
    const initUnitsAvailable = 5
    await instance.create(ipfsHash, initPrice, initUnitsAvailable, {
      from: accounts[0]
    })

    let length = await instance.listingsLength();
    assert.equal(length.c[0], 1);

    let [
      listingAddress,
      lister,
      hash,
      price,
      unitsAvailable
    ] = await instance.getListing(0);

    assert.equal(lister, accounts[0], "lister is correct")
    assert.equal(hash, ipfsHash, "ipfsHash is correct")
    assert.equal(price, initPrice, "price is correct")
    assert.equal(
      unitsAvailable,
      initUnitsAvailable,
      "unitsAvailable is correct"
    )
  })
})
