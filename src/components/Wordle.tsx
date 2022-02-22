import { Box } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';

const CHARS_LOWER = 'abcdefghijklmnopqrstuvwxyz';

const Wordle = () => {
  const [word, setWord] = useState<string>('');

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        setWord((prev) => prev.slice(0, -1));
      } else if (CHARS_LOWER.indexOf(e.key) >= 0) {
        addLetter(e.key);
      }
    },
    [word]
  );

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      unmounted = true;
    };
  }, [word, handleKeyDown]);

  const addLetter = (str: string): void => {
    if (word.length < 5) {
      setWord((prev) => prev + str);
    }
  };

  return (
    <Box display={'flex'}>
      <Box data-testid="input">{word}</Box>
      <Box data-testid="letter0" border={'1px'} p={2}>
        {word[0]}
      </Box>
      <Box data-testid="letter1" border={'1px'} p={2}>
        {word[1]}
      </Box>
      <Box data-testid="letter2" border={'1px'} p={2}>
        {word[2]}
      </Box>
      <Box data-testid="letter3" border={'1px'} p={2}>
        {word[3]}
      </Box>
      <Box data-testid="letter4" border={'1px'} p={2}>
        {word[4]}
      </Box>
    </Box>
  );
};

export default Wordle;
