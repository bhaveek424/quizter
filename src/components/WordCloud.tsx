'use client';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { format } from 'path';
import React from 'react';
import D3WordCloud from 'react-d3-cloud';

type Props = {
  formattedTopics: { text: string; value: number }[];
};

const fontSizeMapper = (word: { value: number }) => {
  return Math.log2(word.value) * 5 + 16;
};

const WordCloud = ({ formattedTopics }: Props) => {
  const router = useRouter();
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
        onWordClick={(event, word) => {
          router.push('/quiz?topic=' + word.text);
        }}
        data={formattedTopics}
      />
    </>
  );
};

export default WordCloud;
