export interface GameWord {
  word: string;
  isSpy: boolean;
  isBlank: boolean;
  isViewed: boolean;
  isReviewed: boolean;
  isEliminated: boolean;
}

export const randomNumber = (max: number) => {
  return Math.floor(Math.random() * max);
};
