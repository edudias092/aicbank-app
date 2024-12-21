import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { BankAccountService } from "../../common/services/BankAccountService";
import { getAccountUserId, getAccountUserEmail, tokenIsExpired } from "../../common/utilities/authFunctions";
import { ContaContext } from "../../contexts/ContaContextProvider";
import { ResponseDTO } from "../../types/ResponseDTO";
import { CelcashPaymentRequestDto } from "../../types/celcashPaymentRequestDto";
import { ErrorAlert } from "../Alerts";
import { IMaskInput } from "react-imask";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { StatusBankAccount } from "../../types/bankaccount";

export const NovaTransferencia = () => {

    const bankAccountService = new BankAccountService();
    const bankAccountCtx = useContext(ContaContext);
    
    const { formState: {errors, isValid}, register, setValue, handleSubmit, watch  } = useForm<CelcashPaymentRequestDto>();
    
    const [sendingToApi, setSendingToApi] = useState(false);
    const [error, setError] = useState<string>();

    const navigate = useNavigate();
    const userId = getAccountUserId();
    const email = getAccountUserEmail() ?? '';
    
    const sendPayment = async (data: CelcashPaymentRequestDto) => {
        if(bankAccountCtx?.bankAccount && isValid){
            setSendingToApi(s => s = true);
            setError(e => e = undefined);
            try{
                
                const result = await bankAccountService.createPayment(bankAccountCtx?.bankAccount?.id, data);

                const response = result as ResponseDTO<object>;
            
                if(response.errors && response.errors.length > 0){
                    setError(response.errors.join(','));
                }
                else{
                    navigate("/")
                    return;
                }
            }
            catch(e) {
                console.log(e);
            }

            setSendingToApi(s => s = false);
        }
    }

    const [mask, setMask] = useState<string | RegExp>();
    
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

    const handleType = (type: string) => {
        switch(type){
            case "cpf":
                setMask("000.000.000-00");
                break
            case "cnpj":
                setMask("00.000.000/0000-00");
                break
            case "mobilePhone":
                setMask("(00)00000-0000");
                break
            case "email":
            case "random":
                setMask(/.*/)
        }

        setValue("key", "");
        return;
    }

    useEffect(() => {
        getAccount(userId).then().catch(e => console.log(e));
        
        handleType(watch("type"));

    },[bankAccountCtx?.bankAccount])

    return <>
    <Breadcrumb pageName="Nova Transferência/Pix" parent="Cobranças" parentRoute="/cobrancas" />

    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
            Pix
            </h3>
        </div>
        <form onSubmit={handleSubmit(sendPayment)}>
            <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Tipo de Chave<span className="text-meta-1">*</span>:
                        </label>
                        <select 
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            {...register('type', {required: true})} 
                            onChange={(e) => handleType(e.target.value)}
                        >
                            <option value="cpf">CPF</option>
                            <option value="cnpj">CNPJ</option>
                            <option value="email">Email</option>
                            <option value="mobilePhone">Celular</option>
                            <option value="random">Aleatória</option>
                        </select>
                        {errors.type && <span className="text-red-500">Tipo de Chave é obrigatório.</span>}
                    </div>
                    <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Chave <span className="text-meta-1">*</span>:
                        </label>

                        <IMaskInput mask={mask}
                            value={watch("key")}
                            {...register('key', {required: true})} 
                            onAccept={(_,m) => setValue("key", m.unmaskedValue)}
                            lazy={false}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />

                        {errors.key && <span className="text-red-500">Chave é obrigatória.</span>}
                    </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Valor <span className="text-meta-1">*</span>:
                        </label>

                        <input type="number" step="0.01" min="0"
                            {...register('valueInDouble', {required: true})} 
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />

                        {errors.valueInDouble && <span className="text-red-500">Valor é obrigatório.</span>}
                    </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Descrição
                        </label>
                        <textarea
                            {...register("desc", {required: false, maxLength:140})}
                            placeholder=""
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                        </textarea>
                        {errors.desc && <span className="text-red-500">Descrição deve conter no máximo 140 caracteres.</span>}
                    </div>
                </div>
                <hr className="text-slate-300 my-2"/>
                <div className="mb-4.5">
                    <div className="w-full">
                        <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                            disabled={sendingToApi}    
                        >
                            {sendingToApi 
                                ? <span className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></span>
                                : "Confirmar"
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
        </form>
    </div>
</>
}