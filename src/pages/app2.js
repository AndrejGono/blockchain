import {Anchor, Button, Center, Container, LoadingOverlay, Text, Title} from "@mantine/core";
import {useEffect, useState} from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import {ethers} from "ethers";
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

export default function App2() {

  const [visible, setVisible] = useState(false);
  const [doorState, setDoorState] = useState('closed');

  const [hasMetamask, setHasMetamask] = useState(false);
  const [signer, setSigner] = useState(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setContract] = useState(undefined);
  const [currentUserAddress, setCurrentUserAddress] = useState('');

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

      // const privateKey = "3a2184f5e9592babe95f05abd15a0218d53c676b97e25c3ec466aa0408df3bbc"
      // const wallet = new ethers.Wallet(privateKey).connect(provider);
      // setSigner(wallet)

      setSigner(provider.getSigner())
      setIsConnected(true)
    }
  }

  async function initialize() {

    const contract = new ethers.Contract(contractAddress, abi, signer);
    const currentUserAddress = await window.ethereum.request({method: 'eth_accounts'})

    setContract(contract)
    setCurrentUserAddress(currentUserAddress)
  }

  const openDoor = async () => {
    setVisible(true);

    if (hasMetamask && isConnected) try {
      // await contract.sendData(dataToChain, currentUserAddress[0])
      await contract.openDoor()
      setDoorState('open');
    } catch (e) {
      console.log(e)
    }


    setVisible(false);
  };;

  const closeDoor = () => {
    setVisible(true);
    // Simulate an API call to close the door
    setTimeout(() => {
      setDoorState('closed');
      setVisible(false);
    }, 2000);
  };

  return (
    <Container style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Title order={1} style={{marginBottom: '20px'}}>Smart Door Controller</Title>

      {hasMetamask ? (
        isConnected ? (

          <div>
            <Center style={{marginBottom: '20px'}}>
              <Text size="lg" weight={500}>
                Current Status: <span style={{color: doorState === 'open' ? 'green' : 'red'}}>Door is {doorState}</span>
              </Text>
            </Center>

            <Center style={{marginBottom: '20px'}}>
              <Text align="center" style={{maxWidth: '600px'}}>
                Use the buttons below to control the state of your smart door. The door status will be updated
                automatically.
              </Text>
            </Center>

            <Center style={{marginBottom: '20px'}}>
              <Button onClick={openDoor} style={{margin: '10px'}} size="md" color="green">
                Open Door
              </Button>

              <LoadingOverlay visible={visible} overlayBlur={2}/>

              <Button onClick={closeDoor} style={{margin: '10px'}} size="md" color="red">
                Close Door
              </Button>
            </Center>

            <Center style={{marginBottom: '20px'}}>
              <Text align="center" style={{maxWidth: '600px'}}>
                Ensure you have the necessary permissions to operate the door remotely. For any issues, contact support.
              </Text>
            </Center>
          </div>

        ) : (
          <Button style={{marginBottom: '20px'}} onClick={() => connect()}>
            Connect
          </Button>
        )
      ) : (
        <Text style={{marginBottom: '20px', color: 'red'}}>
          To use your own wallet you have to install&nbsp;
          <Anchor underline={true} style={{marginBottom: '20px', color: 'red'}} href="https://metamask.io/download/"
                  target="_blank">
            Metamask</Anchor>,&nbsp;as an extension to your browser!
        </Text>


      )}

      <Center>
        <Text>Support: xgono@mendelu.cz</Text>
      </Center>
    </Container>
  )
}
