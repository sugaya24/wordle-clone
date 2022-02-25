import { Box } from '@chakra-ui/react';
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
    [wordRowsState, letterCount]
  );

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      document.addEventListener('keydown', handleKeyDown);
    }
    setCurrentWord(
      wordRowsState[0].wordState.map((wordState) => wordState.letter).join('')
    );
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      unmounted = true;
    };
  }, [wordRowsState, handleKeyDown]);

  const addLetter = (letter: string): void => {
    if (letterCount < 5) {
      setWordRowsState((prev: TWordRowsState) => {
        const copyForUpdate = [...prev];
        copyForUpdate[0].wordState[letterCount] = {
          state: 'input',
          letter,
        };
        return copyForUpdate;
      });
      setLetterCount((prev) => prev + 1);
    }
  };

  const deleteLetter = (): void => {
    if (letterCount > 0) {
      setWordRowsState((prev: TWordRowsState) => {
        const copyForUpdate = [...prev];
        copyForUpdate[0].wordState[letterCount - 1] = {
          state: '',
          letter: '',
        };
        return copyForUpdate;
      });
      setLetterCount((prev) => prev - 1);
    }
  };

  const checkCurrentWord = (): void => {
    if (currentWord === ANSWER) {
      console.log('correct!');
    }
    for (let i = 0; i < 5; i++) {
      setWordRowsState((prev: TWordRowsState) => {
        const copyForUpdate = [...prev];
        copyForUpdate[0].wordState[letterCount - i - 1] = {
          state: 'input',
          letter: '',
        };
        return copyForUpdate;
      });
      setLetterCount((prev) => prev - 1);
    }
  };

  return (
    <Box>
      <Box data-testid="input" display={'none'}>
        {currentWord}
      </Box>
      {wordRowsState.map((row, i) => {
        return (
          <Box key={i} display={'flex'}>
            {row.wordState.map((state, i) => {
              return (
                <Box key={i} border={'1px'} display={'flex'}>
                  <Box w={'30px'} h={'30px'}>
                    {state.letter.toUpperCase()}
                  </Box>
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
};

export default Wordle;
