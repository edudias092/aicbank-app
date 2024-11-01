import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { BankAccountService } from "../../common/services/BankAccountService";
import { professions } from "../../common/utilities/professions";
import { states } from "../../common/utilities/states";
import { ContaContext } from "../../contexts/ContaContextProvider";
import { BankAccountDTO, TypeBankAccount } from "../../types/bankaccount";
import { ResponseDTO } from "../../types/ResponseDTO";
import { ErrorAlert } from "../Alerts";
import { getAccountUserEmail, getAccountUserId, tokenIsExpired } from "../../common/utilities/authFunctions";
import { useNavigate } from "react-router-dom";

export const FormCadastro = () => {
    const bankAccountCtx = useContext(ContaContext);
    
    const [apiError, setApiError] = useState<string[]>([]);
    const [sendingToApi, setSendingToApi] = useState(false);
    const { register, setValue, formState: {errors, isValid}, handleSubmit, reset, watch  } = useForm<BankAccountDTO>();
    const navigate = useNavigate();
    
    const userId = getAccountUserId();
    const email = getAccountUserEmail() ?? '';
    const bankAccountService = new BankAccountService();

    const updateAccount = async (data: BankAccountDTO) => {
        if(isValid){
            setSendingToApi(s => s = true);
            let result: string[] | ResponseDTO<BankAccountDTO>;

            data.type = parseInt(data.type.toString());

            if(!bankAccountCtx?.bankAccount)
                result = await bankAccountService.createAccount(data);
            else
                result = await bankAccountService.updateAccount(data);          

            const response = result as ResponseDTO<BankAccountDTO>
            
            if(Array.isArray(response)){
                console.log("Erros:", response);
                setApiError(response as string[]);
            }
            else {
                
                bankAccountCtx?.setBankAccount(response.data);
                
            }
        }

        console.log('formdata', data);
        setSendingToApi(false);
    }

    const getAccount = async (userId: number | null) => {
        console.log(email);
        if(!userId || !email || tokenIsExpired()){
            navigate("/login");
            return;
        }

        if(bankAccountCtx != null && bankAccountCtx?.bankAccount == undefined){
            const response = await bankAccountService.getAccountByUserId(userId)
            
            bankAccountCtx.setBankAccount(response.data)
            reset(response.data);
        }
        else
        {
            reset(bankAccountCtx?.bankAccount);
        }
    }

    useEffect(() => {
        getAccount(userId).then().catch(e => console.log(e));

    },[])


    return <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
                1. Cadastro
            </h3>
        </div>
        <form onSubmit={handleSubmit(updateAccount)}>
            <input type="hidden" {...register("type")} defaultValue={TypeBankAccount.PJ} />
            <div className="p-6.5">
                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                        Razão Social
                    </label>
                    <input
                        {...register("name", {required: true})}
                        type="text"
                        placeholder=""
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {errors.name && <span className="text-red-500">Nome Fantasia é obrigatório.</span>}
                </div>
                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                        Nome Fantasia
                    </label>
                    <input
                        {...register("nameDisplay", {required: true})}
                        type="text"
                        placeholder=""
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {errors.name && <span className="text-red-500">Nome Fantasia é obrigatório.</span>}
                </div>
                
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Documento (CNPJ):
                        </label>
                        <IMaskInput mask="00.000.000/0000-00" 
                            value={watch("document")}
                            {...register('document', {required: true})} 
                            onAccept={(_, mask) => { setValue("document", mask.unmaskedValue)}}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />

                        {errors.document && <span className="text-red-500">Documento é obrigatório.</span>}
                    </div>
                    <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Documento do Responsável (CPF):
                        </label>
                        <IMaskInput mask="000.000.000-00" 
                            value={watch("responsibleDocument")}
                            {...register('responsibleDocument', {required: true})} 
                            onAccept={(_, mask) => { setValue("responsibleDocument", mask.unmaskedValue)}}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />

                        {errors.document && <span className="text-red-500">Documento é obrigatório.</span>}
                    </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                            CNAE:
                        </label>
                        <input
                            type="text"
                            {...register("cnae", {required: true})}
                            placeholder=""
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {errors.cnae && <span className="text-red-500">CNAE é obrigatório.</span>}
                    </div>
                    <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Tipo de empresa:
                        </label>
                        <select 
                            { ...register("typeCompany", {required: true})}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                            <option value="">-- Selecione --</option>
                            <option value="ltda">LTDA</option>
                            <option value="eireli">Eireli</option>
                            <option value="association">Associações/Condomínios</option>
                            <option value="individualEntrepreneur">Empresário individual</option>
                            <option value="mei">MEI</option>
                            <option value="sa">S/A</option>
                            <option value="slu">SLU</option>
                        </select>
                        {errors.cnae && <span className="text-red-500">Tipo de empresa é obrigatório.</span>}
                    </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Celular / Telefone
                        </label>
                        <IMaskInput 
                            mask="(00) 00000-0000"
                            value={watch("phone")}
                            onAccept={(_,mask) => setValue("phone", mask.unmaskedValue)}
                            {...register("phone", {required: true})}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {errors.phone && <span className="text-red-500">Telefone é obrigatório.</span>}
                    </div>
                    <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Email <span className="text-meta-1">*</span>
                        </label>
                        <input
                            type="email"
                            { ...register("emailContact", {required: true, pattern:/^[a-z0-9\.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/g})}
                            placeholder=""
                            readOnly
                            value={email}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {errors.emailContact && <span className="text-red-500">Email inválido.</span>}
                    </div>
                </div>

                {false && <>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Descrição Suave
                        </label>
                        <input
                            type="text"
                            {...register("softDescriptor", {required: true})}
                            placeholder=""
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Nome Fatura
                        </label>
                        <input
                            type="text"
                            {...register("softDescriptor", {required: true})}
                            placeholder=""
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                </>}

                <fieldset>
                    <legend className="text-xl">Endereço</legend>
                    <hr className="text-slate-300 my-2"/>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">
                            CEP <span className="text-meta-1">*</span>
                        </label>
                        <IMaskInput
                            mask="00000-000"
                            value={watch("Address.zipCode")}
                            {...register("Address.zipCode", {required: true})}
                            onAccept={(_, mask) => setValue("Address.zipCode", mask.unmaskedValue)}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {errors.Address?.zipCode && <span className="text-red-500">CEP é obrigatório.</span>}

                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-2/3">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Rua:
                            </label>
                            <input
                                type="text"
                                { ...register("Address.street", {required: true})}
                                placeholder=""
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.Address?.street && <span className="text-red-500">Rua é obrigatório.</span>}

                        </div>
                        <div className="w-full xl:w-1/3">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Número
                            </label>
                            <input
                                type="text"
                                {...register("Address.number", {required: true})}
                                placeholder=""
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.Address?.number && <span className="text-red-500">Número é obrigatório.</span>}

                        </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-2/3">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Bairro
                            </label>
                            <input
                                type="text"
                                {...register("Address.neighborhood", {required: true})}
                                placeholder=""
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.document && <span className="text-red-500">Bairro é obrigatório.</span>}

                        </div>
                        <div className="w-full xl:w-1/3">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Complemento:
                            </label>
                            <input
                                type="text"
                                { ...register("Address.complement", {required: false})}
                                placeholder=""
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Cidade
                            </label>
                            <input
                                type="text"
                                {...register("Address.city", {required: true})}
                                placeholder=""
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.Address?.city && <span className="text-red-500">Cidade é obrigatório.</span>}
                        </div>
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Estado:
                            </label>
                            <select 
                                { ...register("Address.state", {required: true})}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            >
                                <option value="">-- Selecione --</option>
                                {states.map((s, k) => <option key={k} value={s.acronym}>{s.name}</option>)}
                            </select>
                            {errors.Address?.state && <span className="text-red-500">CEP é obrigatório.</span>}
                        </div>
                    </div>
                </fieldset>
                <hr className="text-slate-300 my-2"/>
                
                {false && <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Profissão:
                        </label>
                        <select 
                            { ...register("Professional.internalName", {required: false})}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                            <option value="">-- Selecione --</option>
                            {professions.map((p, k) => <option key={k} value={p.name}>{p.display}</option>)}
                        </select>
                        {errors.Professional?.internalName && <span className="text-red-500">Profissão é obrigatório.</span>}

                    </div>
                    <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Inscrição do profissional (CREA, OAB, CRM, etc...): <span className="text-meta-1">*</span>
                        </label>
                        <input
                            type="text"
                            { ...register("Professional.inscription", {required: false})}
                            placeholder=""
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {errors.Professional?.inscription && <span className="text-red-500">Inscrição é obrigatório.</span>}
                        
                    </div>
                </div>}
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