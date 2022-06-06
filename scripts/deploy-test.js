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
await bidr.mint(address1.address, ethers.BigNumber.from("1000000000000000000000000000000"));
await idrt.mint(address1.address, ethers.BigNumber.from("1000000000000000000000000000000"));

const nidr = await ethers.getContractFactory("neIDR");
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
console.log("DEPOSITING account[0]")
console.log("--------------------------------------------------------------------------")

const bidr_100000000 = ethers.BigNumber.from("100000000000000000000000000");
// const idrt_100000000 = ethers.BigNumber.from("100000000000000000000000000");
await bidr.approve(vault.address, bidr_100000000);
console.log("BIDR approved")

await vault.deposit(bidr.address, bidr_100000000);
console.log("deposit BIDR success")
console.log("account[0] neIDR bal: " + await neidr.balanceOf(owner.address))
console.log("account[0] BIDR bal: " + await bidr.balanceOf(owner.address))
// console.log(await neidr.totalSupply());
console.log("account[0] BIDR bal in vault:" + await vault.balanceOf(owner.address, "0x5FbDB2315678afecb367f032d93F642f64180aa3")) //account, idr token address
console.log("Vault TVL: " + await vault.vaultBalance());

console.log("--------------------------------------------------------------------------")
console.log("DEPOSITING account[1]")
console.log("--------------------------------------------------------------------------")

await bidr.connect(address1).approve(vault.address, bidr_100000000);
console.log("BIDR approved")

await vault.connect(address1).deposit(bidr.address, bidr_100000000);
console.log("deposit BIDR success")
console.log("account[0] neIDR bal: " + await neidr.balanceOf(address1.address))
console.log("account[0] BIDR bal: " + await bidr.balanceOf(address1.address))
console.log("account[0] BIDR bal in vault:" + await vault.balanceOf(address1.address, "0x5FbDB2315678afecb367f032d93F642f64180aa3")) //account, idr token address
console.log("Vault TVL: " + await vault.vaultBalance());
console.log("Total Supply of neIDR: " + await neidr.totalSupply());

console.log("--------------------------------------------------------------------------")
console.log("WITHDRAWING account[0]")
console.log("--------------------------------------------------------------------------")

await neidr.approve(vault.address, ethers.BigNumber.from("100000000000000000000000000"));
console.log("neIDR approved")

await vault.withdraw("0x5FbDB2315678afecb367f032d93F642f64180aa3", ethers.BigNumber.from("1"));
console.log("withdrawed BIDR success")
console.log("account[0] BIDR bal in vault:" + await vault.balanceOf(owner.address, "0x5FbDB2315678afecb367f032d93F642f64180aa3")) //account, idr token address
console.log("Vault TVL: " + await vault.vaultBalance());
console.log("Total Supply of neIDR: " + await neidr.totalSupply());

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
