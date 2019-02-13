/*global contract, config, it, assert*/

const Purchase = require('Embark/contracts/Purchase');

let accounts;
let buyerAddress;
let sellerAddress;
let price = 100000;
let state = {
  "CREATED": 0,
  "LOCKED": 1,
  "INACTIVE": 2
}

config({
  contracts: {
    "Purchase": {
      args: [price],
      fromIndex: 0
    }
  }
}, (_err, web3_accounts) => {
  accounts = web3_accounts
  buyerAddress = accounts[1];
  sellerAddress = accounts[0];
});

contract("Purchase", function () {
  this.timeout(0);

  it("Should deploy Purchase", async function () {
    let result = await Purchase.options.address;
    let contractState = await Purchase.state();
    assert.ok(result.length > 0);
    assert.ok(contractState == state["CREATED"])
  });

  it("Web3 accounts should be defined", async function () {
    let result = accounts[0];
    assert.ok(result.length > 0);
  });

  it("Buyer deposits funds and confirms purchase", async function () {
    let result = await Purchase.methods.confirmPurchase().send({
      from: buyerAddress,
      value: price
    })
    let contractBuyerAddress = await Purchase.buyer();
    let contractSellerAddress = await Purchase.seller();
    let contractState = await Purchase.state();

    let contractBalance = await web3.eth.getBalance(Purchase.options.address);
    assert.ok(contractBuyerAddress === buyerAddress);
    assert.ok(contractBalance == price);
    assert.ok(contractSellerAddress === sellerAddress);
    assert.ok(contractState == state["LOCKED"]);
  });

  it("Buyer confirms received", async function () {
    let result = await Purchase.methods.confirmReceived().send({
      from: buyerAddress
    })
    let contractState = await Purchase.state();

    let contractBalance = await web3.eth.getBalance(Purchase.options.address);
    assert.ok(contractBalance == 0);
    assert.ok(contractState == state["INACTIVE"]);
  });

});