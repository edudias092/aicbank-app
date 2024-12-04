import { useContext, useEffect, useState } from "react";
import { BankAccountService } from "../../common/services/BankAccountService"
import Breadcrumb from "../Breadcrumbs/Breadcrumb"
import { ContaContext } from "../../contexts/ContaContextProvider";
import { useForm } from "react-hook-form";
import { getAccountUserEmail, getAccountUserId, tokenIsExpired } from "../../common/utilities/authFunctions";
import { useNavigate } from "react-router-dom";
import { ChargeDTO } from "../../types/charge";
import { IMaskInput } from "react-imask";
import { ResponseDTO } from "../../types/ResponseDTO";
import { ErrorAlert } from "../Alerts";
import { StatusBankAccount } from "../../types/bankaccount";
import { Calendar } from "primereact/calendar"

export const CobrancaBoleto = () => {

    const bankAccountService = new BankAccountService();
    const bankAccountCtx = useContext(ContaContext);
    
    const { formState: {errors, isValid}, register, setValue, handleSubmit, watch  } = useForm<ChargeDTO>();
    
    const [sendingToApi, setSendingToApi] = useState(false);
    const [error, setError] = useState<string>();

    const navigate = useNavigate();
    const userId = getAccountUserId();
    const email = getAccountUserEmail() ?? '';
    
    const sendCharge = async (data: ChargeDTO) => {
        if(bankAccountCtx?.bankAccount && isValid){
            setSendingToApi(s => s = true);
            setError(e => e = undefined);
            try{
                data.mainPaymentMethodId = "boleto";
                data.valueInDouble = parseFloat(data.valueInDouble.toString());
                data.Customer.emails = [data.Customer.email];
                data.Customer.phones = [data.Customer.phone];
                const result = await bankAccountService.createCharge(bankAccountCtx?.bankAccount?.id, data);

                const response = result as ResponseDTO<ChargeDTO>;
            
                if(response.errors && response.errors.length > 0){
                    setError(response.errors.join(','));
                }
                else{
                    navigate(`/cobrancas/detalhe-cobranca/${response.data.myId}`);
                    return;
                }
            }
            catch(e) {
                console.log(e);
            }

            setSendingToApi(s => s = false);
        }
    }

    const [mask, _] = useState(['000.000.000-00', '00.000.000/0000-00']);
    
    const getAccount = async (userId: number | null) => {

        if(!userId || !email || tokenIsExpired()){
            navigate("/login");
            return;
        }

        if(bankAccountCtx != null && bankAccountCtx?.bankAccount == undefined){
            const response = await bankAccountService.getAccountByUserId(userId);

            bankAccountCtx.setBankAccount(response.data)
        }

        if(!bankAccountCtx?.bankAccount || bankAccountCtx?.bankAccount.status != StatusBankAccount.Activated){
            navigate("/conta")
        }
    }

    useEffect(() => {
        getAccount(userId).then().catch(e => console.log(e));

        setValue("paydate", new Date())
    },[])

    return <>
        <Breadcrumb pageName="Nova Cobrança - Boleto" parent="Cobranças" parentRoute="/cobrancas" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                    Cobrança Boleto
                </h3>
            </div>
            <form onSubmit={handleSubmit(sendCharge)}>
                <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <div className="container position-relative">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Data de Vencimento <span className="text-meta-1">*</span>:
                                </label>
                                <input type="hidden" 
                                    defaultValue={new Date().toLocaleDateString()}
                                    value={watch("paydayString")}
                                    {...register('paydayString', {required: true})} 
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    readOnly
                                />
                                <Calendar
                                    dateFormat="dd/mm/yy"
                                    locale="pt"
                                    className="w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    value={watch("paydate")}
                                    {...register('paydate', {required: true})} 
                                />

                                {errors.paydate && <span className="text-red-500">Data de Vencimento é obrigatório.</span>}
                            </div>
                        </div>
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Valor <span className="text-meta-1">*</span>:
                            </label>

                            <input type="number" step="0.01" min="0"
                                {...register('valueInDouble', {required: true})} 
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />

                            {errors.value && <span className="text-red-500">Valor é obrigatório.</span>}
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
                                    {...register("Customer.name", {required: true})}
                                    type="text"
                                    placeholder=""
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                {errors.Customer?.name && <span className="text-red-500">Nome é obrigatório.</span>}
                            </div>
                            <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Documento (CPF/CNPJ) <span className="text-meta-1">*</span>:
                                </label>
                                <IMaskInput mask={mask}
                                    {...register('Customer.document', {required: true})} 
                                    onAccept={(v,m) => setValue("Customer.document", m.unmaskedValue)}
                                    lazy={false}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />

                                {errors.Customer?.document && <span className="text-red-500">Documento é obrigatório.</span>}
                            </div>
                        </div>
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            
                            <div className="w-full xl:w-1/2 flex-1">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Email <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="email"
                                    { ...register("Customer.email", {required: true, pattern:/^[a-z0-9\.\-]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/g})}
                                    placeholder=""
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                {errors.Customer?.email && <span className="text-red-500">Email inválido.</span>}
                            </div>
                            <div className="w-full xl:w-1/4">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Telefone/Celular
                                </label>
                                <IMaskInput mask="(00)00000-0000" 
                                    value={watch("Customer.phone")?.toString()}
                                    {...register('Customer.phone')} 
                                    onAccept={(_, mask) => { setValue("Customer.phone", parseInt(mask.unmaskedValue))}}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                {errors.Customer?.email && <span className="text-red-500">Telefone/Celular inválido.</span>}
                            </div>
                        </div>
                        
                    </fieldset>
                    <hr className="text-slate-300 my-2"/>
                    <div className="mb-4 5">
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