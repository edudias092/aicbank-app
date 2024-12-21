import { DataTable } from 'primereact/datatable';
import { BalanceDTO } from '../../types/bankStatement';
import { Column } from 'primereact/column';
import { getGroupPaymentTypes, getPaymentTypes } from '../../common/utilities/movementTypes';
import { useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';

export type TabelaExtratoProps = {
  periodDescription: string,
  balances?: BalanceDTO[]
}

export const TabelaExtrato = ({periodDescription, balances} : TabelaExtratoProps) => {
  const [filters, setFilters] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      createdAt: { value: null, matchMode: FilterMatchMode.DATE_AFTER },
      groupPaymentType: { value: null, matchMode: FilterMatchMode.CONTAINS },
      paymentType: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      let _filters = { ...filters };

      // @ts-ignore
      _filters['global'].value = value;

      setFilters(_filters);
      setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
        <div className="flex justify-content-end">
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Busca" />
            </IconField>
        </div>
    );
};

const header = renderHeader()

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      
      <div className="p-4">
        <h4 className="text-lg font-semibold text-black dark:text-white">
         { periodDescription.length > 0 ? `Período - ${periodDescription}` : ""}
        </h4>
      </div>

      <div className="px-2">
        <DataTable value={balances} tableStyle={{ minWidth: '50rem' }}
                  sortField="createdAt" sortOrder={-1} 
                  paginator rows={10} dataKey="id" filters={filters} 
                  globalFilterFields={['createdAt', 'groupPaymentType', 'paymentType']}
                  header={header}
                  size='small' 
                  emptyMessage='Nenhum registro encontrado' 
                  filterLocale='pt'>
          <Column field="createdAt" header="Data" filter filterPlaceholder="Pesquisar Data" 
            body={b => new Date(b.createdAt).toLocaleString()} sortable>  
          </Column>
          <Column field="friendlyDescription" header="Descrição" sortable></Column>
          <Column field="value" header="Valor" body={(b) => {
              return <>
                { (b.value < 0)
                    ? <span className='text-danger'>{"R$ "+b.value.toFixed(2).toLocaleString()}</span>
                    : <span className='text-success'>{"R$ "+b.value.toFixed(2).toLocaleString()}</span>
                }
              </>
            }} sortable style={{ width: '20%' }}>
          </Column>
          <Column field="groupPaymentType" filter filterPlaceholder="Pesquisar Grupo Movimentação" header="Grupo Movimentação" body={b => getGroupPaymentTypes(b.groupPaymentType)} sortable style={{ width: '20%' }}></Column>
          <Column field="paymentType" filter filterPlaceholder="Pesquisar Tipo Movimentação" header="Tipo Movimentação" body={b => getPaymentTypes(b.paymentType)} sortable style={{ width: '20%' }}></Column>
        </DataTable> 
      </div>
    </div>
  );
};
