import { useContext, useEffect, useState } from "react";
import { BankAccountService } from "../../common/services/BankAccountService"
import Breadcrumb from "../Breadcrumbs/Breadcrumb"
import { ContaContext } from "../../contexts/ContaContextProvider";
import { useForm } from "react-hook-form";
import { getAccountUserEmail, getAccountUserId, tokenIsExpired } from "../../common/utilities/authFunctions";
import { useNavigate } from "react-router-dom";
import { TabelaExtrato } from "./TabelaExtrato";
import { BalanceDTO } from "../../types/bankStatement";
import { StatusBankAccount } from "../../types/bankaccount";
import { Calendar } from "primereact/calendar";

export type BankStatementFilter = {
    initialDate: Date,
    initialDateString: string,
    finalDate: Date,
    finalDateString: string
}

export const Extrato = () => {
    const bankAccountService = new BankAccountService();
    const bankAccountCtx = useContext(ContaContext);
    
    const { formState: {errors, isValid}, register, setValue, handleSubmit, watch  } = useForm<BankStatementFilter>();
    
    const [sendingToApi, setSendingToApi] = useState(false);
    const [balances, setBalances] = useState<BalanceDTO[]>();
    const [periodDescription, setPeriodDescription] = useState("");
    
    const navigate = useNavigate();
    const userId = getAccountUserId();
    const email = getAccountUserEmail() ?? '';
    
    const getExtrato = async (data: BankStatementFilter) => {
        if(bankAccountCtx?.bankAccount && isValid){
            setSendingToApi(s => s = true);

            try{

                const result = await bankAccountService.getMovements(bankAccountCtx?.bankAccount?.id, data);

                if(result.data?.Balances && result.data.Balances.length > 0){
                    setBalances(result.data.Balances);
                }

                setPeriodDescription(`${data.initialDateString} - ${data.finalDateString}`)
            }
            catch(e) {
                console.log(e);
            }

            setSendingToApi(s => s = false);
        }
    }

    const getAccount = async (userId: number | null) => {
        if(!userId || !email || tokenIsExpired()){
            navigate("/login");
            return;
        }
        let shouldRedirect = false;

        if(bankAccountCtx != null && bankAccountCtx?.bankAccount == undefined){
            const response = await bankAccountService.getAccountByUserId(userId)
    
            bankAccountCtx.setBankAccount(response.data);

            shouldRedirect = response.data.status != StatusBankAccount.Activated;
        }
        else{
            shouldRedirect = bankAccountCtx?.bankAccount?.status != StatusBankAccount.Activated;
        }
        
        if(shouldRedirect){
          navigate("/conta")
        }
    }

    useEffect(() => {
        getAccount(userId).then().catch(e => console.log(e));

        setValue("initialDate", new Date())
        setValue("finalDate", new Date())
    },[])

    return <>
        <Breadcrumb pageName="Extrato" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                    Consulta Extrato
                </h3>
            </div>
            <form onSubmit={handleSubmit(getExtrato)}>
                <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row items-end">
                        <div className="w-full xl:w-1/4 flex-1">
                            <div className="container position-relative">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Data Inicial:
                                </label>
                                <input type="hidden" 
                                    defaultValue={new Date().toLocaleDateString()}
                                    value={watch("initialDateString")}
                                    {...register('initialDateString', {required: true})} 
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <Calendar
                                    dateFormat="dd/mm/yy"
                                    locale="pt"
                                    className="w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    value={watch("initialDate")}
                                    {...register('initialDate', {required: true})} 
                                />

                                {errors.initialDateString && <span className="text-red-500">Data Inicial é obrigatório.</span>}
                            </div>
                        </div>
                        <div className="w-full xl:w-1/4 flex-1">
                            <div className="container position-relative">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Data Final:
                                </label>
                                <input type="hidden" 
                                    defaultValue={new Date().toLocaleDateString()}
                                    value={watch("finalDateString")}
                                    {...register('finalDateString', {required: true})} 
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <Calendar
                                    dateFormat="dd/mm/yy"
                                    locale="pt"
                                    className="w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    value={watch("finalDate")}
                                    {...register('finalDate', {required: true})} 
                                />

                                {errors.initialDateString && <span className="text-red-500">Data Inicial é obrigatório.</span>}
                            </div>
                        </div>
                        <div className="w-full xl:w-1/4">
                            <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                                disabled={sendingToApi}    
                            >
                                {sendingToApi 
                                    ? <span className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></span>
                                    : "Carregar"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-2">
            <TabelaExtrato periodDescription={periodDescription} balances={balances}/>
        </div>
    </>
}