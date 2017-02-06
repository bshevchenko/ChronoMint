var Reverter = require('./helpers/reverter');
var bytes32 = require('./helpers/bytes32');
contract('ChronoMint', function(accounts) {
  var owner = accounts[0];
  var owner1 = accounts[1];
  var owner2 = accounts[2];
  var owner3 = accounts[3];
  var owner4 = accounts[4];
  var owner5 = accounts[5];
  var nonOwner = accounts[6];
  var locController1 = accounts[7];
  var locController2 = accounts[7];
  var chronoMint;
  var conf_sign;
  var conf_sign2;
  var loc_contracts = [];
  var labor_hour_token_contracts = [];
  var Status = {maintenance:0,active:1, suspended:2, bankrupt:3};

  const SYMBOL = 'TIME';
  const SYMBOL2 = 'LHT';
  const NAME = 'Time Token';
  const DESCRIPTION = 'ChronoBank Time Shares';
  const NAME2 = 'Labour-hour Token';
  const DESCRIPTION2 = 'ChronoBank Lht Assets';
  const BASE_UNIT = 2;
  const IS_REISSUABLE = true;
  const IS_NOT_REISSUABLE = false;

  before('setup', function(done) {
      ChronoMint.next_gen = true;
      chronoMint = ChronoMint.deployed();
      rewardsContract = Rewards.deployed();
      platform = ChronoBankPlatform.deployed();
      timeContract = ChronoBankAsset.deployed();
      lhContract = ChronoBankAssetWithFee.deployed();
      timeProxyContract = ChronoBankAssetProxy.deployed(); 
      lhProxyContract = ChronoBankAssetWithFeeProxy.deployed();
      done();

    });

  context("with one CBE key", function(){
 
    it("TIME proxy has right platform address.", function() {
        return timeProxyContract.chronoBankPlatform.call().then(function(r) {
          assert.equal(r,platform.address);
        });
    });

   it("LHT proxy has right platform address.", function() {
        return lhProxyContract.chronoBankPlatform.call().then(function(r) {
          assert.equal(r,platform.address);
        });
    });

    it("Platform has correct TIME proxy address.", function() {
       return platform.proxies.call(SYMBOL).then(function(r) {
          assert.equal(r,timeProxyContract.address);
        });
    });

   it("Platform has correct LHT proxy address.", function() {
       return platform.proxies.call(SYMBOL2).then(function(r) {
          assert.equal(r,lhProxyContract.address);
        });
    });


    it("TIME contract has correct TIME proxy address.", function() {
       return timeContract.proxy.call().then(function(r) {
          assert.equal(r,timeProxyContract.address);
        });
    });

   it("LHT contract has correct LHT proxy address.", function() {
       return lhContract.proxy.call().then(function(r) {
          assert.equal(r,lhProxyContract.address);
        });
    });
 
   it("TIME proxy has right version", function() {
       return timeProxyContract.getLatestVersion.call().then(function(r) {
          assert.equal(r,timeContract.address);
        });
    });

   it("LHT proxy has right version", function() {
       return lhProxyContract.getLatestVersion.call().then(function(r) {
          assert.equal(r,lhContract.address);
        });
    });

    it("shows owner as a CBE key.", function() {
        return chronoMint.isAuthorized.call(owner).then(function(r) {
          assert.isOk(r);
        });
    });

    it("doesn't show owner1 as a CBE key.", function() {
      return chronoMint.isAuthorized.call(owner1).then(function(r) {
        assert.isNotOk(r);
      });
    });

    it("ChronoMint can provide TimeProxyContract address.", function() {
      return chronoMint.getAddress.call(8).then(function(r) {
        assert.equal(r,timeProxyContract.address);
     });
    });

    it("allows a CBE key to set the contract address", function() {
      return chronoMint.setAddress(99,"0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703b").then(function() {
          return chronoMint.getAddress.call(99).then(function(r){
            assert.equal(r, '0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703b');
          });
      });
    });

    it("doesn't allow a non CBE key to set the contract address", function() {
      return chronoMint.setAddress(99,"0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703a", {from: nonOwner}).then(function() {
          return chronoMint.getAddress.call(99).then(function(r){
            assert.notEqual(r, '0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703a');
          });
      });
    });

 it("allows a CBE to propose an LOC.", function() {
            return chronoMint.proposeLOC("Bob's Hard Workers", "www.ru", 1000, "QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB",1484554656).then(function(r){
                loc_contracts[0] = LOC.at(r.logs[0].args._LOC);
                return loc_contracts[0].status.call().then(function(r){
                   assert.equal(r, Status.maintenance);
                });
        });
    });

 it("Proposed LOC should increment LOCs counter", function() {
            return chronoMint.getLOCCount.call().then(function(r){
                   assert.equal(r, 1);
        });
    });

   it("allows CBE member to remove LOC", function() {
   return chronoMint.removeLOC.call(loc_contracts[0].address).then(function(r) {
      return chronoMint.removeLOC(loc_contracts[0].address).then(function() {
        assert.isOk(r);
      });
     });
    });

 it("Removed LOC should increment LOCs counter", function() {
            return chronoMint.getLOCCount.call().then(function(r){
                   assert.equal(r, 0);
        });
    });

    it("allows one CBE key to add another CBE key.", function() {
      return chronoMint.addKey(owner1).then(function(r) {
            return chronoMint.isAuthorized.call(owner1).then(function(r){
              assert.isOk(r);
          });
      });
    });
  });

  context("with two CBE keys", function(){
    it("shows owner as a CBE key.", function() {
        return chronoMint.isAuthorized.call(owner).then(function(r) {
          assert.isOk(r);
        });
    });

    it("shows owner1 as a CBE key.", function() {
        return chronoMint.isAuthorized.call(owner1).then(function(r) {
          assert.isOk(r);
        });
    });

    it("doesn't show owner2 as a CBE key.", function() {
      return chronoMint.isAuthorized.call(owner2).then(function(r) {
        assert.isNotOk(r);
      });
    });

    it("allows one CBE key to add another CBE key.", function() {
      return chronoMint.addKey(owner2, {from:owner}).then(function(r) {
       return chronoMint.confirm(r.logs[0].args.operation,{from:owner1}).then(function(r) {
          return chronoMint.isAuthorized.call(owner2).then(function(r){
            assert.isOk(r);
          });
       });
      });
    });
  });

  context("with three CBE keys", function(){

    it("allows second vote for the new key to grant authorization.", function() {
     return chronoMint.setRequired(3).then(function(r) {
      return chronoMint.addKey(owner3, {from: owner2}).then(function(r) {
          chronoMint.confirm(r.logs[0].args.operation,{from:owner});
          chronoMint.confirm(r.logs[0].args.operation,{from:owner1});
          return chronoMint.isAuthorized.call(owner3).then(function(r){
            assert.isOk(r);
          });
      });
     });
    });

  });

  context("with four CBE keys", function(){

  it("allows second vote for the new key to grant authorization.", function() {
     return chronoMint.setRequired(4).then(function(r) {
      return chronoMint.addKey(owner4, {from: owner3}).then(function(r) {
          chronoMint.confirm(r.logs[0].args.operation,{from:owner});
          chronoMint.confirm(r.logs[0].args.operation,{from:owner1});
          chronoMint.confirm(r.logs[0].args.operation,{from:owner2});
          return chronoMint.isAuthorized.call(owner3).then(function(r){
            assert.isOk(r);
          });
      });
     });
    });

  });

  context("with five CBE keys", function(){
    it("collects 4 vote to addKey and granting auth.", function() {
    return chronoMint.setRequired(5).then(function(r) {
      return chronoMint.addKey(owner5, {from: owner4}).then(function(r) {
          chronoMint.confirm(r.logs[0].args.operation,{from:owner});
          chronoMint.confirm(r.logs[0].args.operation,{from:owner1});
          chronoMint.confirm(r.logs[0].args.operation,{from:owner2});
          chronoMint.confirm(r.logs[0].args.operation,{from:owner3});
            return chronoMint.isAuthorized.call(owner5).then(function(r){
              assert.isOk(r);
            });
        });
      });
    });

    it("collects 1 call and 1 vote for setAddress as 2 votes for a new address", function() {
      return chronoMint.setAddress(99,"0x19789eeec7aac794b49f370783623a421df3f177",{from:owner}).then(function(r) {
          conf_sign = r.logs[0].args.operation;
          return chronoMint.getAddress.call(99).then(function(r){
            assert.notEqual(r, '0x19789eeec7aac794b49f370783623a421df3f177');
            return chronoMint.confirm(conf_sign, {from:owner1}).then(function() {
                return chronoMint.getAddress.call(99).then(function(r){
                  assert.notEqual(r, '0x19789eeec7aac794b49f370783623a421df3f177');
                });
            });
          });
      });
    });
  
  it("check confirmation yet needed should be 3", function() {
      return chronoMint.pendingYetNeeded.call(conf_sign).then(function(r) {
      assert.equal(r,3);
   });
  });

  it("check owner1 hasConfirmed new addrees", function() {
    return chronoMint.hasConfirmed.call(conf_sign, owner1).then(function(r) {
     assert.isOk(r);
   });      
  });

  it("revoke owner1 and check not hasConfirmed new addrees", function() {
    return chronoMint.revoke(conf_sign,{from:owner1}).then(function() {
      return chronoMint.hasConfirmed.call(conf_sign, owner1).then(function(r) {
         assert.isNotOk(r);
      });
    });
  });

  it("check confirmation yet needed should be 4", function() {
      return chronoMint.pendingYetNeeded.call(conf_sign).then(function(r) {
      assert.equal(r,4);
   });
  });

    it("allows owner1 and 3 more votes to set new address.", function() {
      return chronoMint.confirm(conf_sign, {from: owner1}).then(function() {
        chronoMint.confirm(conf_sign, {from: owner2});
        chronoMint.confirm(conf_sign, {from: owner3});
        chronoMint.confirm(conf_sign, {from: owner4});
        return chronoMint.getAddress.call(99).then(function(r){
          assert.equal(r, '0x19789eeec7aac794b49f370783623a421df3f177');
        });
      });
    });

    it("allows a CBE to propose an LOC.", function() {
            return chronoMint.proposeLOC("Bob's Hard Workers", "www.ru", 1000, "QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB",1484554656).then(function(r){
                loc_contracts[0] = LOC.at(r.logs[0].args._LOC);
                return loc_contracts[0].status.call().then(function(r){
                   assert.equal(r, Status.maintenance);
                });
        });
    });

   it("Proposed LOC should increment LOCs counter", function() {
            return chronoMint.getLOCCount.call().then(function(r){
                   assert.equal(r, 1);
        });
    });

   it("ChronoMint should be able to return LOCs array with proposed LOC address", function() {
            return chronoMint.getLOCs.call().then(function(r){
                   assert.equal(r[0], loc_contracts[0].address);
        });
    });
   

    it("allows 5 CBE members to activate an LOC.", function() {
      return chronoMint.setLOCStatus(loc_contracts[0].address, Status.active, {from: owner}).then(function(r) {
        chronoMint.confirm(r.logs[0].args.operation,{from:owner1});
        chronoMint.confirm(r.logs[0].args.operation,{from:owner2});
        chronoMint.confirm(r.logs[0].args.operation,{from:owner3});
        chronoMint.confirm(r.logs[0].args.operation,{from:owner4}); 
        return loc_contracts[0].status.call().then(function(r){
          assert.equal(r, Status.active);
        });
      });
    });

    it("collects call to setValue and first vote for a new value ", function() {
      return chronoMint.setLOCValue(loc_contracts[0].address,12,22).then(function(r) {
          conf_sign = r.logs[0].args.operation;
          return loc_contracts[0].getValue.call(12).then(function(r){
            assert.notEqual(r, 22);
            return chronoMint.confirm(conf_sign, {from: owner1}).then(function() {
                return loc_contracts[0].getValue.call(12).then(function(r){
                  assert.notEqual(r, 22);
                });
            });
          });
      });
    });
   
   it("check operation type is editLOC", function() {
      return chronoMint.getTxsType.call(conf_sign).then(function(r) {
         assert.equal(r,1);
   });
   });

   it("should increment pending operation counter ", function() {
            return chronoMint.pendingsCount.call({from: owner}).then(function(r) {
                  assert.equal(r, 1);
            });
    });

    it("allows a CBE to propose revocation of an authorized key.", function() {
      return chronoMint.revokeKey(owner5, {from:owner}).then(function(r) {
        conf_sign2 = r.logs[0].args.operation;
        return chronoMint.isAuthorized.call(owner5).then(function(r){
          assert.isOk(r);
        });
      });
    });

   it("should increment pending operation counter ", function() {
            return chronoMint.pendingsCount.call({from: owner}).then(function(r) {
                  assert.equal(r, 2);
            });
    });

    it("allows a 3 more votes to set new value.", function() {
      return chronoMint.confirm(conf_sign, {from: owner2}).then(function() {
        chronoMint.confirm(conf_sign, {from: owner3});
        chronoMint.confirm(conf_sign, {from: owner4});
        return loc_contracts[0].getValue.call(12).then(function(r){
          assert.equal(r, 22);
        });
      });
    });

   it("should decrement pending operation counter ", function() {
            return chronoMint.pendingsCount.call({from: owner}).then(function(r) {
                  assert.equal(r, 1);
            });
    });

    it("doesn't allow non CBE to change settings for the contract.", function() {
      return loc_contracts[0].setValue(3, 2000).then(function() {
        return loc_contracts[0].getValue.call(3).then(function(r){
          assert.equal(r, '1000');
        });
      });
    });

    it("allows CBE controller to change the name of the LOC", function() {
      return chronoMint.setLOCString(loc_contracts[0].address,0,"Tom's Hard Workers").then(function() {
        return loc_contracts[0].getName.call().then(function(r){
          assert.equal(r, "Tom's Hard Workers");
        });
      });
    });

    it("allows 4 CBE member vote for the revocation to revoke authorization.", function() {
      return chronoMint.confirm(conf_sign2,{from:owner}).then(function(r) {
	chronoMint.confirm(conf_sign2,{from:owner1});
        chronoMint.confirm(conf_sign2,{from:owner2});
        chronoMint.confirm(conf_sign2,{from:owner3});
        chronoMint.confirm(conf_sign2,{from:owner4});
          return chronoMint.isAuthorized.call(owner5).then(function(r){
            assert.isNotOk(r);
          });
      });
    });

   it("should decrement pending operation counter ", function() {
            return chronoMint.pendingsCount.call({from: owner}).then(function(r) {
                  assert.equal(r, 0);
            });
    });

   it("should show 10000 TIME balance", function() {
            return chronoMint.getBalance.call(8).then(function(r) {
                  assert.equal(r, 10000);
            });
    });

   it("should not be abble to reIssue 5000 more TIME", function() {
           return chronoMint.reissueAsset.call(SYMBOL, 5000, {from: accounts[0]}).then((r) => {
            return chronoMint.reissueAsset(SYMBOL, 5000, {from: accounts[0]}).then(() => {
                  assert.isNotOk(r);
            });
     });
    });

   it("should show 10000 TIME balance", function() {
            return chronoMint.getBalance.call(8).then(function(r) {
                  assert.equal(r, 10000);
            });
    });

  it("ChronoMint should be able to send 100 TIME to owner", function() {
            return chronoMint.send.call(8,owner,100).then(function(r) {
               return chronoMint.send(8,owner,100,{from: accounts[0], gas: 3000000}).then(function() {
                  assert.isOk(r);
            });
    });
  });

   it("check Owner has 100 TIME", function() {
     return timeProxyContract.balanceOf.call(owner).then(function(r) {
      assert.equal(r,100);
    });
   });

   it("owner should be able to approve 50 TIME to Reward", function() {
           return timeProxyContract.approve.call(rewardsContract.address, 50, {from: accounts[0]}).then((r) => {
            return timeProxyContract.approve(rewardsContract.address, 50, {from: accounts[0]}).then(() => {
                  assert.isOk(r);
            });
     });
    });

   it("should show 0 LHT balance", function() {
            return chronoMint.getBalance.call(16).then(function(r) {
                  assert.equal(r, 0);
            });
    });

    it("should be abble to reIssue 5000 more LHT", function() {
          return chronoMint.reissueAsset.call(SYMBOL2, 5000, {from: accounts[0]}).then((r) => {
            return chronoMint.reissueAsset(SYMBOL2, 5000, {from: accounts[0]}).then(() => {
                  assert.isOk(r);
            });
     });
    });           

   it("should show 5000 LHT balance", function() {
            return chronoMint.getBalance.call(16).then(function(r) {
                  assert.equal(r, 5000);
            });   
    });     

   it("ChronoMint should be able to send 50 LHT to owner", function() {
            return chronoMint.send.call(16,owner,50).then(function(r) {
               return chronoMint.send(16,owner,50,{from: accounts[0], gas: 3000000}).then(function() {
                  assert.isOk(r);
            });
    });
  });

   it("check Owner has 50 LHT", function() {
     return lhProxyContract.balanceOf.call(owner).then(function(r) {
      assert.equal(r,50);
    });
   });
 });
});