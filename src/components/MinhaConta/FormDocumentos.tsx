import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorAlert } from "../Alerts";
import { MandatoryDocumentsDTO, MandatoryDocumentType } from "../../types/mandatoryDocuments";
import { ResponseDTO } from "../../types/ResponseDTO";
import { BankAccountDTO, TypeBankAccount } from "../../types/bankaccount";
import { BankAccountService } from "../../common/services/BankAccountService";
import { ContaContext } from "../../contexts/ContaContextProvider";
import { DayPicker } from "react-day-picker";
import { IMaskInput } from "react-imask";

export const FormDocumentos = () => {

    const [apiError, setApiError] = useState<string[]>([]);
    const [sendingToApi, setSendingToApi] = useState(false);
    const { register, setValue, formState: {errors, isValid}, handleSubmit, watch  } = useForm<MandatoryDocumentsDTO>();
    const bankAccountService = new BankAccountService();
    const bankAccountCtx = useContext(ContaContext);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectingDate, setSelectingDate] = useState(false);

    const updateAccount = async (data: MandatoryDocumentsDTO) => {
        if(isValid){
            if(bankAccountCtx?.bankAccount && bankAccountCtx.bankAccount.id != 0){
                setSendingToApi(() => true);
                debugger;

                let result = await bankAccountService.sendMandatoryDocuments(bankAccountCtx.bankAccount.id, data);
    
                if(Array.isArray(result)){
                    setApiError(result as string[]);
                }
                else {
                    const response = result as ResponseDTO<BankAccountDTO>
                    bankAccountCtx.setBankAccount(response.data);
                }

                setSendingToApi(() => false);
            }
        }
    }

    const handleCalendar = (newDate: Date) : void => {
        
        setValue("birthDate", newDate); 
        setValue("birthDateString", newDate.toLocaleDateString()); 
        
        setShowCalendar(false);
        setSelectingDate(false);
    }

    return <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
        // onClick={_ => { if(showCalendar) setShowCalendar(false) }}
    >
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
                2. Envio dos Documentos
            </h3>
        </div>
        <form onSubmit={handleSubmit(updateAccount)}>
            <div className="p-6.5">
                <fieldset>
                    <legend className="text-xl">Informações do Associado</legend>
                    <hr className="mb-4"/>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Nome do Associado
                            </label>
                            <input
                                {...register("associateName", {required: true})}
                                type="text"
                                placeholder=""
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.motherName && <span className="text-red-500">Nome do Associado é obrigatório.</span>}
                        </div>
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Documento do Associado (CPF)
                            </label>
                            <IMaskInput mask="000.000.000-00" 
                                value={watch("associateDocument")}
                                {...register('associateDocument', {required: true})} 
                                onAccept={(_, mask) => { setValue("associateDocument", mask.unmaskedValue)}}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.motherName && <span className="text-red-500">Documento do Associado é obrigatório.</span>}
                        </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2 ">
                            <div className="container position-relative">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Data de Nascimento:
                                </label>
                                <input type="text" 
                                    value={watch("birthDateString")}
                                    {...register('birthDateString', {required: true})} 
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    onFocus={_ => { setSelectingDate(true); setShowCalendar(true); }}
                                    onBlur={_ => { if(!selectingDate) setShowCalendar(false); setSelectingDate(false); }}
                                />
                                {showCalendar && 
                                    <DayPicker
                                            captionLayout="dropdown"
                                            style={ {position: "absolute", top:370, right: 150, backgroundColor:"white", padding: 10, border:1}}
                                            mode="single"
                                            selected={watch("birthDate")}
                                            onSelect={e => handleCalendar(e ?? new Date())}
                                            defaultMonth={watch("birthDate")}
                                            onDayMouseEnter={_ => setSelectingDate(true)}
                                            onDayMouseLeave={_ => setSelectingDate(false)}
                                        />
                                }

                                {errors.birthDateString && <span className="text-red-500">Data de Nascimento é obrigatório.</span>}
                            </div>
                        </div>
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Nome da Mãe
                            </label>
                            <input
                                {...register("motherName", {required: true})}
                                type="text"
                                placeholder=""
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.motherName && <span className="text-red-500">Nome da Mãe é obrigatório.</span>}
                        </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Tipo de Associado
                            </label>
                            <select 
                                { ...register("associateType", {required: true})}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            >
                                <option value="partner">Sócio</option>
                                <option value="attorney">Procurador</option>
                                <option value="personinvolved">Pessoa Envolvida</option>
                            </select>
                            {errors.motherName && <span className="text-red-500">Tipo de Associado é obrigatório.</span>}
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend className="text-xl">Dados da Empresa</legend>
                    <hr className="mb-4"/>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Renda Mensal
                            </label>
                            <input 
                                value={watch("monthlyIncome")?.toString()}
                                {...register("monthlyIncome", {required: true})}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.monthlyIncome && <span className="text-red-500">Renda Mensal é obrigatório.</span>}
                        </div>
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Link de Rede Social
                            </label>
                            <input
                                type="text"
                                {...register("socialMediaLink", {required: true})}
                                placeholder=""
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Sobre
                        </label>
                        <textarea
                            { ...register("about", {required: true})}
                            placeholder=""
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                            {watch("about")}
                        </textarea>
                        {errors.about && <span className="text-red-500">Sobre inválido.</span>}
                    </div>
                </fieldset>
                <fieldset>
                    <legend className="text-xl">Documentos Pessoais</legend>
                    <hr className="mb-4" />
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Tipo de Documento:
                        </label>
                        <select 
                            { ...register("type", {required: true})}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                            <option value="">-- Selecione --</option>
                            <option value={MandatoryDocumentType.RG}>RG</option>
                            <option value={MandatoryDocumentType.CNH}>CNH</option>
                        </select>
                        {errors.type && <span className="text-red-500">Campo obrigatório.</span>}
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Selfie com Documento
                        </label>
                        <input
                            type="file"
                            {...register("selfie", {required: true})}
                            placeholder=""
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Frente
                        </label>
                        <input
                            type="file"
                            {...register("front", {required: true})}
                            placeholder=""
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Verso
                        </label>
                        <input
                            type="file"
                            {...register("back", {required: true})}
                            placeholder=""
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Comprovante de Endereço
                        </label>
                        <input
                            type="file"
                            {...register("address", {required: true})}
                            placeholder=""
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                </fieldset>
                <fieldset>
                    <legend className="text-xl">Documentos da Empresa</legend>
                    <hr className="mb-4" />
                    {(bankAccountCtx?.bankAccount?.typeCompany == "ltda" || bankAccountCtx?.bankAccount?.typeCompany == "eireli" || bankAccountCtx?.bankAccount?.typeCompany == "slu") && 
                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Contrato Social
                            </label>
                            <input
                                type="file"
                                {...register("lastContract", {required: true})}
                                placeholder=""
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                    }
                    {(bankAccountCtx?.bankAccount?.typeCompany == "individualEntrepreneur" || bankAccountCtx?.bankAccount?.typeCompany == "mei") &&
                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Documento CNPJ
                            </label>
                            <input
                                type="file"
                                {...register("cnpjCard", {required: true})}
                                placeholder=""
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                    }
                    {(bankAccountCtx?.bankAccount?.typeCompany == "association" || bankAccountCtx?.bankAccount?.typeCompany == "sa") &&
                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Ata de eleição da diretoria.
                            </label>
                            <input
                                type="file"
                                {...register("electionRecord", {required: true})}
                                placeholder=""
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                    }
                    {(bankAccountCtx?.bankAccount?.typeCompany == "association" || bankAccountCtx?.bankAccount?.typeCompany == "sa") &&
                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Estatuto
                            </label>
                            <input
                                type="file"
                                {...register("statute", {required: true})}
                                placeholder=""
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                    }
                </fieldset>
                <div className="mb-6">
                    {apiError.length > 0 && 
                        <ErrorAlert message={apiError.join(',')} action={() => setApiError([])} />
                    }
                </div>
                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                    disabled={sendingToApi}    
                >
                    {sendingToApi 
                        ? <span className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></span>
                        : "Salvar"
                    }
                </button>
            </div>
        </form>
    </div>
}