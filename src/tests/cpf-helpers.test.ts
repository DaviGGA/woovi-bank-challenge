import { it } from "@jest/globals";
import {validateCpf, clearCpf} from "../helpers/cpf-helpers"

it("validateCpf", () => {
  const validCpfs = [
    "767.058.900-02",
    "03883886092",
    " 350.865.850-31  "
  ]

  const invalidCpfs = [
    "767.058.900/02",
    "03883886093",
    "038"
  ]

  validCpfs.forEach(cpf => {
    expect(validateCpf(cpf)).toBe(true)
  })

  invalidCpfs.forEach(cpf => {
    expect(validateCpf(cpf)).toBe(false)
  })

})

it("clearCpf", () => {
  const cpfs = [
    "767.058.900-02",
    "350.865.850-31"
  ]

  const clearedCpfs = [
    "76705890002",
    "35086585031"
  ]

  cpfs.forEach((cpf, idx) => {
    expect(clearCpf(cpf)).toBe(clearedCpfs[idx])
  })
})