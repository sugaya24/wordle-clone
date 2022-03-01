import React from 'react';
import { Box } from '@chakra-ui/react';
import Cell from './Cell';

type Props = {
  i: number;
  row: {
    wordState: {
      state: 'correct' | 'absent' | 'present' | 'input' | 'empty';
      letter: string;
    }[];
  };
};

const Row = ({ i, row }: Props) => {
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
        return <Cell key={j} i={i} j={j} state={state} />;
      })}
    </Box>
  );
};

export default Row;
