import { ApexOptions } from 'apexcharts';
import React, { useContext, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';
import { ContaContext } from '../../contexts/ContaContextProvider';
import { BankAccountService } from '../../common/services/BankAccountService';
import { ChargesSumByDate } from '../../types/chargesGraphics';
import { ResponseDTO } from '../../types/ResponseDTO';

const options: ApexOptions = {
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'bar',
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },

  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '25%',
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
    },
  },
  dataLabels: {
    enabled: false,
  },

  xaxis: {
    categories: ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Satoshi',
    fontWeight: 500,
    fontSize: '14px',

    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
};

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartTwo: React.FC = () => {
  const navigate = useNavigate();
  const bankAccountContext = useContext(ContaContext);
  const [loading, setLoading] = useState(false);
  
  const getChartData = async () => {
    if(bankAccountContext?.bankAccount){
      setLoading(() => true);

      const result = await new BankAccountService().getChargesSumWeekly(bankAccountContext?.bankAccount?.id);

      const response = result as ResponseDTO<ChargesSumByDate>;
            
      if(response.errors && response.errors.length > 0){
          // setError(response.errors.join(','));
      }
      else{
        const graphicPoints = Object.values(response.data);
        const max = Math.max(...graphicPoints);

        options.yaxis = {
          title: {
            style: {
              fontSize: '0px',
            },
          },
          min: 0,
          max: max + (max * .1),
        }
        options.tooltip = {
          y: {
            formatter: (value) => `R$ ${value.toLocaleString("pt-BR")}`,
          },
        }
        
        setState({
          series: [
            {
              name: 'Total no Dia',
              data: graphicPoints,
            }
          ],
        })
      }

      setLoading(() => false);
    }
    else{
      navigate("/logout");
    }
  }
  const [state, setState] = useState<ChartTwoState>({
    series: [
      {
        name: 'Valor',
        data: [],
      }
    ],
  });
  
  useEffect(() => {
    getChartData().then().catch(e => console.log(e));
  },[])

  // const handleReset = () => {
  //   setState((prevState) => ({
  //     ...prevState,
  //   }));
  // };
  // handleReset;  

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      {loading 
          ? 
          <div className='flex items-center justify-center'>
            <div className="w-8 h-8 animate-spin text-primary rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          </div>
          : 
          <>
          <div className="mb-4 justify-between gap-4 sm:flex">
            <div>
              <h4 className="text-xl font-semibold text-black dark:text-white">
                Cobranças essa Semana
              </h4>
            </div>
          </div>

          <div>
            <div id="chartTwo" className="-ml-5 -mb-9">
              <ReactApexChart
                options={options}
                series={state.series}
                type="bar"
                height={350}
              />
            </div>
          </div>
          </>
      }
    </div>
  );
};

export default ChartTwo;
