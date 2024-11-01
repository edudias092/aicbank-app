import { createContext, ReactNode, useState } from "react"
import { BankAccountDTO } from "../types/bankaccount"

type ContaContextType = {
    bankAccount: BankAccountDTO | undefined,
    setBankAccount: ((b: BankAccountDTO | undefined) => void )
}

type ContaContextProviderProps = {
    children: ReactNode
}

export const ContaContext = createContext<ContaContextType | null>(null);

export const ContaContextProvider = ({ children }: ContaContextProviderProps) => {
    const [bankAccount, setBankAccount] = useState<BankAccountDTO | undefined>();
    
    return <ContaContext.Provider value={{ bankAccount, setBankAccount }}>
        {children}
    </ContaContext.Provider>
}