import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import Cell from './Cell';

type Props = {
  i: number;
  currentWord: string;
  row: {
    wordState: {
      state: 'correct' | 'absent' | 'present' | 'input' | 'empty';
      letter: string;
    }[];
  };
  rowCount: number;
};

const Row = ({ i, row, currentWord, rowCount }: Props) => {
  const [splitCurrentWord, setSplitCurrentWord] = useState<string[]>(
    currentWord.split('')
  );
  useEffect(() => {
    setSplitCurrentWord(currentWord.split(''));
  }, [currentWord]);

  return (
    <Box
      key={i}
      w={'340px'}
      mx={'auto'}
      display={'grid'}
      gap={'10px'}
      gridTemplateColumns={'repeat(5, 1fr)'}
      mb={'10px'}
    >
      {row.wordState.map((state, j) => {
        return (
          <Cell
            key={j}
            i={i}
            j={j}
            state={state}
            letter={
              i === rowCount
                ? splitCurrentWord[j] || ''
                : row.wordState[j].letter
            }
          />
        );
      })}
    </Box>
  );
};

export default Row;
