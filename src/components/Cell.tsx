import React from 'react';
import { Center } from '@chakra-ui/react';
import classNames from 'classnames';
import {
  inputStyle,
  absentStyle,
  correctStyle,
  presentStyle,
} from './WordleStyle';

type Props = {
  i: number;
  j: number;
  letter: string;
  state: {
    state: 'correct' | 'empty' | 'absent' | 'present' | 'input';
    letter: string;
  };
};

const Cell = ({ i, j, state, letter }: Props) => {
  return (
    <Center
      border={'2px'}
      borderColor={'gray.700'}
      className={classNames([
        state.state === 'input' && 'input',
        state.state === 'correct' && 'correct',
        state.state === 'absent' && 'absent',
        state.state === 'present' && 'present',
      ])}
      h={'60px'}
      rounded={'sm'}
      fontSize={'3xl'}
      css={[
        state.state === 'input' && inputStyle,
        state.state === 'correct' && correctStyle,
        state.state === 'absent' && absentStyle,
        state.state === 'present' && presentStyle,
      ]}
      data-testid={`letter-${i}-${j}`}
    >
      {letter.toUpperCase()}
    </Center>
  );
};

export default Cell;
