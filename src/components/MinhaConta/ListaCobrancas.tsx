import { useContext, useEffect, useState } from "react";
import { BankAccountService } from "../../common/services/BankAccountService"
import Breadcrumb from "../Breadcrumbs/Breadcrumb"
import { ContaContext } from "../../contexts/ContaContextProvider";
import { useForm } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import { getAccountUserEmail, getAccountUserId, tokenIsExpired } from "../../common/utilities/authFunctions";
import { useNavigate } from "react-router-dom";
import { TabelaCobrancas } from "./TabelaCobrancas";
import { ChargeDTO, getActualValue, getPayDay } from "../../types/charge";
import { CustomModal } from "../../common/components/CustomModal";

export type BankChargeFilter = {
    initialDate: Date,
    initialDateString: string,
    finalDate: Date,
    finalDateString: string
}

export const ListaCobranças = () => {
    const bankAccountService = new BankAccountService();
    const bankAccountCtx = useContext(ContaContext);
    
    const { formState: {errors, isValid}, register, setValue, handleSubmit, watch  } = useForm<BankChargeFilter>();
    
    const [selectingInitialDate, setSelectingInitialDate] = useState(false);
    const [selectingFinalDate, setSelectingFinalDate] = useState(false);
    const [sendingToApi, setSendingToApi] = useState(false);
    const [charges, setCharges] = useState<ChargeDTO[]>();
    const [periodDescription, setPeriodDescription] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [cancelCharge, setCancelCharge] = useState<ChargeDTO>();
    
    const navigate = useNavigate();
    const userId = getAccountUserId();
    const email = getAccountUserEmail() ?? '';
    
    const getCobrancas = async (data: BankChargeFilter | null = null) => {
        if(bankAccountCtx?.bankAccount && (data === null || isValid)){
            setSendingToApi(s => s = true);
            
            try{

                const result = await bankAccountService.getCharges(bankAccountCtx?.bankAccount?.id, data);
                
                if(result.data){
                    setCharges(result.data);
                }

                setPeriodDescription(`${data?.initialDateString} - ${data?.finalDateString}`)
            }
            catch(e) {
                console.log(e);
            }

            setSendingToApi(s => s = false);
        }
    }

    const selectFinalDate = (d: Date | undefined) => {
        const newDate = d ?? new Date();
        setValue("finalDate", newDate); 
        setValue("finalDateString", newDate.toLocaleDateString()); 
        setSelectingFinalDate(false);
    }
    
    const selectInitialDate = (d: Date | undefined) => {
        const newDate = d ?? new Date();
        setValue("initialDate", newDate); 
        setValue("initialDateString", newDate.toLocaleDateString()); 

        setSelectingInitialDate(false);
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

    const addCobranca = () => {
        navigate("nova-cobranca")
    }

    useEffect(() => {
        getAccount(userId).then().catch(e => console.log(e));

        setValue("initialDate", new Date())
        setValue("finalDate", new Date())

        getCobrancas(null).then().catch(e => console.log(e));
    },[bankAccountCtx?.bankAccount])

    const showCancelDialog = (id: string) => {
        const selectedCharge = charges?.find(c => c.myId == id);

        if(selectedCharge){
            setCancelCharge(selectedCharge);
            setShowModal(true);
        }
    }
    
    const confirmCancelCharge = async () => {
        if(bankAccountCtx?.bankAccount && cancelCharge){
            setSendingToApi(s => s = true);
            
            try{

                const result = await bankAccountService.cancelCharge(bankAccountCtx?.bankAccount, cancelCharge.myId);
                
                if(result){
                    setCharges(charges?.filter(c => c.myId !== cancelCharge.myId));
                    setCancelCharge(undefined);
                    setShowModal(false);
                }
            }
            catch(e) {
                console.log(e);
            }

            setSendingToApi(s => s = false);
        }
    }

    return <>
        <Breadcrumb pageName="Cobranças" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                    Filtro
                </h3>
            </div>
            <form onSubmit={handleSubmit(getCobrancas)}>
                <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row items-end">
                        <div className="w-full xl:w-1/4 flex-1">
                            <div className="container position-relative">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Data Inicial:
                                </label>
                                <input type="text" 
                                    defaultValue={new Date().toLocaleDateString()}
                                    value={watch("initialDateString")}
                                    {...register('initialDateString', {required: true})} 
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    onFocus={_ => { setSelectingInitialDate(true); }}
                                />
                                {selectingInitialDate && 
                                    <DayPicker
                                            captionLayout="dropdown"
                                            style={ {position: "absolute", top:370, backgroundColor:"white", padding: 10, border:1}}
                                            mode="single"
                                            selected={watch("initialDate")}
                                            onSelect={e => selectInitialDate(e)}
                                            defaultMonth={new Date()}
                                        />
                                }

                                {errors.initialDateString && <span className="text-red-500">Data Inicial é obrigatório.</span>}
                            </div>
                        </div>
                        <div className="w-full xl:w-1/4 flex-1">
                            <div className="container position-relative">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Data Final:
                                </label>
                                <input type="text" 
                                    defaultValue={new Date().toLocaleDateString()}
                                    value={watch("finalDateString")}
                                    {...register('finalDateString', {required: true})} 
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    onFocus={_ => { setSelectingFinalDate(true);}}
                                />
                                {selectingFinalDate && 
                                    <DayPicker
                                            captionLayout="dropdown"
                                            style={ {position: "absolute", top:370, right: 150, backgroundColor:"white", padding: 10, border:1}}
                                            mode="single"
                                            selected={watch("finalDate")}
                                            onSelect={e => selectFinalDate(e)}
                                            defaultMonth={new Date()}
                                        />
                                }

                                {errors.initialDateString && <span className="text-red-500">Data Inicial é obrigatório.</span>}
                            </div>
                        </div>
                        <div className="w-full xl:w-1/4">
                            <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                                disabled={sendingToApi}    
                            >
                                {sendingToApi 
                                    ? <span className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></span>
                                    : "Pesquisar"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            
        </div>
        
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-2">
            <div className="flex justify-end p-4">
                <button className="flex justify-center rounded bg-primary py-1 px-4 font-medium text-gray hover:bg-opacity-90"
                    disabled={sendingToApi} onClick={addCobranca}
                >
                    Adicionar Cobrança
                </button>
            </div>
            <TabelaCobrancas periodDescription={periodDescription} charges={charges} selectCancelCharge={showCancelDialog} />
            {showModal && 
            <CustomModal title="Cancelar Cobrança" onRequestClose={() => setShowModal(false)} onConfirm={confirmCancelCharge}>
                <p className="text-xl mt-6">Confirma o cancelamento da cobrança?</p>
                <div className="mt-1">
                    <b>Nome:</b> {cancelCharge?.Customer.name}<br/>
                    <b>Valor:</b> {getActualValue(cancelCharge?.value)}<br/>
                    <b>Data de Vencimento:</b> {getPayDay(cancelCharge)}
                </div>
            </CustomModal>}
        </div>
    </>
}