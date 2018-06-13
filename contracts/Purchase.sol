pragma solidity 0.4.24;

import "./Listing.sol";


contract Purchase {
    
    event PurchaseChange(Stages stage);
    event PurchaseReview(address reviewer, address reviewee, uint8 rating, string ipfsHash);

    Listing public listingContract;
    address public buyer;
    uint public created;
    Stages private internalStage = Stages.AWAITING_PAYMENT;

    enum Stages {
        AWAITING_PAYMENT, // Buyer hasn't paid full amount yet
        SHIPPING_PENDING, // Waiting for the seller to ship
        BUYER_PENDING, // Waiting for buyer to confirm receipt
        SELLER_PENDING, // Waiting for seller to confirm all is good
        IN_DISPUTE, // We are in a dispute
        REVIEW_PERIOD, // Time for reviews (only when transaction did not go through)
        COMPLETE // It's all over
    }

    constructor(
        address _listingContractAddress,
        address _buyer
    )
    public
    {
        buyer = _buyer;
        listingContract = Listing(_listingContractAddress);
        created = now;
    }

    
    modifier atStage(Stages _stage) {
        require(stage() == _stage);
        _;
    }

      function data()
    public
    view
    returns (address _owner, Stages stage, address _price, address _unitsAvailable, uint _created)
  {
    return (this, internalStage, listingContract, buyer, created);
  }


    function stage()
    public
    view
    returns (Stages _stage)
    {
        if (internalStage == Stages.BUYER_PENDING) {
            return Stages.SELLER_PENDING;
        }
        return internalStage;
    }


    function pay()
    public
    payable
    {
        if (address(this).balance >= listingContract.price()) {
            internalStage = Stages.SHIPPING_PENDING;
            emit PurchaseChange(internalStage);
        }
    }

    
    function sellerConfirmShipped()
    public
    {
        internalStage = Stages.BUYER_PENDING;
        emit PurchaseChange(internalStage);
    }

    function buyerConfirmReceipt(uint8 _rating, string _ipfsHash)
    public
    {
        internalStage = Stages.SELLER_PENDING;

        // Events
        emit PurchaseChange(internalStage);
        emit PurchaseReview(buyer, listingContract.owner(), _rating, _ipfsHash);
    }
    
    function sellerCollectPayout(uint8 _rating, string _ipfsHash)
    public
    {
        internalStage = Stages.COMPLETE;
        
        emit PurchaseChange(internalStage);
        emit PurchaseReview(listingContract.owner(), buyer, _rating, _ipfsHash);

        listingContract.owner().transfer(address(this).balance);
    }
}
