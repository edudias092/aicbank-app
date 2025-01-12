import { useEffect, useRef, useState } from "react";
import { ConfigService } from "../../common/services/ConfigService";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "../../common/utilities/authFunctions";
import { CelcashBankAccountDto } from "../../types/celcashBankAccountDto";
import { OverlayPanel } from "primereact/overlaypanel";
import { FilterMatchMode } from "primereact/api";
import { Toast } from "primereact/toast";

export const Subcontas = () => {
    const navigate = useNavigate();

    const configService = new ConfigService();

    const [sendingToApi, setSendingToApi] = useState(false);
    const [bankAccounts, setBankAccounts] = useState<CelcashBankAccountDto[]>();
    const op = useRef(null);    
    const [selectedBankAccount, setSelectedBankAccount] = useState<CelcashBankAccountDto>();
    const [filters, ] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        "Verification.status": { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        document: { value: null, matchMode: FilterMatchMode.CONTAINS },
        emailContact: { value: null, matchMode: FilterMatchMode.CONTAINS },
        "ApiAuth.galaxId": { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const toast = useRef<Toast>(null);
    const showToast = (detail: string, severity: "success" | "info" | "warn" | "error" | "secondary" | "contrast" | undefined, summary: string) => {
        if(toast?.current)
            toast.current.show({detail, severity, summary})
    }

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
            case "approved": return <span className="text-success">Aprovada</span>
            case "denied": return <span className="text-danger">Negada</span>
            case "pending": return <span className="text-warning">Pendente</span>
            case "analyzing": return <span className="text-primary">Analisando</span>
            case "empty": return "Vazia"
        }
    }

    const mostrarOverlayPanel = (e: any, selectedBankAccount: CelcashBankAccountDto) =>  {
        setSelectedBankAccount(selectedBankAccount);
        if(op?.current){
            (op.current as any).toggle(e);
        }
    }

    const checkSubaccountStatus = async (galaxId: number, approve: boolean) => {
        setSendingToApi(s => s = true);
        
        try{

            const result = await configService.checkSubAccount(galaxId, approve);
            
            if(result.data){
                showToast("Sucesso", "success", "Operação realizada com sucesso!")
            }
            else{
                showToast("Erro", "error", result.errors.join(','))
            }
        }
        catch(e) {
            console.log(e);
            showToast("Erro", "error", "Erro inesperado")

        }

        setSendingToApi(s => s = false);
    }

    return <>
        <Breadcrumb pageName="Subcontas" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-2">
            <div className="card p-2">
                <DataTable value={bankAccounts} 
                    tableStyle={{ minWidth: '50rem' }} 
                    size='small' 
                    loading={sendingToApi}
                    paginator 
                    rows={10} 
                    dataKey="id" 
                    filters={filters} 
                    emptyMessage='Nenhum registro encontrado'
                    scrollable>
                    <Column field="Verification.status" filter filterPlaceholder="Pesquisar" header="Status" body={(b) => getSubAccountStatus(b.Verification.status)} sortable style={{minWidth: '150px'}}></Column>
                    <Column field="" header="Razões Status" body={b => {
                        return <>{ (b as CelcashBankAccountDto).Verification?.reasons?.length > 0 
                            ? <button className="rounded bg-success py-1 px-4 font-medium text-gray hover:bg-opacity-90" 
                                        type="button" onClick={e => mostrarOverlayPanel(e, b)}>Ver</button>
                            : "-"
                        }</>
                    }} sortable style={{minWidth: '150px'}}></Column>
                    <Column field="name" filter filterPlaceholder="Pesquisar" header="Nome" sortable style={{minWidth: '150px'}}></Column>
                    <Column field="document" filter filterPlaceholder="Pesquisar"  header="CPF/CNPJ" sortable style={{minWidth: '150px'}}></Column>
                    <Column field="emailContact" filter filterPlaceholder="Pesquisar" header="E-mail" sortable style={{minWidth: '150px'}}></Column>
                    <Column field="ApiAuth.galaxId" filter filterPlaceholder="Pesquisar"  header="GalaxId" sortable style={{minWidth: '150px'}}></Column>
                    <Column field="ApiAuth.galaxHash" header="GalaxHash" sortable style={{minWidth: '150px'}}></Column>
                    <Column field="" header="Ações" style={{minWidth: '150px'}} frozen body={(b) => {
                        
                        if(b.Verification.status == 'approved'){
                            return <button 
                                className="rounded bg-success py-1 px-4 font-medium text-gray hover:bg-opacity-90" 
                                onClick={() => checkSubaccountStatus(b.ApiAuth.galaxId, true)}
                            >
                                Aprovar
                            </button>
                        }
                        if(b.Verification.status == 'pending'){
                            return <button
                                className="rounded bg-danger py-1 px-4 font-medium text-gray hover:bg-opacity-90" 
                                onClick={() => checkSubaccountStatus(b.ApiAuth.galaxId, false)}
                            >
                                Retornar
                            </button>
                        }

                        return ''
                    }}></Column>
                </DataTable>
            </div>
            
            <OverlayPanel ref={op} showCloseIcon closeOnEscape dismissable={false} style={{maxWidth: "25%"}}>
                <ul className="p-2 text-sm
                ">
                    {selectedBankAccount?.Verification?.reasons?.map((reason, i) => {
                        return <li className="list-disc m-1" key={i}>{reason}</li>
                    })}
                </ul>
            </OverlayPanel>
            <Toast ref={toast} />
        </div>
    </>
}