/**
 * @description This function checks the input string for repeating values (1111) or iterating values (1234) through some clever math.  This was pulled from previous build of the application
 * @param input string of numerical values (pin entry value)
 * @returns boolean
 */
export const hasDelta = (input: string) => {
  const array = input.split('').map(Number);
  const deltas: number[] = [];

  for (let i = 0; i < array.length - 1; i += 1) {
    deltas.push(array[i + 1] - array[i]);
  }

  return deltas.every((delta) => delta === deltas[0]);
};
