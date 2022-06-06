const { ethers } = require("hardhat");

async function main() {
[owner, address1] = await ethers.getSigners(2);

const token = await ethers.getContractFactory("Token");
bidr = await token.deploy('BIDR', 'BIDR', 18, owner.address);
idrt = await token.deploy('IDRT', 'IDRT', 18, owner.address);
console.log("bidr address: " + bidr.address);
console.log("idrt address: " + idrt.address)
await bidr.mint(owner.address, ethers.BigNumber.from("1000000000000000000000000000000"));
await idrt.mint(owner.address, ethers.BigNumber.from("1000000000000000000000000000000"));

const nidr = await ethers.getContractFactory("NeIDR");
const neidr = await nidr.deploy();
await neidr.deployed();
console.log("neIDR address: " + neidr.address);
console.log(await neidr.owner())

const nenovault = await ethers.getContractFactory("NenoVaultV1");
const vault = await nenovault.deploy("IDR", neidr.address, bidr.address)
await vault.deployed();
console.log("nenovault address: " + vault.address);

await neidr.addMinter(vault.address);
console.log("nenovault added as minter")

console.log("--------------------------------------------------------------------------")

const bidr_100000000 = ethers.BigNumber.from("100000000000000000000000000");
// const idrt_100000000 = ethers.BigNumber.from("100000000000000000000000000");
await bidr.approve(vault.address, bidr_100000000);
console.log("bidr approved")

await vault.deposit(bidr.address, bidr_100000000);
console.log("deposit bidr success")
console.log(await neidr.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"))
console.log(await bidr.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"))

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
