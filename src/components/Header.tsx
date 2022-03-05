import React from 'react';
import { Box, Center } from '@chakra-ui/react';
import { css } from '@emotion/react';

const Header = () => {
  return (
    <Box
      h={'50px'}
      w={'100%'}
      bgColor={'blackAlpha.900'}
      borderBottom={'1px #555 solid'}
    >
      <Center
        h={'100%'}
        fontSize={'3xl'}
        fontWeight={'bold'}
        color={'whiteAlpha.900'}
        fontFamily={'Alfa Slab One'}
      >
        Wordle Clone
      </Center>
    </Box>
  );
};

export default Header;
