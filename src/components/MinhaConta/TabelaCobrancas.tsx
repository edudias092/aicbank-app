import { ChargeDTO, PaymentMethods } from '../../types/charge';
import { BiFile, BiXCircle } from "react-icons/bi";

export type TabelaCobrancasProps = {
  periodDescription: string,
  charges?: ChargeDTO[]
}

export const TabelaCobrancas = ({periodDescription, charges} : TabelaCobrancasProps) => {
  
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
      console.log(transaction)
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

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-10 md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Nome</p>
        </div>
        <div className="col-span-1 hidden items-center sm:flex">
          <p className="font-medium">Valor</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Descrição</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Vencimento</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Forma de Pagamento</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Ações</p>
        </div>
      </div>

      {(charges && charges?.length > 0) ? charges?.map((charge, key) => (
        <div
          className="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-10 md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="col-span-2 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <p className="text-sm text-black dark:text-white">
                {charge.Customer?.name}
              </p>
            </div>
          </div>
          <div className="col-span-1 hidden items-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              { getActualValue(charge.value)}
            </p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="text-sm text-black dark:text-white">
              {charge.additionalInfo ? charge.additionalInfo : "-"}
            </p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="text-sm text-black dark:text-white">{getPayDay(charge)}</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="">{getPaymentMethodDescription(charge.mainPaymentMethodId)}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="flex">
              <button type='button' onClick={() => viewFatura(key)}>
                <BiFile title='Visualizar Fatura' className='cursor-pointer border-2 rounded-md mx-1' size={30}/>
              </button>
              <BiXCircle title='Cancelar Cobrança' className='cursor-pointer text-danger border-2 rounded-md mx-1' size={30}/>
            </p>
          </div>
        </div>
      )):
      <div className="w-full">
          <p className="text-lg dark:text-white text-center py-6 border-t-2 border-b-2 border-slate-100">
            Nenhuma cobrança encontrada
          </p>
      </div>
      }
    </div>
  );
};
