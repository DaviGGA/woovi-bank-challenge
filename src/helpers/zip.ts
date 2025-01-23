export const zip = <R,T>(arr1: R[], arr2: T[]): [R, T][] => {
  if(arr1.length != arr2.length)
    throw new Error("Couldn't zip arrays of different length")
  return arr1.map((val, idx) => [val, arr2[idx]])
}