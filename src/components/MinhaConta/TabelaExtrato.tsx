import { DataTable } from 'primereact/datatable';
import { BalanceDTO } from '../../types/bankStatement';
import { Column } from 'primereact/column';
import { getGroupPaymentTypes, getPaymentTypes } from '../../common/utilities/movementTypes';

export type TabelaExtratoProps = {
  periodDescription: string,
  balances?: BalanceDTO[]
}

export const TabelaExtrato = ({periodDescription, balances} : TabelaExtratoProps) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      
      <div className="py-2 px-2 md:px-6 xl:px-7.5">
        <h4 className="text-lg font-semibold text-black dark:text-white">
         { periodDescription.length > 0 ? `Período - ${periodDescription}` : ""}
        </h4>
      </div>

      <DataTable value={balances} tableStyle={{ minWidth: '50rem' }} size='small' emptyMessage='Nenhum registro encontrado'>
        {/* <Column field="createdAt" header="Data" body={(b) => (b.createdAt as Date).toLocaleDateString() } sortable style={{ width: '25%' }}></Column> */}
        <Column field="createdAt" header="Data" sortable style={{ width: '25%' }}></Column>
        <Column field="friendlyDescription" header="Descrição" sortable style={{ width: '25%' }}></Column>
        <Column field="value" header="Valor" body={(b) => "R$ "+b.value.toFixed(2).toLocaleString()} sortable style={{ width: '25%' }}></Column>
        <Column field="groupPaymentType" header="Grupo Movimentação" body={b => getPaymentTypes(b.groupPaymentType)} sortable style={{ width: '25%' }}></Column>
        {/* <Column field="groupPaymentType" header="Grupo Movimentação" sortable style={{ width: '25%' }}></Column> */}
        {/* <Column field="paymentType" header="Tipo Movimentação" sortable style={{ width: '25%' }}></Column> */}
        <Column field="paymentType" header="Tipo Movimentação" body={b => getGroupPaymentTypes(b.paymentType)} sortable style={{ width: '25%' }}></Column>
      </DataTable> 
    </div>
  );
};
