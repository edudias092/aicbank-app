import { useNavigate } from 'react-router-dom';
import { ChargeDTO, getActualValue, getPayDay, getPaymentMethodDescription, getStatusName, isDue} from '../../types/charge';
import { BiFile, BiXCircle, BiPlusCircle, BiAlarmExclamation, BiError } from "react-icons/bi";

export type TabelaCobrancasProps = {
  periodDescription: string,
  charges?: ChargeDTO[],
  selectCancelCharge: (id: string) => void
}

export const TabelaCobrancas = ({periodDescription, charges, selectCancelCharge} : TabelaCobrancasProps) => {
  const navigate = useNavigate();

  const viewFatura = (id: number) => {
    if(charges){
      var charge = charges[id];
  
      if(charge){
        window.open(charge.paymentLink, "_blank")
      }
    }
  }
  
  const goToDetalhes = (id: string) => {
    if(id.trim() != ""){
      navigate(`/cobrancas/detalhe-cobranca/${id}`)
    }
  }
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3">
                  Valor
                </th>
                <th scope="col" className="px-6 py-3">
                  Descrição
                </th>
                <th scope="col" className="px-6 py-3">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3">
                  Vencimento
                </th>
                <th scope="col" className="px-6 py-3">
                  Forma de Pagamento
                </th>
                <th scope="col" className="px-6 py-3">
                  Ações
                </th>
            </tr>
        </thead>
        <tbody>
          {(charges && charges?.length > 0) ? charges?.map((charge, key) => (
            <tr key={key} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {charge.Customer?.name}
                </th>
                <td className="px-6 py-4">
                  {getActualValue(charge.value)}
                </td>
                <td className="px-6 py-4">
                  {charge.additionalInfo ? charge.additionalInfo : "-"}
                </td>
                <td className="px-6 py-4">
                  {getStatusName(charge.status)}
                </td>
                <td className="px-3 py-4 text-md">
                  <span className='leading-4'>{getPayDay(charge)}</span>
                  {isDue(charge) && 
                    <BiError className="text-warning cursor-pointer inline leading-4" title="Esta cobrança está vencida"/>
                  }
                </td>
                <td className="px-6 py-4">
                  {getPaymentMethodDescription(charge.mainPaymentMethodId)}
                </td>
                <td className="px-6 py-4">
                <p className="flex">
                  <button type='button' onClick={() => goToDetalhes(charge.myId)}>
                    <BiPlusCircle title='Ver Detalhes' className='cursor-pointer border-2 rounded-md mx-1' size={30}/>
                  </button>
                  <button type='button' onClick={() => viewFatura(key)}>
                    <BiFile title='Visualizar Fatura' className='cursor-pointer border-2 rounded-md mx-1' size={30}/>
                  </button>
                  <button type='button' onClick={() => selectCancelCharge(charge.myId)}>
                    <BiXCircle title='Cancelar Cobrança' className='cursor-pointer text-danger border-2 rounded-md mx-1' size={30}/>
                  </button>
                </p>
                </td>
            </tr>
          )):
          <tr className="bg-white text-center text-lg border-t border-slate-100">
              <td className="py-4" colSpan={6}>
                Nenhuma cobrança encontrada
              </td>
          </tr>
          }
        </tbody>
    </table>
    </div>
  );
};
