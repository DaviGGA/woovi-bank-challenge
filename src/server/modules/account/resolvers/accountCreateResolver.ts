import { TAccountCreateInput } from "../inputs/AccountCreateInput";
import { IAccount, Account } from "../AccountModel";
import { clearCpf, validateCpf } from "../../../../helpers/cpf-helpers";
import { InvalidCpf } from "../errors/InvalidCpfType";
import { AccountAlrealdyExist } from "../errors/AccountAlrealdyExistType";

type Input = {
  input: TAccountCreateInput
}

type Result = IAccount
  | InvalidCpf
  | AccountAlrealdyExist

export const accountCreateResolver = async ({ input }: Input): Promise<Result> => {

  if(!validateCpf(input.cpf)) {
    return {
      name: "InvalidCpf",
      message: "The provided cpf is not valid.",
      cpf: input.cpf
    }
  }

  const cleanCpf = clearCpf(input.cpf);

  const alrealdyExistsAccount = await Account.exists({cpf: cleanCpf});

  if (alrealdyExistsAccount) {
    return {
      name: "AccountAlrealdyExist",
      cpf: input.cpf,
      message: "Alrealdy exists an account with this cpf"
    } 
  }

  const account = await new Account({
    name: input.name.trim(),
    cpf: cleanCpf
  }).save();

  return account;
}



