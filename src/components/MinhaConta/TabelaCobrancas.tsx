import { useNavigate } from 'react-router-dom';
import { ChargeDTO, PaymentMethods } from '../../types/charge';
import { BiFile, BiXCircle, BiPlusCircle } from "react-icons/bi";

export type TabelaCobrancasProps = {
  periodDescription: string,
  charges?: ChargeDTO[]
}

export const TabelaCobrancas = ({periodDescription, charges} : TabelaCobrancasProps) => {
  const navigate = useNavigate();

  const getPaymentMethodDescription = (paymentMethod: PaymentMethods) => {
    switch(paymentMethod){
      case 'creditcard':
        return "Cartão de crédito";
      case 'boleto':
        return "Boleto Bancário/Pix";
      case 'pix':
        return "Pix"

      default:
        return ""
    }
  }

  const getActualValue = (value: number | null | undefined) => {
    if(value){
      var actualValue = value / 100;

      return "R$ " + actualValue.toFixed(2).toLocaleString();
    }

    return "-";
  }

  const getPayDay = (charge: ChargeDTO) => { 
    if(charge.Transactions && charge.Transactions.length > 0){
      var transaction = charge.Transactions[charge.Transactions.length - 1];
      
      return new Date(transaction.payDay).toLocaleDateString();
    }

    return "-";
  }

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
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
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
                  {getPayDay(charge)}
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
                  <button type='button'>
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
