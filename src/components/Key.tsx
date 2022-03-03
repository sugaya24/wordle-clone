import { Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

type Props = {
  letter: string;
  charStatus: Map<string, 'correct' | 'absent' | 'present' | 'empty'>;
  addLetter: (letter: string) => void;
  deleteLetter: () => void;
  checkCurrentWord: () => void;
};

const Key = ({
  letter,
  charStatus,
  addLetter,
  deleteLetter,
  checkCurrentWord,
}: Props) => {
  const [bgColor, setBgColor] = useState<string>('gray.600');
  useEffect(() => {
    if (charStatus.get(letter) === 'correct') {
      setBgColor('#538d4e');
    } else if (charStatus.get(letter) === 'absent') {
      setBgColor('gray.800');
    } else if (charStatus.get(letter) === 'present') {
      setBgColor('#c9b458');
    } else {
      setBgColor('gray.600');
    }
  }, [charStatus]);

  return (
    <Button
      w={'40px'}
      h={'60px'}
      color={'whitesmoke'}
      bgColor={bgColor}
      _hover={{ bgColor: bgColor }}
      _active={{ bgColor: bgColor }}
      onClick={() => {
        if (letter === 'Enter') {
          checkCurrentWord();
        } else if (letter === 'Backspace') {
          deleteLetter();
        } else {
          addLetter(letter);
        }
      }}
    >
      {letter}
    </Button>
  );
};

export default Key;
