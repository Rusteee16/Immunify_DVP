import Debug "mo:base/Debug";
import Nat8 "mo:base/Nat8";
import Principal "mo:base/Principal";
import Cycles "mo:base/ExperimentalCycles";
import PassportActorClass "../passport/passport";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Text "mo:base/Text";
import Passport "../passport/passport";
import Array "mo:base/Array";
import Blob "mo:base/Blob";

actor Backend {

  //Custom datatypes
  //To store record of passports printed for any user
  private type Ledger = {
    minterId : Principal;
    userId : Principal;
    userName : Text;
    mintingDate : Text;
  };

  //To store passport transaction details
  private type TransferLedger = {
    senderId : Principal;
    receiverid : Principal;
    date : Text;
    status : Text;
  };

  //Record of all the passports minted with respect to their canister ids
  var mapOfPassports = HashMap.HashMap<Principal, PassportActorClass.Passport>(1, Principal.equal, Principal.hash);
  //Record of mapping of all the passports to their owners
  var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
  //Ledger to minting details of minter, minted for and minting date
  var ledgerOfPassports = HashMap.HashMap<Principal, List.List<Ledger>>(1, Principal.equal, Principal.hash);
  // var mapOfPublishes = HashMap.HashMap<Principal, Publish>(1, Principal.equal, Principal.hash);
  //Ledger to hold record of transfers done by the users
  var ledgerOfUserTransfers = HashMap.HashMap<Principal, List.List<TransferLedger>>(1, Principal.equal, Principal.hash);
  //Ledger to hold record of authorizations done by an enterprise
  var ledgerOfEnterpriseTransfers = HashMap.HashMap<Principal, List.List<TransferLedger>>(1, Principal.equal, Principal.hash);

  //To mint a new passport nft
  public shared (msg) func mint(owner : Principal, passportName : Text, passportId : Text, country : Text, sex : Text, vacName : Text, vacDate : Text, issueD : Text, image : [Nat8]) : async Principal {
    // minter/admin id
    let minter : Principal = msg.caller;

    //Cycles used or provided to the new passport minted.
    Debug.print(debug_show (Cycles.balance()));
    Cycles.add(100_500_000_000);
    //Minting new passport
    let newPassport = await PassportActorClass.Passport(owner, passportName, passportId, country, sex, vacName, vacDate, issueD, image);
    Debug.print(debug_show (Cycles.balance()));

    let newLedger : Ledger = {
      minterId = minter;
      userId = owner;
      userName = passportName;
      mintingDate = issueD;
    };

    addToPassportLedger(minter, newLedger);

    let newPassportPrincipal = await newPassport.getCanisterId();

    mapOfPassports.put(newPassportPrincipal, newPassport);
    addToOwnershipMap(owner, newPassportPrincipal);

    return newPassportPrincipal;
  };

  //To update the mapOfOwners ledger
  private func addToOwnershipMap(owner : Principal, passportId : Principal) {
    var ownedPassports : List.List<Principal> = switch (mapOfOwners.get(owner)) {
      case null List.nil<Principal>();
      case (?result) result;
    };

    ownedPassports := List.push(passportId, ownedPassports);
    mapOfOwners.put(owner, ownedPassports);
  };

  //updating minting records
  private func addToPassportLedger(minter : Principal, newLedger : Ledger) {
    var mintedPassports : List.List<Ledger> = switch (ledgerOfPassports.get(minter)) {
      case null List.nil<Ledger>();
      case (?result) result;
    };

    mintedPassports := List.push(newLedger, mintedPassports);
    ledgerOfPassports.put(minter, mintedPassports);
  };

  //Accessing minting records
  public query func getLedgerOfPassports(minter : Principal) : async [Ledger] {
    var mintedPassports : List.List<Ledger> = switch (ledgerOfPassports.get(minter)) {
      case null List.nil<Ledger>();
      case (?result) result;
    };

    return List.toArray(mintedPassports);
  };

  //Get all the passports registered under the requested user/enterprise owner id
  public query func getOwnedPassports(user : Principal) : async [Principal] {
    var userPassports : List.List<Principal> = switch (mapOfOwners.get(user)) {
      case null List.nil<Principal>();
      case (?result) result;
    };

    return List.toArray(userPassports);
  };

  // public shared (msg) func publishPassports(id : Principal, receiverId : Principal) : async Text {
  //   var item : PassportActorClass.Passport = switch (mapOfPassports.get(id)) {
  //     case null return "Passport does not exist.";
  //     case (?result) result;
  //   };

  //   let owner = await item.getOwner();
  //   if (Principal.equal(owner, msg.caller)) {
  // let newPublish : Publish = {
  //   passportOwner = owner;
  //   receiverOwner = receiverId;
  // };
  //     mapOfPublishes.put(id, newPublish);
  //     return "Success";
  //   } else {
  //     return "Invalid owner.";
  //   };
  // };

  public query func getImmunifyCanisterId() : async Principal {
    return Principal.fromActor(Backend);
  };

  //To handle transfer of passport by users
  public shared (msg) func completeTransfer(id : Principal, ownerId : Principal, newOwnerId : Principal) : async Text {
    //Check if there are records of transfer
    var transferedPassport : PassportActorClass.Passport = switch (mapOfPassports.get(id)) {
      //If no transfer record return empty list
      case null return "Passport does not exist";
      //If found return transfer ledger
      case (?result) result;
    };
    // if (msg.caller == ownerId) {
    //Transfering ownership of the passport from user to enterprise
    let transferResult = await transferedPassport.transferOwnership(ownerId, newOwnerId);
    //If transfer successfull update the owners ledger and the transfer ledger
    if (transferResult == "Success") {
      var ownedPassports : List.List<Principal> = switch (mapOfOwners.get(ownerId)) {
        case null List.nil<Principal>();
        case (?result) result;
      };
      ownedPassports := List.filter(
        ownedPassports,
        func(listItemId : Principal) : Bool {
          return listItemId != id;
        },
      );

      mapOfOwners.put(ownerId, ownedPassports);
      addToOwnershipMap(newOwnerId, id);
      return "Success";
    } else {
      return transferResult;
    };
    // } else {
    //   return "Invalid User";
    // };
  };

  //To handle enterprise authorisation of the passport
  public shared (msg) func transferDecision(id : Principal, ownerId : Principal, originalOwnerId : Principal, status : Text, date : Text) : async Text {
    var transferedPassport : PassportActorClass.Passport = switch (mapOfPassports.get(id)) {
      case null return "Passport does not exist";
      case (?result) result;
    };
    // if (msg.caller == ownerId) {
    let transferResult = await transferedPassport.transferOwnership(ownerId, originalOwnerId);
    if (transferResult == "Success") {
      let newTransferLedger : TransferLedger = {
        senderId = originalOwnerId;
        receiverid = ownerId;
        date = date;
        status = status;
      };
      addToTransferLedgers(ownerId, originalOwnerId, newTransferLedger);

      var ownedPassports : List.List<Principal> = switch (mapOfOwners.get(ownerId)) {
        case null List.nil<Principal>();
        case (?result) result;
      };
      ownedPassports := List.filter(
        ownedPassports,
        func(listItemId : Principal) : Bool {
          return listItemId != id;
        },
      );

      mapOfOwners.put(ownerId, ownedPassports);
      addToOwnershipMap(originalOwnerId, id);
      return "Success";

    } else {
      return transferResult;
    };
    // } else {
    //   return "Invalid User";
    // };
  };

  //Updating transfer ledger for both user and enterprise
  private func addToTransferLedgers(ownerId : Principal, originalOwnerId : Principal, newTransferLedger : TransferLedger) {
    var transfer : List.List<TransferLedger> = switch (ledgerOfUserTransfers.get(originalOwnerId)) {
      case null List.nil<TransferLedger>();
      case (?result) result;
    };

    transfer := List.push(newTransferLedger, transfer);
    ledgerOfUserTransfers.put(originalOwnerId, transfer);

    var entTransfer : List.List<TransferLedger> = switch (ledgerOfEnterpriseTransfers.get(ownerId)) {
      case null List.nil<TransferLedger>();
      case (?result) result;
    };

    entTransfer := List.push(newTransferLedger, entTransfer);
    ledgerOfEnterpriseTransfers.put(ownerId, entTransfer);
  };

  //Get transfer ledger of user/enterprise based upon request
  public query func getTransferLedger(requestId : Principal, requestType : Text) : async [TransferLedger] {
    if (requestType == "user") {
      var transfers : List.List<TransferLedger> = switch (ledgerOfUserTransfers.get(requestId)) {
        case null List.nil<TransferLedger>();
        case (?result) result;
      };
      return List.toArray(transfers);
    } else {
      var transfers : List.List<TransferLedger> = switch (ledgerOfEnterpriseTransfers.get(requestId)) {
        case null List.nil<TransferLedger>();
        case (?result) result;
      };
      return List.toArray(transfers);
    };
  };

};
