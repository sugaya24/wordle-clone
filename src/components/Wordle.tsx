import { Box, Center } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';

const CHARS_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const ANSWER = 'hello';

const Wordle = () => {
  type TWordRowsState = {
    state: string;
    wordState: {
      state: string;
      letter: string;
    }[];
  }[];
  const initialWordRowsState: TWordRowsState = [];
  for (let i = 0; i < 6; i++) {
    initialWordRowsState.push({
      state: '',
      wordState: [],
    });
    for (let j = 0; j < 5; j++) {
      initialWordRowsState[i].wordState.push({
        state: '',
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
    [wordRowsState, letterCount, rowCount]
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
          state: '',
          letter: '',
        };
        return copyForUpdate;
      });
      setLetterCount((prev) => prev - 1);
    }
  };

  const checkCurrentWord = (): void => {
    console.log(`Checking ${currentWord} at row ${rowCount}`);
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
  };

  return (
    <Box>
      <Box data-testid="input" display={'block'}>
        {currentWord}
      </Box>
      <Box data-testid="word-count">{rowCount}</Box>
      {wordRowsState.map((row, i) => {
        return (
          <Box key={i} display={'flex'}>
            {row.wordState.map((state, i) => {
              return (
                <Center key={i} border={'1px'} w={'30px'} h={'30px'}>
                  {state.letter.toUpperCase()}
                </Center>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
};

export default Wordle;
