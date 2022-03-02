import React, { useCallback, useEffect, useState } from 'react';
import { Box, useToast } from '@chakra-ui/react';
import Row from './Row';
import { ANSWER, CHARS_LOWER } from '../constants/word';

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
  const toast = useToast();

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

  useEffect(() => {
    if (isComplete) {
      toast({
        title: 'Congratulations!',
        description: `You've completed the wordle!`,
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    }
  }, [isComplete]);

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
      setLetterCount(0);
      if (rowCount < 5) {
        setRowCount((prev) => prev + 1);
      } else {
        setIsComplete(true);
      }
    });
  };

  return (
    <Box
      h={'100vh'}
      w={'100%'}
      pt={'8'}
      bgColor={'blackAlpha.900'}
      color={'whiteAlpha.800'}
    >
      {wordRowsState.map((row, i) => {
        return <Row key={i} row={row} i={i} />;
      })}
      <Box data-testid="input" display={'block'}>
        {currentWord}
      </Box>
      <Box data-testid="word-count">{rowCount}</Box>
    </Box>
  );
};

export default Wordle;
