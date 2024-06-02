 import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from 'web3modal';
import {useEffect, useState} from "react";
import {ethers} from "ethers";
import {Button, Center, Space, Text, Textarea} from "@mantine/core";
import {abi, contractAddress} from "../config/constants";

let web3Modal;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {8995: "https://core.bloxberg.org"}
    }
  }
}

if (typeof window != 'undefined') {
  web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions,
  })
}

export default function Connect() {

  const [hasMetamask, setHasMetamask] = useState(false);
  const [signer, setSigner] = useState(undefined);
  const [isConnected, setIsConnected] = useState(false);

  const [contract, setContract] = useState(undefined);
  const [currentUserAddress, setCurrentUserAddress] = useState('');

  const [dataToChain, setDataToChain] = useState('');
  const [dataFromChain, setDataFromChain] = useState([]);


  useEffect(() => {
    checkMetamask();

    if (isConnected)
      initialize()

  })

  const checkMetamask = () => {
    if (typeof window.ethereum !== 'undefined') {
      setHasMetamask(true)
    } else {
      setHasMetamask(false)
    }
  }

  async function connect() {
    if (hasMetamask) {
      const web3ModalProvider = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(web3ModalProvider)

      const privateKey = "3a2184f5e9592babe95f05abd15a0218d53c676b97e25c3ec466aa0408df3bbc"
      const wallet = new ethers.Wallet(privateKey).connect(provider);


      // setSigner(provider.getSigner())
      setSigner(wallet)
      setIsConnected(true)
    }
  }

  async function initialize () {

    const contract = new ethers.Contract(contractAddress, abi, signer);
    const currentUserAddress = await window.ethereum.request({method: 'eth_accounts'})

    setContract(contract)
    setCurrentUserAddress(currentUserAddress)
  }

  async function openDoor() {
    if (hasMetamask && isConnected) try {
      // await contract.sendData(dataToChain, currentUserAddress[0])
      await contract.openDoor()
    } catch (e) {
      console.log(e)
    }
  }

  async function closeDoor() {
    // const response = await contract.getDataByAddress(currentUserAddress[0])
    const response = await contract.closeDoor()

    // let dataArray = []
    // response.forEach((data) => {
    //   dataArray.push({data: data[1]})
    // })
    //
    // setDataFromChain(dataArray)
  }

  return (
    <Center style={{display: "flex", justifyContent: "center", height: '100vh'}}>
      {hasMetamask ? (
        isConnected ? (

          <div><Center>

            {/*<Textarea*/}
            {/*  value={dataToChain}*/}
            {/*  onChange={(event) => setDataToChain(event.currentTarget.value)}*/}
            {/*  placeholder={"Store your data to blockchain"}*/}
            {/*  label={"Add data"}*/}
            {/*/>*/}

            <Button onClick={() => openDoor()} style={{ margin: "10px"}}>
              Open Door
            </Button>

            <div>

            </div>

            <Button onClick={() => closeDoor()} style={{ margin: "10px"}}>
              Close Door
            </Button>

          </Center>

            <Center>

              <div>
                {dataFromChain.map((data, index) => (
                  <div key={index}>
                    <Text>{data.data}</Text>
                  </div>
                ))}
              </div>
            </Center></div>



          ) : (
          <Button onClick={() => connect()}>
            Connect
          </Button>
        )
      ) : ("Download Metamask! ")}
    </Center>
  )
}
