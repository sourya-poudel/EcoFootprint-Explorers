"use client"

import React from 'react';
import { cn } from '@/lib/utils';
import './confetti.css';

const CONFETTI_COUNT = 150;

export const Confetti: React.FC = () => {
  const confetti = Array.from({ length: CONFETTI_COUNT }).map((_, i) => (
    <div key={i} className={cn('confetti-piece', `confetti-piece--${i % 12}`)} />
  ));

  return <div className="confetti-container">{confetti}</div>;
};
