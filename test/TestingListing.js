const Listing = artifacts.require("./Listing.sol")

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

contract("Listing", accounts => {
  var seller = accounts[0]
  var buyer = accounts[1]
  var stranger = accounts[2]
  var listing

  beforeEach(async function() {
    listing = await Listing.new(seller, ipfsHash, price, unitsAvailable, {
      from: seller
    })
  })

  it("should allow getting listing information", async function() {
    let data = await listing.data()
    assert.equal(data[0], seller, "owner")
    assert.equal(data[1], ipfsHash, "ipfsHash")
    assert.equal(data[2], price, "price")
    assert.equal(data[3], unitsAvailable, "unitsAvailable")
    assert.equal(
      data[4].toNumber(),
      (await listing.created()).toNumber(),
      "created"
    )
    assert.equal(
      data[5].toNumber(),
      (await listing.expiration()).toNumber(),
      "expiration"
    )
  })

//   it("should be able to buy a listing", async function() {
//     const unitsToBuy = 1 // TODO: Handle multiple units
//     const buyTransaction = await listing.buyListing(unitsToBuy, {
//       from: buyer,
//       value: 6
//     })
//     const listingPurchasedEvent = buyTransaction.logs.find(
//       e => e.event == "ListingPurchased"
//     )
//     const purchaseContract = await Purchase.at(
//       listingPurchasedEvent.args._purchaseContract
//     )

//     // Check units available decreased
//     let newUnitsAvailable = await listing.unitsAvailable()
//     assert.equal(
//       newUnitsAvailable,
//       unitsAvailable - unitsToBuy,
//       "units available has decreased"
//     )

//     // Check buyer set correctly
//     assert.equal(await purchaseContract.buyer(), buyer)

//     // Check that purchase was stored in listings
//     assert.equal((await listing.purchasesLength()).toNumber(), 1)

//     // Check that we can fetch the purchase address
//     assert.equal(await listing.getPurchase(0), purchaseContract.address)
//   })
})
