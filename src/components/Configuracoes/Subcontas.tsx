import { useEffect, useState } from "react";
import { ConfigService } from "../../common/services/ConfigService";
import { BankAccountDTO } from "../../types/bankaccount";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "../../common/utilities/authFunctions";

export const Subcontas = () => {
    const navigate = useNavigate();

    const configService = new ConfigService();

    const [sendingToApi, setSendingToApi] = useState(false);
    const [bankAccounts, setBankAccounts] = useState<BankAccountDTO[]>();

    const getContas = async () => {
        setSendingToApi(s => s = true);
        
        try{

            const result = await configService.getSubAccounts();
            
            if(result.data){
                setBankAccounts(result.data);
            }
        }
        catch(e) {
            console.log(e);
        }

        setSendingToApi(s => s = false);
    }

    useEffect(() => {

        if(!isAdmin()){
            navigate("/conta");
            return;
        }
        
        
        getContas()
            .then()
            .catch(e => console.log(e));

    },[])
    
    const getSubAccountStatus = (status: "approved" | "denied" | "pending" | "analyzing" | "empty") => {
        switch(status){
            case "approved": return "Aprovada"
            case "denied": return "Negada"
            case "pending": return "Pendente"
            case "analyzing": return "Analisando"
            case "empty": return "Vazia"
        }
    }

    return <>
        <Breadcrumb pageName="Subcontas" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-2">
            <div className="card p-2">
                <DataTable value={bankAccounts} tableStyle={{ minWidth: '50rem' }} size='small' loading={sendingToApi}
                emptyMessage='Nenhum registro encontrado'>
                    <Column field="name" header="Nome" style={{ width: '10%'}} sortable></Column>
                    <Column field="document" header="CPF/CNPJ" sortable ></Column>
                    <Column field="emailContact" header="E-mail" sortable ></Column>
                    <Column field="ApiAuth.galaxId" header="GalaxId" sortable ></Column>
                    <Column field="ApiAuth.galaxHash" header="GalaxHash" sortable ></Column>
                    <Column field="Verification.status" header="Status" body={(status) => getSubAccountStatus(status)} sortable></Column>
                </DataTable>
            </div>
        </div>
    </>
}