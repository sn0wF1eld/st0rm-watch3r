import {useContextProvider} from "../../components/layout/provider/Context";
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import GraphsContainer from "../../components/graphs/GraphsContainer";

const options = {
  responsive: true,
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
  const [connection, setConnection] = useState(null)
  const currentLink = usePathname()

  useEffect(() => {
    if (!connections) return

    setConnection(connections.find((item: any) => currentLink?.indexOf(item.id) !== -1))
  }, [connections, currentLink])

  if (!connections.length || !connection) return

  return <GraphsContainer connection={connection} options={options}/>
}
