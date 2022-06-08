const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("accessControls & Deployment", function () {

    let token;
    let bidr;
    let idrt;
    let xidr;
    let owner;
    let vaultMinter;
    let neidr

    let user1;
    let user2;
    let user3;

    it("deploy idr tokens", async function () {
        [owner, user1, user2, user3] = await ethers.getSigners(4);
        token = await ethers.getContractFactory("Token");
        bidr = await token.deploy('BIDR', 'BIDR', 18, owner.address);
        await bidr.mint(user1.address, ethers.BigNumber.from("1000000000000000000000000000000"));
        await bidr.mint(user2.address, ethers.BigNumber.from("1000000000000000000000000000000"));
        await bidr.mint(user3.address, ethers.BigNumber.from("1000000000000000000000000000000"));
        idrt = await token.deploy('IDRT', 'IDRT', 18, owner.address);
        await idrt.mint(user1.address, ethers.BigNumber.from("1000000000000000000000000000000"));
        await idrt.mint(user2.address, ethers.BigNumber.from("1000000000000000000000000000000"));
        await idrt.mint(user3.address, ethers.BigNumber.from("1000000000000000000000000000000"));
        xidr = await token.deploy('XIDR', 'XIDR', 18, owner.address);
        await xidr.mint(user1.address, ethers.BigNumber.from("1000000000000000000000000000000"));
        await xidr.mint(user2.address, ethers.BigNumber.from("1000000000000000000000000000000"));
        await xidr.mint(user3.address, ethers.BigNumber.from("1000000000000000000000000000000"));

    
        await bidr.deployed();
        await idrt.deployed();
        await xidr.deployed();
    });
    
    it("confirm bidr deployment", async function () {
        expect(await bidr.name()).to.equal("BIDR");
    });
    
    it("confirm idrt deployment", async function () {
        expect(await idrt.name()).to.equal("IDRT");
    });
    
    it("confirm xidr deployment", async function () {
        expect(await xidr.name()).to.equal("XIDR");
    });

    it("deploy neIDR and test total supply", async function () {
        const nidr = await ethers.getContractFactory("neIDR");
        neidr = await nidr.deploy();
        await neidr.deployed();

        expect(await neidr.totalSupply()).to.equal(0);
    });

    it("deploy NenoVault allowing bidr and test total vault balance", async function () {
        const nenovault = await ethers.getContractFactory("NenoVaultV01");
        vaultMinter = await nenovault.deploy("IDR", neidr.address, bidr.address)
        await vaultMinter.deployed();

        expect(await vaultMinter.vaultBalance()).to.equal(0);
    });

    it("confirm NenoVault name is only for IDR", async function () {
        expect(await vaultMinter.vaultName()).to.equal("IDR")
    });

    it("add BIDR again as allowed deposit from owner", async function () {
        await expect(vaultMinter.addAllowableToken(bidr.address)).to.be.reverted
    });

    it("set NenoVault as neIDR minter", async function () {
        await neidr.addMinter(vaultMinter.address);
        expect(await neidr.isMinter(vaultMinter.address)).to.equal(true);
    });

    it("confirm NenoVault exclusively mints neIDR", async function () {
        expect(await vaultMinter.neTokenSymbol()).to.equal("neIDR")
    });

    it("confirm owner is neIDR owner", async function () {
        expect(await neidr.owner()).to.equal(owner.address);
    });

    it("confirm owner can't mint neIDR", async function () {
        await expect(neidr.mint(owner.address, 10000)).to.be.reverted
    });

    it("confirm other users can't mint neIDR", async function () {
        await expect(neidr.connect(user1).mint(owner.address, 10000)).to.be.reverted
    });

    it("confirm BIDR is allowed as deposit", async function () {
        expect(await vaultMinter.isAllowed(bidr.address)).to.equal(true);
    });

    it("add IDRT as allowed deposit from not owner", async function () {
        await expect(vaultMinter.connect(user1).addAllowableToken(idrt.address)).to.be.reverted
    });

    it("add IDRT as allowed deposit from owner", async function () {
        await vaultMinter.addAllowableToken(idrt.address)
    });

    it("confirm IDRT is allowed as deposit", async function () {
        expect(await vaultMinter.isAllowed(bidr.address)).to.equal(true);
    });

});
