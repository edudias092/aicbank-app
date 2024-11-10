import { useContext, useEffect, useState } from "react";
import { BankAccountService } from "../../common/services/BankAccountService"
import Breadcrumb from "../Breadcrumbs/Breadcrumb"
import { ContaContext } from "../../contexts/ContaContextProvider";
import { getAccountUserEmail, getAccountUserId, tokenIsExpired } from "../../common/utilities/authFunctions";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorAlert } from "../Alerts";

export const DetalheCobranca = () => {

    const bankAccountService = new BankAccountService();
    const bankAccountCtx = useContext(ContaContext);
    const [sendingToApi, setSendingToApi] = useState(false);
    const [error, setError] = useState<string>();

    const navigate = useNavigate();
    const { id } = useParams();

    const userId = getAccountUserId();
    const email = getAccountUserEmail() ?? '';
    
    const getCharge = async (chargeId: number) => {
        
        setSendingToApi(s => s = true);
        setError(e => e = undefined);
        try{
            // const result = await bankAccountService.createCharge(bankAccountCtx?.bankAccount?.id, data);

            // const response = result as ResponseDTO<ChargeDTO>
        
            // if(response.errors && response.errors.length > 0){
            //     setError(response.errors.join(','))
            // }
        }
        catch(e) {
            console.log(e);
        }

        setSendingToApi(s => s = false);
        
    }

    const getAccount = async (userId: number | null) => {

        if(!userId || !email || tokenIsExpired()){
            navigate("/login");
            return;
        }

        if(bankAccountCtx != null && bankAccountCtx?.bankAccount == undefined){
            const response = await bankAccountService.getAccountByUserId(userId)
            
            bankAccountCtx.setBankAccount(response.data)
        }
    }

    useEffect(() => {
        getAccount(userId).then().catch(e => console.log(e));
    },[])

    return <>
        <Breadcrumb pageName={`Detalhe Cobrança`} parent="Cobranças" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                    Detalhe Cobrança - nº {id}
                </h3>
            </div>
            <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <div className="container position-relative">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Data de Vencimento <span className="text-meta-1">*</span>:
                            </label>
                            <input type="number" step="0.01" min="0" disabled 
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                    </div>
                    <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Valor <span className="text-meta-1">*</span>:
                        </label>

                        <input type="number" step="0.01" min="0" disabled
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Método pagamento <span className="text-meta-1">*</span>:
                        </label>
                        <select 
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            disabled
                        >
                            <option value="boleto">Boleto</option>
                        </select>
                    </div>
                </div>
                <fieldset>
                    <legend className="text-xl">Dados do Cliente</legend>
                    <hr className="text-slate-300 my-2"/>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Nome <span className="text-meta-1">*</span>:
                            </label>
                            <input
                                type="text"
                                placeholder=""
                                disabled
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Documento (CPF/CNPJ) <span className="text-meta-1">*</span>:
                            </label>
                            <input
                                type="text"
                                placeholder=""
                                disabled
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        
                        <div className="w-full xl:w-1/2 flex-1">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Email <span className="text-meta-1">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder=""
                                disabled
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                        <div className="w-full xl:w-1/4">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Telefone/Celular
                            </label>
                            <input
                                type="text"
                                placeholder=""
                                disabled
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                    </div>
                    
                </fieldset>
                <hr className="text-slate-300 my-2"/>
                <div className="mb-4 5">
                    <div className="flex items-center">
                        <button className="flex w-1/3 justify-center rounded bg-primary p-3 font-medium text-gray mx-2 hover:bg-opacity-90"
                            disabled={sendingToApi}    
                        >
                            {sendingToApi 
                                ? <span className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></span>
                                : "Visualizar Boleto"
                            }
                        </button>
                        <button className="w-1/3 justify-center rounded bg-primary p-3 font-medium text-gray mx-2 hover:bg-opacity-90"
                            disabled={sendingToApi}    
                        >
                            {sendingToApi 
                                ? <span className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></span>
                                : "Visualizar Fatura"
                            }
                        </button>
                        <button className="w-1/3 justify-center rounded bg-danger p-3 font-medium text-gray mx-2 hover:bg-opacity-90"
                            disabled={sendingToApi}    
                        >
                            {sendingToApi 
                                ? <span className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></span>
                                : "Cancelar Cobrança"
                            }
                        </button>
                    </div>
                    <div className="my-4">
                        {error && 
                            <ErrorAlert message={error} action={() => setError(undefined)} />
                        }
                    </div>
                </div>
            </div>
        </div>
    </>
}