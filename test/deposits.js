// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("deposits", function () {

//     let token;
//     let bidr;
//     let idrt;
//     let xidr;
//     let owner;
//     let vaultMinter;
//     let neidr

//     let user1;
//     let user2;
//     let user3;

//     it("deploy idr tokens", async function () {
//         [owner, user1, user2, user3] = await ethers.getSigners(4);
//         token = await ethers.getContractFactory("Token");
//         bidr = await token.deploy('BIDR', 'BIDR', 18, owner.address);
//         await bidr.mint(user1.address, ethers.BigNumber.from("1000000000000000000000000000000"));
//         await bidr.mint(user2.address, ethers.BigNumber.from("1000000000000000000000000000000"));
//         await bidr.mint(user3.address, ethers.BigNumber.from("1000000000000000000000000000000"));
//         idrt = await token.deploy('IDRT', 'IDRT', 18, owner.address);
//         await idrt.mint(user1.address, ethers.BigNumber.from("1000000000000000000000000000000"));
//         await idrt.mint(user2.address, ethers.BigNumber.from("1000000000000000000000000000000"));
//         await idrt.mint(user3.address, ethers.BigNumber.from("1000000000000000000000000000000"));
//         xidr = await token.deploy('XIDR', 'XIDR', 18, owner.address);
//         await xidr.mint(user1.address, ethers.BigNumber.from("1000000000000000000000000000000"));
//         await xidr.mint(user2.address, ethers.BigNumber.from("1000000000000000000000000000000"));
//         await xidr.mint(user3.address, ethers.BigNumber.from("1000000000000000000000000000000"));

    
//         await bidr.deployed();
//         await idrt.deployed();
//         await xidr.deployed();
//     });
    
//     it("confirm bidr deployment", async function () {
//         expect(await bidr.name()).to.equal("BIDR");
//     });
    
//     it("confirm idrt deployment", async function () {
//         expect(await idrt.name()).to.equal("IDRT");
//     });
    
//     it("confirm xidr deployment", async function () {
//         expect(await xidr.name()).to.equal("XIDR");
//     });

//     it("deploy neIDR and test total supply", async function () {
//         const nidr = await ethers.getContractFactory("neIDR");
//         neidr = await nidr.deploy();
//         await neidr.deployed();

//         expect(await neidr.totalSupply()).to.equal(0);
//     });

//     it("deploy NenoVault allowing bidr and test total vault balance", async function () {
//         const nenovault = await ethers.getContractFactory("NenoVaultV01");
//         vaultMinter = await nenovault.deploy("IDR", neidr.address, bidr.address)
//         await vaultMinter.deployed();

//         expect(await vaultMinter.vaultBalance()).to.equal(0);
//     });

//     it("confirm BIDR is allowed as deposit", async function () {
//         expect(await vaultMinter.isAllowed(bidr.address)).to.equal(true);
//     });

//     it("set NenoVault as neIDR minter", async function () {
//         await neidr.addMinter(vaultMinter.address);
//         expect(await neidr.isMinter(vaultMinter.address)).to.equal(true);
//     });

//     it("user1 deposit unallowed token to NenoVault", async function () {
//         const idrt_100000000 = ethers.BigNumber.from("100000000000000000000000000");
//         await idrt.connect(user1).approve(vaultMinter.address, idrt_100000000);
//         // await vaultMinter.connect(user1).deposit(idrt.address, idrt_100000000);
//         await expect(vaultMinter.connect(user1).deposit(idrt.address, idrt_100000000)).to.be.reverted;
//     });

//     it("user1 deposit BIDR to NenoVault and test user1 balance in vault", async function () {
//         const bidr_100000000 = ethers.BigNumber.from("100000000000000000000000000");
//         await bidr.connect(user1).approve(vaultMinter.address, bidr_100000000);
//         await vaultMinter.connect(user1).deposit(bidr.address, bidr_100000000);

//         expect(await vaultMinter.balanceOf(user1.address)).to.equal(bidr_100000000);
//     });

//     it("confirm user1 balance is equal to total vault balance", async function () {
//         expect(await vaultMinter.balanceOf(user1.address)).to.equal(await vaultMinter.vaultBalance());
//     });

//     it("confirm user1 neIDR is equal to user1 deposited BIDR", async function () {
//         expect(await vaultMinter.balanceOf(user1.address)).to.equal(await neidr.balanceOf(user1.address));
//     });

//     it("confirm vault BIDR balance is equal to user1 balance", async function () {
//         expect(await vaultMinter.balanceOf(user1.address)).to.equal(await vaultMinter.tokenBalance(bidr.address));
//     }); 

//     it("confirm neIDR total supply is equal to vault total balance", async function () {
//         expect(await neidr.totalSupply()).to.equal(await vaultMinter.vaultBalance());
//     }); 

//     it("user2 deposit BIDR to NenoVault and test user2 balance in vault", async function () {
//         const bidr_20000000 = ethers.BigNumber.from("20000000000000000000000000");
//         await bidr.connect(user2).approve(vaultMinter.address, bidr_20000000);
//         await vaultMinter.connect(user2).deposit(bidr.address, bidr_20000000);

//         expect(await vaultMinter.balanceOf(user2.address)).to.equal(bidr_20000000);
//     });

//     it("confirm user2 neIDR is equal to user2 deposited BIDR", async function () {
//         expect(await vaultMinter.balanceOf(user2.address)).to.equal(await neidr.balanceOf(user2.address));
//     });

//     it("confirm vault balance is equal to neIDR total supply", async function () {
//         expect(await vaultMinter.vaultBalance()).to.equal(await neidr.totalSupply())
//     });

//     it("confirm BIDR balance in NenoVault equals to minted neIDR", async function () {
//         const u1 = await vaultMinter.balanceOf(user1.address)
//         const u2 = await vaultMinter.balanceOf(user2.address)
//         const total = u1.add(u2)
//         expect(await vaultMinter.tokenBalance(bidr.address)).to.equal(total)
//     });

//     it("user1 deposit unallowed token to NenoVault", async function () {
//         const idrt_20000000 = ethers.BigNumber.from("20000000000000000000000000");
//         await idrt.connect(user1).approve(vaultMinter.address, idrt_20000000);
//         await expect(vaultMinter.connect(user1).deposit(idrt.address, idrt_20000000)).to.be.reverted;
//     });

//     it("add IDRT as allowed deposit from owner", async function () {
//         await vaultMinter.addAllowableToken(idrt.address)
//     });

//     it("user1 deposits IDRT and test user1 balance", async function () {
//         const idrt_20000000 = ethers.BigNumber.from("20000000000000000000000000");
//         await idrt.connect(user1).approve(vaultMinter.address, idrt_20000000);
//         await vaultMinter.connect(user1).deposit(idrt.address, idrt_20000000);

//         expect(await vaultMinter.balanceOf(user1.address)).to.equal(await neidr.balanceOf(user1.address));
//     });

//     it("confirm user1 vault balance is equal to user1 minted neIDR", async function () {
//         // console.log(await vaultMinter.balanceOf(user1.address))
//         console.log(await neidr.balanceOf(user1.address))
//         // const neidr_2000000000 = ethers.BigNumber.from("2000000000000000000000000000");
//         // await neidr.connect(user1).approve(vaultMinter.address, neidr_2000000000);
//         // await vaultMinter.connect(user1).withdraw(idrt.address, neidr_2000000000);

//     });

// // ------------------------------------------------------------------------------------------------------------------------------
//     // WITHDRAW
// // ------------------------------------------------------------------------------------------------------------------------------





//     // it("user1 withdraws IDRT & BIDR more than user1 puts into the vault", async function () {
//     //     console.log(await vaultMinter.balanceOf(user1.address))
//     //     console.log(user1)
//     //     const neidr_2000000000 = ethers.BigNumber.from("2000000000000000000000000000");
//     //     await neidr.connect(user1).approve(vaultMinter.address, neidr_2000000000);
//     //     await vaultMinter.connect(user1).withdraw(idrt.address, neidr_2000000000);

//     // });
// });