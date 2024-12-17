import { useNavigate } from 'react-router-dom';
import { ChargeDTO, getActualValue, getPayDay, getPaymentMethodDescription, getStatusName, isDue} from '../../types/charge';
import { BiFile, BiXCircle, BiPlusCircle, BiAlarmExclamation, BiError } from "react-icons/bi";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export type TabelaCobrancasProps = {
  periodDescription: string,
  charges?: ChargeDTO[],
  selectCancelCharge: (id: string) => void
}

export const TabelaCobrancas = ({periodDescription, charges, selectCancelCharge} : TabelaCobrancasProps) => {
  const navigate = useNavigate();

  const viewFatura = (charge: ChargeDTO) => {
      if(charge){
        window.open(charge.paymentLink, "_blank")
      }
  }
  
  const goToDetalhes = (id: string) => {
    if(id.trim() != ""){
      navigate(`/cobrancas/detalhe-cobranca/${id}`)
    }
  }

  const actionsTemplate = (charge: ChargeDTO): any => {
    return <>
      <p className="flex">
        <button type='button' onClick={() => goToDetalhes(charge.myId)}>
          <BiPlusCircle title='Ver Detalhes' className='cursor-pointer border-2 rounded-md mx-1' size={30}/>
        </button>
        <button type='button' onClick={() => viewFatura(charge)}>
          <BiFile title='Visualizar Fatura' className='cursor-pointer border-2 rounded-md mx-1' size={30}/>
        </button>
        <button type='button' onClick={() => selectCancelCharge(charge.myId)}>
          <BiXCircle title='Cancelar Cobrança' className='cursor-pointer text-danger border-2 rounded-md mx-1' size={30}/>
        </button>
      </p>
    </>
  }

  return (
      <div className="card p-2">
          <DataTable value={charges} tableStyle={{ minWidth: '50rem' }} size='small' emptyMessage='Nenhum registro encontrado'>
              <Column field="Customer.name" header="Nome" body={(charge) => charge.Customer?.name } sortable style={{ width: '25%' }}></Column>
              <Column field="value" header="Valor" body={(charge) => getActualValue(charge.value)} sortable style={{ width: '25%' }}></Column>
              <Column field="additionalInfo" header="Descrição" body={(charge) => charge.additionalInfo ? charge.additionalInfo : "-"} sortable style={{ width: '25%' }}></Column>
              <Column field="status" header="Status" body={(charge) => getStatusName(charge.status)} sortable style={{ width: '25%' }}></Column>
              <Column field="mainPaymentMethodId" header="Forma de Pagamento" body={(charge) => getPaymentMethodDescription(charge.mainPaymentMethodId)} sortable style={{ width: '25%' }}></Column>
              <Column field="paydate" header="Data Vencimento" body={(charge) => <>
                <span className='leading-4'>{getPayDay(charge)}</span>
                  {isDue(charge) && 
                    <BiError className="text-warning cursor-pointer inline leading-4" title="Esta cobrança está vencida"/>
                  }
                </>} 
              sortable style={{ width: '25%' }}></Column>
              <Column field="id" header="Ações" body={(charge) => actionsTemplate(charge)} sortable style={{ width: '25%' }}></Column>
          </DataTable>
      </div>
  );
};
