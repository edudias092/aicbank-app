import Breadcrumb from "../Breadcrumbs/Breadcrumb"
import { ProgressoConta } from "./ProgressoConta";
import { FormCadastro } from "./FormCadastro";
import { useContext, useEffect } from "react";
import { ContaContext } from "../../contexts/ContaContextProvider";
import { StatusBankAccount } from "../../types/bankaccount";
import { getAccountUserId, tokenIsExpired } from "../../common/utilities/authFunctions";
import { useNavigate } from "react-router-dom";
import { BankAccountService } from "../../common/services/BankAccountService";
import { FormDocumentos } from "./FormDocumentos";
import { FormAnalise } from "./FormAnalise";


export const Resumo = () => {
    const bankAccountCtx = useContext(ContaContext);
    const userId = getAccountUserId();
    const navigate = useNavigate();
    const bankAccountService = new BankAccountService();

    const getAccount = async (userId: number | null) => {
        
        if(!userId || tokenIsExpired()){
            navigate("/login");
            return;
        }

        if(bankAccountCtx != null && bankAccountCtx?.bankAccount == undefined){
            const response = await bankAccountService.getAccountByUserId(userId)
            
            bankAccountCtx.setBankAccount(response.data)
        }
    }

    useEffect(() => {
        getAccount(userId).then().catch(e => 
            console.log(e)
        );
    })

    return <>
        <Breadcrumb pageName="Resumo" />
        <ProgressoConta />

        <div className="flex flex-col gap-9">
            {(bankAccountCtx?.bankAccount == undefined || bankAccountCtx?.bankAccount?.status == StatusBankAccount.Pending) && 
                <FormCadastro />
            }
            {bankAccountCtx?.bankAccount != undefined && bankAccountCtx?.bankAccount?.status == StatusBankAccount.PendingDocuments &&
                <FormDocumentos />
            }
            {bankAccountCtx?.bankAccount != undefined && bankAccountCtx?.bankAccount?.status == StatusBankAccount.PendingAnalysis &&
                <FormAnalise />
            }
            {bankAccountCtx?.bankAccount != undefined && bankAccountCtx?.bankAccount?.status == StatusBankAccount.Activated &&
                <FormCadastro readonly />
            }
        </div>
    </>
}