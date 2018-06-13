var ListingsRegistry = artifacts.require("./ListingsRegistry.sol");
var PurchaseRegistry = artifacts.require("./PurchaseRegistry.sol");
var Listing = artifacts.require("./Listing.sol");
var Purchase = artifacts.require("./Purchase.sol");
var ipfsAPI = require('ipfs-api')
var HttpIPFS = require('ipfs/src/http')

const fixturesDir = __dirname + '/../fixtures'

const startIpfs = (opts = {}) =>
  new Promise((resolve, reject) => {
    const httpAPI = new HttpIPFS(undefined, {
      Addresses: {
        API: '/ip4/0.0.0.0/tcp/5002',
        Gateway: '/ip4/0.0.0.0/tcp/8080'
      }
    })
    console.log('Start IPFS')
    httpAPI.start(true, async err => {
      if (err) {
        return reject(err)
      }
      console.log('Started IPFS')
      var result = await populateIpfs()

      resolve(result)
    })
  })

const populateIpfs = () =>
  new Promise((resolve, reject) => {
    var ipfs = ipfsAPI('localhost', '5002', { protocol: 'http' })
    console.log('Populate IPFS...')
    ipfs.util.addFromFs(fixturesDir, { recursive: true }, (err, result) => {
      if (err) {
        return reject(err)
      }
      console.log(result);
      resolve(result)
    })
  })

module.exports = function(deployer, network) {
  console.log('************');
  return deployer.then(() => {
    return deploy_sample_contracts(network)
  })
}

async function deploy_sample_contracts(network) {
  
  var data = await populateIpfs();
  var cost = [1, 2, 3, 4, 5];

  let accounts = await new Promise((resolve, reject) => {
    web3.eth.getAccounts((error, result) => {
      if (error) {
        reject(err)
      }
      resolve(result)
    })
  })

  const default_account = accounts[0]
  const a_seller_account = accounts[1]
  const a_buyer_account = accounts[2]
  const another_buyer_account = accounts[3]

  const listingsRegistry = await ListingsRegistry.deployed()
  const purchaseRegistry = await PurchaseRegistry.deployed()

  const getListingContract = async transaction => {
    const index = transaction.logs.find(x => x.event == "NewListing").args._index
    console.log('index', index);
    const info = await listingsRegistry.getListing(index)
    console.log('info', info)
    const address = info[0]
    return Listing.at(address)
  }

  const buyListing = async (listing, qty, from) => {
    const price = await listing.price()
    const transaction = await listing.buyListing(qty)
    const address = transaction.logs.find(x => x.event == "ListingPurchased").args._purchaseContract
    return Purchase.at(address)
  }

  console.log(`default_account:       ${default_account}`)
  console.log(`a_seller_account:      ${a_seller_account}`)
  console.log(`a_buyer_account:       ${a_buyer_account}`)
  console.log(`another_buyer_account: ${another_buyer_account}`)

  console.log('data', data);

  const additionalInfo = [
    { from: a_seller_account, gas: 4476768 },
    { from: default_account, gas: 4476768 },
    { from: a_seller_account, gas: 4476768 },
    { from: default_account, gas: 4476768 },    
    { from: default_account, gas: 4476768 }    
  ];

//   await data.forEach((item, index) => {
//     console.log('hash', item.hash);
//     console.log('cost', cost[index]);
//     console.log('info', additionalInfo[index]);
//     listingsRegistry.create(item.hash, cost[index], 1, additionalInfo[index]);
//   });

    for (var i = 0; i < 4; ++i) {
      await listingsRegistry.create(data[i].hash, cost[i], 1, additionalInfo[i]);
    }
  const ticketsTransaction = await listingsRegistry.create(
    data[4].hash,
    cost[4],
    1,
    additionalInfo[4]
  )

  console.log('network', network);

  if (network === "development") {
    // Creating ticket purchases at different stages
    const ticketsListing = await getListingContract(ticketsTransaction)
    let purchase

    purchase = await buyListing(ticketsListing, 1, default_account)

    // var length = await ticketsListing.purchasesLength()
    // console.log('fuck', Number(length))

    // await purchase.sellerConfirmShipped({ from: default_account })

    // purchase = await buyListing(ticketsListing, 1, another_buyer_account)
    // await purchase.sellerConfirmShipped({ from: default_account })
    // await purchase.buyerConfirmReceipt(5, "", { from: another_buyer_account })

    // purchase = await buyListing(ticketsListing, 1, another_buyer_account)
    // await purchase.sellerConfirmShipped({ from: default_account })
    // await purchase.buyerConfirmReceipt(3, "", { from: another_buyer_account })
    // await purchase.sellerCollectPayout(4,"",{ from: default_account })

    // var address1 = await purchaseRegistry.getPurchase(another_buyer_account, 0);
    // var address2 = await purchaseRegistry.getPurchase(another_buyer_account, 1);
    
    // console.log('address 1', address1, address2);
  }
}
