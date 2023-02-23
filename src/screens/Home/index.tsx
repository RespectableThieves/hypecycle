import React, { useRef, useState, useEffect } from 'react';
import { Container, Title } from './styles';

export function Home() {

  useEffect(()=> {
    console.log('Rendering Home...')
  }, []);

  return (
    <Container>
      <Title>Home</Title>
    </Container>
  );
}