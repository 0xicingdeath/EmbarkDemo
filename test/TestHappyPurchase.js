/*global contract, config, it, assert*/

const Storage = require('Embark/contracts/Storage');

let accounts;
let price = 100000;

config({
  contracts: {
    "Storage": {
      args: [price],
      fromIndex: 0
    }
  }
}, (_err, web3_accounts) => {
  accounts = web3_accounts
  buyerAddress = accounts[1];
  sellerAddress = accounts[0];
});

contract("Storage", function () {
  this.timeout(0);

  it("Should deploy Storage", async function () {
    let result = await Storage.options.address;
    assert.ok(result.length > 0);
  });

});