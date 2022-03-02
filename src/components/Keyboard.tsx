import React from 'react';
import { Box, Button, HStack } from '@chakra-ui/react';
import { FiDelete } from 'react-icons/fi';

const ROW1 = 'qwertyuiop';
const ROW2 = 'asdfghjkl';
const ROW3 = 'zxcvbnm';

type Props = {
  addLetter: (letter: string) => void;
  deleteLetter: () => void;
  checkCurrentWord: () => void;
};

const Keyboard = ({ addLetter, deleteLetter, checkCurrentWord }: Props) => {
  return (
    <Box>
      <HStack spacing={'1'} mb={'1'} justifyContent={'center'}>
        {ROW1.split('').map((letter, i) => {
          return (
            <Button
              key={letter}
              w={'40px'}
              h={'60px'}
              color={'ButtonText'}
              bgColor={'gray.400'}
              _hover={{ bgColor: 'gray.400' }}
              _active={{ bgColor: 'gray.400' }}
              onClick={() => addLetter(letter)}
            >
              {letter}
            </Button>
          );
        })}
      </HStack>
      <HStack spacing={'1'} mb={'1'} justifyContent={'center'}>
        {ROW2.split('').map((letter, i) => {
          return (
            <Button
              key={letter}
              w={'40px'}
              h={'60px'}
              color={'ButtonText'}
              bgColor={'gray.400'}
              _hover={{ bgColor: 'gray.400' }}
              _active={{ bgColor: 'gray.400' }}
              onClick={() => addLetter(letter)}
            >
              {letter}
            </Button>
          );
        })}
      </HStack>
      <HStack spacing={'1'} mb={'1'} justifyContent={'center'}>
        <Button
          w={'60px'}
          h={'60px'}
          color={'ButtonText'}
          bgColor={'gray.400'}
          _hover={{ bgColor: 'gray.400' }}
          _active={{ bgColor: 'gray.400' }}
          onClick={() => checkCurrentWord()}
        >
          Enter
        </Button>
        {ROW3.split('').map((letter, i) => {
          return (
            <Button
              key={letter}
              w={'40px'}
              h={'60px'}
              color={'ButtonText'}
              bgColor={'gray.400'}
              _hover={{ bgColor: 'gray.400' }}
              _active={{ bgColor: 'gray.400' }}
              onClick={() => addLetter(letter)}
            >
              {letter}
            </Button>
          );
        })}
        <Button
          w={'60px'}
          h={'60px'}
          color={'ButtonText'}
          bgColor={'gray.400'}
          _hover={{ bgColor: 'gray.400' }}
          _active={{ bgColor: 'gray.400' }}
          onClick={() => deleteLetter()}
        >
          <FiDelete />
        </Button>
      </HStack>
    </Box>
  );
};

export default Keyboard;
