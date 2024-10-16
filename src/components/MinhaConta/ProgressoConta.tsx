import { useContext } from "react"
import { ContaContext } from "../../contexts/ContaContextProvider"
import { StatusBankAccount } from "../../types/bankaccount";



export const ProgressoConta = () => {
    const bankAccountCtx = useContext(ContaContext);
    const statusAccount = bankAccountCtx?.bankAccount?.status ?? undefined;
    const items: ItemProgressoProps[] = [
        {completed: (statusAccount != undefined && statusAccount >= StatusBankAccount.PendingDocuments), number:1, title:"Cadastro"},
        {completed: (statusAccount != undefined && statusAccount >= StatusBankAccount.PendingAnalysis), number:2, title:"Envio dos Documentos"},
        {completed: (statusAccount != undefined && statusAccount >= StatusBankAccount.Activated), number:3, title:"Análise e Confirmação"}
    ]
    return <>
        <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base px-3 py-2">
            {items.map((i,ind) => 
                <ItemProgresso key={i.number} completed={i.completed}
                                number={i.number}
                                title={i.title}
                                showLine={items.length > (ind + 1)}
                />

            )}
        </ol>
        
    </>
}

type ItemProgressoProps = {
    completed: boolean,
    number: number,
    title: string,
    showLine?: boolean
}

const ItemProgresso = ({completed, number, title, showLine=false}: ItemProgressoProps) => {
    const splitTitle = title.trim().split(' ');
    const classNamesLine = showLine 
                            ? "text-gray-200 dark:text-gray-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700"
                            : "";
    const completedClassNamesLine = showLine 
                                    ? "text-blue-600 dark:text-blue-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700"
                                    : "";

    return <>
        {completed ?
            <li className={"flex md:w-full items-center "+completedClassNamesLine}>
                <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                    </svg>
                        
                    {splitTitle.map((t,i) => {
                        return <span className="hidden sm:inline-flex sm:ms-2" key={i}>{t}</span>
                    })}
                </span>
            </li>
            :
            <li className={"flex md:w-full items-center " + classNamesLine}>
                <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                    <span className="me-2">{number}</span>
                    {splitTitle.map((t,i)=> {
                        return <span className="hidden sm:inline-flex sm:ms-2" key={i}>{t}</span>
                    })}
                </span>
            </li>
        }
    </>
}