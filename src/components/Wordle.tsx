import React, { useCallback, useEffect, useState } from 'react';
import { Box, Center, useToast } from '@chakra-ui/react';
import Row from './Row';
import { ANSWER, CHARS_LOWER } from '../constants/word';
import Keyboard from './Keyboard';
import { wordList } from '../constants/wordList';

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
  const [rowCount, setRowCount] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const toast = useToast();
  const [charStatus, setCharStatus] =
    useState<Map<string, CharStatus>>(initialCharStatus);
  const [jiggle, setJiggle] = useState<string>('');

  const addLetter = useCallback(
    (letter: string): void => {
      if (isComplete) return;
      if (currentWord.length < 5) {
        setCurrentWord(currentWord + letter);
        setWordRowsState((wordRowsState) => {
          const copyForUpdate = [...wordRowsState];
          copyForUpdate[rowCount].wordState[currentWord.length].state = 'input';
          return copyForUpdate;
        });
      }
    },
    [currentWord, isComplete, rowCount]
  );

  const deleteLetter = useCallback((): void => {
    if (isComplete) return;
    if (currentWord.length > 0) {
      setCurrentWord((prev) => prev.slice(0, -1));
      setWordRowsState((wordRowsState) => {
        const copyForUpdate = [...wordRowsState];
        copyForUpdate[rowCount].wordState[currentWord.length - 1].state =
          'empty';
        return copyForUpdate;
      });
    }
  }, [currentWord, isComplete, rowCount]);

  const handleJiggle = (): Promise<void> => {
    return new Promise((resolve) => {
      setJiggle('jiggle');
      resolve();
    });
  };

  const checkCurrentWord = useCallback((): void => {
    if (currentWord.length !== 5) return;
    if (!wordList.includes(currentWord)) {
      handleJiggle().then(() => {
        toast({
          description: `"${currentWord.toUpperCase()}" is not in the list.`,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
        setTimeout(() => {
          setJiggle('');
        }, 1000);
      });
      return;
    }
    const promiseList: Promise<void>[] = [];
    for (let i = 0; i < 5; i++) {
      const promise: Promise<void> = new Promise((resolve) => {
        setTimeout(() => {
          if (currentWord[i] === ANSWER[i]) {
            setWordRowsState((prev: TWordRowsState) => {
              const copyForUpdate = [...prev];
              copyForUpdate[rowCount].wordState[i] = {
                state: 'correct',
                letter: currentWord[i],
              };
              return copyForUpdate;
            });
          } else if (ANSWER.includes(currentWord[i])) {
            setWordRowsState((prev: TWordRowsState) => {
              const copyForUpdate = [...prev];
              copyForUpdate[rowCount].wordState[i] = {
                state: 'present',
                letter: currentWord[i],
              };
              return copyForUpdate;
            });
          } else {
            setWordRowsState((prev: TWordRowsState) => {
              const copyForUpdate = [...prev];
              copyForUpdate[rowCount].wordState[i] = {
                state: 'absent',
                letter: currentWord[i],
              };
              return copyForUpdate;
            });
          }
          resolve();
        }, i * 500);
      });
      promiseList.push(promise);
    }
    Promise.all(promiseList)
      .then(() => {
        wordRowsState[rowCount].wordState.map((wordState) => {
          const { state, letter } = wordState;
          setCharStatus((prev: Map<string, CharStatus>) => {
            const copyForUpdate = new Map(prev);
            if (state === 'correct') {
              copyForUpdate.set(letter, 'correct');
            }
            if (
              state === 'present' &&
              copyForUpdate.get(letter) !== 'correct'
            ) {
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
          return wordState;
        });
        if (currentWord === ANSWER) {
          setWordRowsState((prev: TWordRowsState) => {
            const copyForUpdate = [...prev];
            copyForUpdate[rowCount].state = 'correct';
            return copyForUpdate;
          });
          setIsWon(true);
          setIsComplete(true);
        } else {
          setWordRowsState((prev: TWordRowsState) => {
            const copyForUpdate = [...prev];
            copyForUpdate[rowCount].state = 'wrong';
            return copyForUpdate;
          });
        }
      })
      .then(() => {
        if (rowCount < 5) {
          setCurrentWord('');
          setRowCount((prev) => prev + 1);
        } else {
          setIsComplete(true);
        }
      });
  }, [currentWord, rowCount, toast, wordRowsState]);

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
    [addLetter, deleteLetter, checkCurrentWord]
  );

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
  }, [isComplete, isWon, toast]);

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      document.addEventListener('keyup', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keyup', handleKeyDown);
      unmounted = true;
    };
  }, [wordRowsState, handleKeyDown, addLetter, deleteLetter, checkCurrentWord]);

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
          return (
            <Row
              key={i}
              row={row}
              i={i}
              currentWord={currentWord}
              rowCount={rowCount}
              jiggle={jiggle}
            />
          );
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
