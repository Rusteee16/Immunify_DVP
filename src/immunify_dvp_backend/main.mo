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

  private type Publish = {
    passportOwner : Principal;
    receiverOwner : Principal;
  };

  private type Ledger = {
    minterId : Principal;
    userId : Principal;
    userName : Text;
    mintingDate : Text;
  };

  private type UserLedger = {
    receiverid : Principal;
    date : Text;
    status : Text;
  };

  private type EnterprisesLedger = {
    senderId : Principal;
    date : Text;
    status : Text;
  };

  var mapOfPassports = HashMap.HashMap<Principal, PassportActorClass.Passport>(1, Principal.equal, Principal.hash);
  var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
  var ledgerOfPassports = HashMap.HashMap<Principal, List.List<Ledger>>(1, Principal.equal, Principal.hash);
  var mapOfPublishes = HashMap.HashMap<Principal, Publish>(1, Principal.equal, Principal.hash);
  var ledgerOfUserTransfers = HashMap.HashMap<Principal, List.List<UserLedger>>(1, Principal.equal, Principal.hash);
  var ledgerOfEnterprises = HashMap.HashMap<Principal, List.List<EnterprisesLedger>>(1, Principal.equal, Principal.hash);

  public shared (msg) func mint(owner : Principal, passportName : Text, passportId : Text, country : Text, sex : Text, vacName : Text, vacDate : Text, issueD : Text, image : [Nat8]) : async Principal {
    let minter : Principal = msg.caller;

    Debug.print(debug_show (Cycles.balance()));
    Cycles.add(100_500_000_000);
    let newPassport = await PassportActorClass.Passport(owner, passportName, passportId, country, sex, vacName, vacDate, issueD, image);
    Debug.print(debug_show (Cycles.balance()));

    let newLedger : Ledger = {
      minterId : minter;
      userId : owner;
      userName : passportName;
      mintingDate : issueD;
    };

    addToPassportLedger.put(minter, newLedger);

    let newPassportPrincipal = await newPassport.getCanisterId();

    mapOfPassports.put(newPassportPrincipal, newPassport);
    addToOwnershipMap(owner, newPassportPrincipal);

    return newPassportPrincipal;
  };

  private func addToOwnershipMap(owner : Principal, passportId : Principal) {
    var ownedPassports : List.List<Principal> = switch (mapOfOwners.get(owner)) {
      case null List.nil<Principal>();
      case (?result) result;
    };

    ownedPassports := List.push(passportId, ownedPassports);
    mapOfOwners.put(owner, ownedPassports);
  };

  private func addToPassportLedger(minter : Principal, newLedger : Ledger) {
    var mintedPassports : List.List<Ledger> = switch (ledgerOfPassports.get(minter)) {
      case null List.nil<Ledger>();
      case (?result) result;
    };

    mintedPassports := List.push(newLedger, mintedPassports);
    ledgerOfPassports.put(minter, mintedPassports);
  };

  public query func getLedgerOfPassports(minter : Principal) : async [Ledger] {
    var mintedPassports : List.List<Ledger> = switch (ledgerOfPassports.get(minter)) {
      case null List.nil<Ledger>();
      case (?result) result;
    };

    return List.toArray(mintedPassports);
  };

  public query func getOwnedPassports(user : Principal) : async [Principal] {
    var userPassports : List.List<Principal> = switch (mapOfOwners.get(user)) {
      case null List.nil<Principal>();
      case (?result) result;
    };

    return List.toArray(userPassports);
  };

  public shared (msg) func publishPassports(id : Principal, receiverId : Principal) : async Text {
    var item : PassportActorClass.Passport = switch (mapOfPassports.get(id)) {
      case null return "Passport does not exist.";
      case (?result) result;
    };

    let owner = await item.getOwner();
    if (Principal.equal(owner, msg.caller)) {
      let newPublish : Publish = {
        passportOwner = owner;
        receiverOwner = receiverId;
      };
      mapOfPublishes.put(id, newPublish);
      return "Success";
    } else {
      return "Invalid owner.";
    };
  };

  public query func getImmunifyCanisterId() : async Principal {
    return Principal.fromActor(Backend);
  };

};
