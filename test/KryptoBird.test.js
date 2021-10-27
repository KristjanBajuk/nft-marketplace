const {assert} = require('chai');
const {contracts_directory} = require("../truffle-config");

const KryptoBird = artifacts.require("KryptoBird");

require('chai').use(require('chai-as-promised')).should();

contract('KryptoBird', (accounts) => {
    let contract;
    before(async () => {
            contract = await KryptoBird.deployed();
        }
    )


    describe('deployment', async () => {
        it('deploys successfuly', async () => {
            const address = contract.address;
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
            assert.notEqual(address, 0x0);
        });

        it('Name matches on our contract', async () => {
            const name = await contract.name();
            assert.equal(name, 'KryptoBird');
        });
        it('Symbol matches on our contract', async () => {
            const symbol = await contract.symbol();
            assert.equal(symbol, 'KBIRDZ');
        });
    })


    describe('minting', () => {
        it('creates new token', async () => {
            const result = await contract.mint('https...1');
            const totalSupply = await contract.totalSupply();

            assert.equal(totalSupply, 1);
            const event = result.logs[0].args;
            assert.equal(event._from, '0x0000000000000000000000000000000000000000', 'from is out contract');
            assert.equal(event._to, accounts[0], 'to is msg.sender');
            

            await contract.mint('https...1').should.be.rejected;
        });
    });
    
    
    describe('indexing', async()=>{
        it('lists KryptoBirdz', async () => {
            await contract.mint('https...2');
            await contract.mint('https...3');
            await contract.mint('https...4');

            const totalSupply = await contract.totalSupply();

            let result = [];
            let KryptoBird;
            for (let i=1; i<= totalSupply; i++)  {
                KryptoBird = await contract.kryptoBirdz(i-1);
                result.push(KryptoBird);
            }
            const expected = ['https...1', 'https...2', 'https...3', 'https...4']
            assert.equal(result.join(','), expected.join(','));
        });
        
       
    })
})