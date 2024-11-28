import { ApexOptions } from 'apexcharts';
import React, { useContext, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { BankAccountService } from '../../common/services/BankAccountService';
import { ContaContext } from '../../contexts/ContaContextProvider';
import { useNavigate } from 'react-router-dom';
import { ChargesSumByDate } from '../../types/chargesGraphics';
import { ResponseDTO } from '../../types/ResponseDTO';
import Loader from '../../common/Loader';

const options: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },

    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: 'straight',
  },
  // labels: {
  //   show: false,
  //   position: "top",
  // },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#80CAEE'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
    categories: [],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 0,
    max: 100,
  },
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartOne: React.FC = () => {
  const navigate = useNavigate();
  const bankAccountContext = useContext(ContaContext);
  const [loading, setLoading] = useState(false);

  const dataInicial = new Date()
  dataInicial.setDate(dataInicial.getDate() - 7);
  const dataFinal = new Date()
  dataFinal.setDate(dataFinal.getDate() + 7);

  const [state, setState] = useState<ChartOneState>({
    series: [
      {
        name: 'Total no Dia',
        data: [],
      }
    ],
  });

  const getChartData = async () => {
    if(bankAccountContext?.bankAccount){
      setLoading(() => true);

      const result = await new BankAccountService().getChargesSumByDate(bankAccountContext?.bankAccount?.id);

      const response = result as ResponseDTO<ChargesSumByDate>;
            
      if(response.errors && response.errors.length > 0){
          // setError(response.errors.join(','));
      }
      else{
        const graphicPoints = Object.values(response.data)//?.map(c => c.value);
        const graphicCategories = Object.keys(response.data)//?.map(c => c.key);
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
        options.xaxis = {
          type: 'category',
          categories: graphicCategories,
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
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

  useEffect(() => {
    getChartData().then().catch(e => console.log(e));
  },[])

  return (

      <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
        {loading 
          ? 
          <div className='flex items-center justify-center'>
            <div className="w-8 h-8 animate-spin text-primary rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          </div>
          : 
        <>
          <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
            <div className="flex w-full flex-wrap gap-3 sm:gap-5">
              <div className="flex min-w-47.5">
                <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
                  <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
                </span>
                <div className="w-full">
                  <p className="font-semibold text-primary">Total de Valores de Cobrança por Data</p>
                  <p className="text-sm font-medium">{dataInicial.toLocaleDateString()} - {dataFinal.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            {/* <div className="flex w-full max-w-45 justify-end">
              <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
                <button className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
                  Day
                </button>
                <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
                  Week
                </button>
                <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
                  Month
                </button>
              </div>
            </div> */}
          </div>

          <div>
            <div id="chartOne" className="-ml-5">
              <ReactApexChart
                options={options}
                series={state.series}
                type="area"
                height={350}
              />
            </div>
          </div>
        </>
        }
      </div>
  );
};

export default ChartOne;
