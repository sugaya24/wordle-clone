import React, { useCallback, useEffect, useState } from 'react';
import { Box, Center } from '@chakra-ui/react';
import classNames from 'classnames';
import {
  inputStyle,
  correctStyle,
  absentStyle,
  presentStyle,
} from './WordleStyle';

const CHARS_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const ANSWER = 'hello';

const Wordle = () => {
  type TWordRowsState = {
    state: 'correct' | 'wrong' | 'empty';
    wordState: {
      state: 'correct' | 'absent' | 'present' | 'input' | 'empty';
      letter: string;
    }[];
  }[];
  const initialWordRowsState: TWordRowsState = [];
  for (let i = 0; i < 6; i++) {
    initialWordRowsState.push({
      state: 'empty',
      wordState: [],
    });
    for (let j = 0; j < 5; j++) {
      initialWordRowsState[i].wordState.push({
        state: 'empty',
        letter: '',
      });
    }
  }

  const [wordRowsState, setWordRowsState] =
    useState<TWordRowsState>(initialWordRowsState);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [letterCount, setLetterCount] = useState<number>(0);
  const [rowCount, setRowCount] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        deleteLetter();
      } else if (CHARS_LOWER.indexOf(e.key) >= 0) {
        addLetter(e.key);
      } else if (e.key === 'Enter' && letterCount === 5) {
        checkCurrentWord();
      }
    },
    [wordRowsState, letterCount, rowCount, isComplete]
  );

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      document.addEventListener('keydown', handleKeyDown);
    }
    setCurrentWord(
      wordRowsState[rowCount].wordState
        .map((wordState) => wordState.letter)
        .join('')
    );
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      unmounted = true;
    };
  }, [wordRowsState, handleKeyDown]);

  const addLetter = (letter: string): void => {
    if (isComplete) return;
    if (letterCount < 5) {
      setWordRowsState((prev: TWordRowsState) => {
        const copyForUpdate = [...prev];
        copyForUpdate[rowCount].wordState[letterCount] = {
          state: 'input',
          letter,
        };
        return copyForUpdate;
      });
      setLetterCount((prev) => prev + 1);
    }
  };

  const deleteLetter = (): void => {
    if (isComplete) return;
    if (letterCount > 0) {
      setWordRowsState((prev: TWordRowsState) => {
        const copyForUpdate = [...prev];
        copyForUpdate[rowCount].wordState[letterCount - 1] = {
          state: 'empty',
          letter: '',
        };
        return copyForUpdate;
      });
      setLetterCount((prev) => prev - 1);
    }
  };

  const checkCurrentWord = (): void => {
    console.log(`Checking ${currentWord} at row ${rowCount}`);
    const promiseList: Promise<void>[] = [];
    for (let i = 0; i < 5; i++) {
      const promise: Promise<void> = new Promise((resolve) => {
        setTimeout(() => {
          if (currentWord[i] === ANSWER[i]) {
            setWordRowsState((prev: TWordRowsState) => {
              const copyForUpdate = [...prev];
              copyForUpdate[rowCount].wordState[i].state = 'correct';
              return copyForUpdate;
            });
          } else if (ANSWER.includes(currentWord[i])) {
            setWordRowsState((prev: TWordRowsState) => {
              const copyForUpdate = [...prev];
              copyForUpdate[rowCount].wordState[i].state = 'present';
              return copyForUpdate;
            });
          } else {
            setWordRowsState((prev: TWordRowsState) => {
              const copyForUpdate = [...prev];
              copyForUpdate[rowCount].wordState[i].state = 'absent';
              return copyForUpdate;
            });
          }
          resolve();
        }, i * 500);
      });
      promiseList.push(promise);
    }
    Promise.all(promiseList).then(() => {
      console.log('word check done');
      if (currentWord === ANSWER) {
        console.log('correct! at challenge ' + rowCount);
        setIsComplete(true);
      }
    });
    setLetterCount(0);
    if (rowCount < 5) {
      setRowCount((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  return (
    <Box
      h={'100vh'}
      w={'100%'}
      bgColor={'blackAlpha.900'}
      color={'whiteAlpha.800'}
    >
      {wordRowsState.map((row, i) => {
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
                <Center
                  key={j}
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
                  {state.letter.toUpperCase()}
                </Center>
              );
            })}
          </Box>
        );
      })}
      <Box data-testid="input" display={'block'}>
        {currentWord}
      </Box>
      <Box data-testid="word-count">{rowCount}</Box>
    </Box>
  );
};

export default Wordle;
