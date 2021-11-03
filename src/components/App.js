import React from 'react';
import Web3 from 'web3';
import detectEthereumProvider from "@metamask/detect-provider"

import KryptoBird from "../abis/KryptoBird.json";
import {MDBCard, MDBCardBody, MDBCardText, MDBCardTitle, MDBCardImage, MDBBtn} from 'mdb-react-ui-kit';
import './App.css';

const App = () => {
    const [account, setAccount] = React.useState(null);
    const [contract, setContract] = React.useState(null);
    const [totalSupply, setTotalSupply] = React.useState(0);
    const [kryptoBirds, setKryptoBirds] = React.useState([]);
    const inputRef = React.useRef();

    const loadWeb3 = async () => {
        const provider = await detectEthereumProvider();
        if(provider) {
            console.log('Ethereum wallet is connected');
            window.web3 = new Web3(provider);
        } else {
            console.log('No Ethereum wallet connected')
        }
    };

    const loadBlockchainData = async () => {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const networkData = KryptoBird.networks[networkId];
        if(networkData) {
            const abi = KryptoBird.abi;
            const address = networkData.address;
    
            const contractData = new web3.eth.Contract(abi, address);
         
            setContract(contractData);
            
            const totalSupply = await contractData.methods.totalSupply().call();
            setTotalSupply(parseInt(totalSupply));
    
            for (let i=1; i<=parseInt(totalSupply); i++) {
                const kryptoBird = await contractData.methods.kryptoBirdz(i-1).call();
                setKryptoBirds(prevValue => [...prevValue, kryptoBird]);
            }

        } else {
            window.alert('Smart contract not deployed');
        }
    }

    const mint =  (kryptoBird) => {
      contract.methods.mint(kryptoBird).send({from: account}).once('confirmation', receipt => {
            setKryptoBirds(prevValue => [...prevValue, kryptoBird]);
            inputRef.current.value = '';
        });
    }

    React.useEffect(async() => {
         await loadWeb3();
         await loadBlockchainData();
    }, []);


    return <div className='container-filled'>
        <nav className='navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shawdow'>
            <div className='navbar-brand col-sm-3 col-md-3 mr-0' style={{color: 'white'}}>
                Krypto Birdz NFTs (Non Fungible Tokens)
            </div>
            <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                    <small className="text-white">
                        {account}
                    </small>
                </li>
            </ul>
        </nav>

        <div className="container-fluid mt-1">
            <div className="row">
                <main role='main' className='col-lg-12 d-flex text-center'>
                    <div className='content mr-auto ml-auto' style={{opacity: 0.8}}>
                        <h1 style={{color: 'black'}}>KryptoBirdz - NFT Marketplace</h1>
                        <form onSubmit={event=>{
                            event.preventDefault();
                            mint(inputRef.current.value);
                        }}>
                            <input type='text' ref={inputRef} placeholder='Add a file location' className='form-control mb-1' />
                            <input type='submit' value='MINT' className='btn btn-primary btn-black' />
                        </form>
                    </div>
                </main>
            </div>
            <hr></hr>
            <div className='row textCenter'>
                {kryptoBirds.map((kryptoBird, key)=>
                    <div key={key}>
                        <div>
                            <MDBCard className='token img' style={{maxWidth: '22rem'}}>
                            <MDBCardImage src={kryptoBird} position='top' height={'250rem'} style={{marginRight: '4px'}} />
                            <MDBCardBody>
                                <MDBCardTitle>Krypto Bird</MDBCardTitle>
                                <MDBCardText>The KryptoBirdz are 20 uniquely generated K-birds from the  cyberpunk cloud galaxy Mystopia! There is only one of each bird and each bird can be owned by a single person on Ethereum blockchain.</MDBCardText>
                                <MDBBtn style={{color: 'white'}} href={kryptoBird}>Download</MDBBtn>
                            </MDBCardBody>
                            </MDBCard>
                        </div>
                    </div>
                    )}
            </div>
        </div>
       
    </div>
};

export default App;