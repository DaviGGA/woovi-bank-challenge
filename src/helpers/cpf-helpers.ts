import { zip } from "./zip"

const FIRST_VERIFIER_DIGIT_IDX = 9
const SECOND_VERIFIER_DIGIT_IDX = 10;

export const validateCpf = (cpf: string): boolean => {
  const cleanCpf = clearCpf(cpf);

  if(cleanCpf.length !== 11) return false;

  const splittedCpf = cleanCpf
    .split("")
    .map((val) => parseInt(val));
  
  const foo = [11,10,9,8,7,6,5,4,3,2]
  
  const zippedNineDigitsCpf = zip(
    splittedCpf.slice(0,9), 
    foo.slice(1)
  );

  const sumNineDigits = zippedNineDigitsCpf.reduce(
    (acc, val) => acc + (val[0] * val[1]), 0
  )
  
  const remainder1 = (sumNineDigits * 10) % 11
  const rest1 = [10,11].includes(remainder1) ?
    0 : remainder1

  if (rest1 !== splittedCpf[FIRST_VERIFIER_DIGIT_IDX]) {
    return false
  }

  const zippedTenDigitsCpf = zip(
    splittedCpf.slice(0, 10),
    foo
  )

  const sumTenDigits = zippedTenDigitsCpf.reduce(
    (acc, val) => acc + (val[0] * val[1]), 0
  )

  const remainder2 = (sumTenDigits * 10) % 11
  const rest2 = [10,11].includes(remainder2) ?
    0 : remainder2 

  return rest2 === splittedCpf[SECOND_VERIFIER_DIGIT_IDX]


}

export const clearCpf = (cpf: string): string => {
  return cpf
    .trim()
    .replace(/\./g, "")
    .replace(/\-/g, "")
}