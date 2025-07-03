import {Connection, useContextProvider} from "../../components/layout/provider/Context";
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import GraphsContainer from "../../components/graphs/GraphsContainer";
import LoadingIcon from "../../components/layout/LoadingIcon";

const options = {
  responsive: true,
  maintainAspectRatio: false,
  elements: {
    line: {
      borderWidth: 1
    },
    point: {
      radius: 2
    }
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
};

export default function Stats() {
  const {connections} = useContextProvider()
  const [connection, setConnection] = useState({} as Connection)
  const currentLink = usePathname()

  useEffect(() => {
    if (!connections) return

    setConnection(connections.find((item: any) => currentLink?.split('/').find(a => a === item.name)))
  }, [connections, currentLink])

  if (!connections.length || !connection?.name) return <LoadingIcon/>

  return <>
    <h3 className={'m-auto mb-10 text-light-blue text-center'}>{connection?.name}</h3>
    <GraphsContainer connection={connection} options={options}/>
  </>
}
