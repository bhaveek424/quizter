'use client';
import { useTheme } from 'next-themes';
import React from 'react';
import D3WordCloud from 'react-d3-cloud';

type Props = {};

const data = [
  {
    text: 'Hey',
    value: 3,
  },
  {
    text: 'Voilla',
    value: 10,
  },
  {
    text: 'Computer',
    value: 5,
  },
  {
    text: 'Hola',
    value: 2,
  },
];

const fontSizeMapper = (word: { value: number }) => {
  return Math.log2(word.value) * 5 + 16;
};

const WordCloud = (props: Props) => {
  const theme = useTheme();
  return (
    <>
      <D3WordCloud
        height={550}
        font="Times"
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={theme.theme == 'dark' ? 'white' : 'black'}
        data={data}
      />
    </>
  );
};

export default WordCloud;
