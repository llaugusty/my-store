pragma solidity 0.4.24;

import "./Listing.sol";

contract ListingsRegistry {

  event NewListing(uint _index);

  address public owner;

  Listing[] public listings;

  mapping (address => uint) indexes;

  constructor()
    public
  {
    owner = msg.sender;
  }

  function listingsLength()
    public
    constant
    returns (uint)
  {
      return listings.length;
  }

  function getListing(uint _index)
    public
    constant
    returns (Listing, address, string, uint, uint)
  {
    return (
      listings[_index],
      listings[_index].owner(),
      listings[_index].ipfsHash(),
      listings[_index].price(),
      listings[_index].unitsAvailable()
    );
  }

  function getListingByAddress(address addrs)
    public
    constant
    returns (Listing, address, string, uint, uint)
  {

    return (
      listings[indexes[addrs]],
      listings[indexes[addrs]].owner(),
      listings[indexes[addrs]].ipfsHash(),
      listings[indexes[addrs]].price(),
      listings[indexes[addrs]].unitsAvailable()
    );
  }

  function create(
    string _ipfsHash,
    uint _price,
    uint _unitsAvailable
  )
    public
    returns (uint)
  {
    listings.push(new Listing(msg.sender, _ipfsHash, _price, _unitsAvailable));
    indexes[listings[listings.length - 1]] = listings.length - 1;
    emit NewListing(listings.length-1);
    return listings.length;
  }
}
