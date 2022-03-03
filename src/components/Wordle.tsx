import React, { useCallback, useEffect, useState } from 'react';
import { Box, Center, useToast } from '@chakra-ui/react';
import Row from './Row';
import { ANSWER, CHARS_LOWER } from '../constants/word';
import Keyboard from './Keyboard';

const Wordle = () => {
  type TWordRowsState = {
    state: 'correct' | 'wrong' | 'empty';
    wordState: {
      state: 'correct' | 'absent' | 'present' | 'input' | 'empty';
      letter: string;
    }[];
  }[];
  type CharStatus = 'correct' | 'absent' | 'present' | 'empty';
  const initialWordRowsState: TWordRowsState = [];
  const initialCharStatus: Map<string, CharStatus> = new Map<
    string,
    CharStatus
  >();
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
  CHARS_LOWER.split('').forEach((letter) => {
    initialCharStatus.set(letter, 'empty');
  });

  const [wordRowsState, setWordRowsState] =
    useState<TWordRowsState>(initialWordRowsState);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [letterCount, setLetterCount] = useState<number>(0);
  const [rowCount, setRowCount] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const toast = useToast();
  const [charStatus, setCharStatus] =
    useState<Map<string, CharStatus>>(initialCharStatus);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        deleteLetter();
      } else if (CHARS_LOWER.indexOf(e.key) >= 0) {
        addLetter(e.key);
      } else if (e.key === 'Enter') {
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
    if (!isComplete) {
      return;
    }
    if (isWon) {
      toast({
        title: 'Congratulations!',
        description: `You've completed the wordle!`,
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Oops!',
        description: `The answer was "${ANSWER}".`,
        status: 'error',
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
    if (letterCount !== 5) return;
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
      wordRowsState[rowCount].wordState.map((wordState) => {
        const { state, letter } = wordState;
        setCharStatus((prev) => {
          const copyForUpdate = new Map(prev);
          if (state === 'correct') {
            copyForUpdate.set(letter, 'correct');
          }
          if (state === 'present' && copyForUpdate.get(letter) !== 'correct') {
            copyForUpdate.set(letter, 'present');
          }
          if (
            state === 'absent' &&
            copyForUpdate.get(letter) !== 'correct' &&
            copyForUpdate.get(letter) !== 'present'
          ) {
            copyForUpdate.set(letter, 'absent');
          }
          return copyForUpdate;
        });
      });
      if (currentWord === ANSWER) {
        setIsWon(true);
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
      h={'calc(100vh - 50px)'}
      w={'100%'}
      pt={'8'}
      bgColor={'blackAlpha.900'}
      color={'whiteAlpha.800'}
    >
      <Box pb={'8'}>
        {wordRowsState.map((row, i) => {
          return <Row key={i} row={row} i={i} />;
        })}
      </Box>
      <Center>
        <Keyboard
          addLetter={addLetter}
          deleteLetter={deleteLetter}
          checkCurrentWord={checkCurrentWord}
          charStatus={charStatus}
        />
      </Center>
      {/*--------- for test--------- */}
      <Box data-testid="input" display={'none'}>
        {currentWord}
      </Box>
      <Box data-testid="word-count" display={'none'}>
        {rowCount}
      </Box>
      {/*--------- for test--------- */}
    </Box>
  );
};

export default Wordle;
