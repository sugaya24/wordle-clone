import React from 'react';
import { Box, Button, HStack } from '@chakra-ui/react';
import { FiDelete } from 'react-icons/fi';
import Key from './Key';

const ROW1 = 'qwertyuiop';
const ROW2 = 'asdfghjkl';
const ROW3 = 'zxcvbnm';

type Props = {
  addLetter: (letter: string) => void;
  deleteLetter: () => void;
  checkCurrentWord: () => void;
  charStatus: Map<string, 'correct' | 'absent' | 'present' | 'empty'>;
};

const Keyboard = ({
  addLetter,
  deleteLetter,
  checkCurrentWord,
  charStatus,
}: Props) => {
  return (
    <Box>
      <HStack spacing={'1'} mb={'1'} justifyContent={'center'}>
        {ROW1.split('').map((letter, i) => {
          return (
            <Key
              key={letter}
              letter={letter}
              charStatus={charStatus}
              addLetter={addLetter}
              deleteLetter={deleteLetter}
              checkCurrentWord={checkCurrentWord}
            />
          );
        })}
      </HStack>
      <HStack spacing={'1'} mb={'1'} justifyContent={'center'}>
        {ROW2.split('').map((letter, i) => {
          return (
            <Key
              key={letter}
              letter={letter}
              charStatus={charStatus}
              addLetter={addLetter}
              deleteLetter={deleteLetter}
              checkCurrentWord={checkCurrentWord}
            />
          );
        })}
      </HStack>
      <HStack spacing={'1'} mb={'1'} justifyContent={'center'}>
        <Button
          w={'60px'}
          h={'60px'}
          color={'whitesmoke'}
          bgColor={'gray.600'}
          _hover={{ bgColor: 'gray.600' }}
          _active={{ bgColor: 'gray.600' }}
          onClick={() => checkCurrentWord()}
        >
          ENTER
        </Button>
        {ROW3.split('').map((letter, i) => {
          return (
            <Key
              key={letter}
              letter={letter}
              charStatus={charStatus}
              addLetter={addLetter}
              deleteLetter={deleteLetter}
              checkCurrentWord={checkCurrentWord}
            />
          );
        })}
        <Button
          w={'60px'}
          h={'60px'}
          color={'whitesmoke'}
          bgColor={'gray.600'}
          _hover={{ bgColor: 'gray.600' }}
          _active={{ bgColor: 'gray.600' }}
          onClick={() => deleteLetter()}
        >
          <FiDelete />
        </Button>
      </HStack>
    </Box>
  );
};

export default Keyboard;
