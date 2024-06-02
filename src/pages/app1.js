import {Button, Center, Container, LoadingOverlay, Text, Title} from "@mantine/core";
import {useState} from "react";

export default function App1() {

  const [visible, setVisible] = useState(false);
  const [doorState, setDoorState] = useState('closed');


  const openDoor = () => {
    setVisible(true);
    // Simulate an API call to open the door
    setTimeout(() => {
      setDoorState('open');
      setVisible(false);
    }, 2000);
  };

  const closeDoor = () => {
    setVisible(true);
    // Simulate an API call to close the door
    setTimeout(() => {
      setDoorState('closed');
      setVisible(false);
    }, 2000);
  };

  return (
    <Container style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Title order={1} style={{ marginBottom: '20px' }}>Smart Door Controller</Title>

      <Center style={{ marginBottom: '20px' }}>
        <Text size="lg" weight={500}>
          Current Status: <span style={{ color: doorState === 'open' ? 'green' : 'red' }}>Door is {doorState}</span>
        </Text>
      </Center>

      <Center style={{ marginBottom: '20px' }}>
        <Text align="center" style={{ maxWidth: '600px' }}>
          Use the buttons below to control the state of your smart door. The door status will be updated automatically.
        </Text>
      </Center>

      <Center style={{ marginBottom: '20px' }}>
        <Button onClick={openDoor} style={{ margin: '10px' }} size="md" color="green">
          Open Door
        </Button>

        <LoadingOverlay visible={visible} overlayBlur={2} />

        <Button onClick={closeDoor} style={{ margin: '10px' }} size="md" color="red">
          Close Door
        </Button>
      </Center>

      <Center style={{ marginBottom: '20px' }}>
        <Text align="center" style={{ maxWidth: '600px' }}>
          Ensure you have the necessary permissions to operate the door remotely. For any issues, contact support.
        </Text>
      </Center>

      <Center>
        <Text>Support: xgono@mendelu.cz</Text>
      </Center>
    </Container>
  )
}
