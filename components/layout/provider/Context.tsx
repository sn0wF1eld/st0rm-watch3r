import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {errorToToast, showToastInfoMessage} from "../../graphs/utils/GraphUtils";
import {Pipeline} from "../../pipelines/utils/PipelinesUtils";

type Props = {
  children: ReactNode
}

type ContextProps = {
  connections: any
}

export type Connection = {
  id: string
  address: string
  name: string
  secure: boolean
  version: string
}

const Context = createContext<ContextProps | any>({
  connections: []
})


export default function LayoutProvider({children}: Props) {
  const [connections, setConnections] = useState([] as Connection[])

  useEffect(() => {
    if (localStorage.getItem('connections')) {
      setConnections(JSON.parse(localStorage.getItem('connections') || '[]') as Connection[])
    }
  }, [])

  const addConnection = async (connection: Connection) => {
    let pipelines
     await getPipelines(connection)
        .then((res) => {
          pipelines = res
          localStorage.setItem('connections', JSON.stringify([...connections, {...connection, pipelines}]))
          setConnections([...connections, connection])
        })
       .catch(err => {
         console.log(err)
         localStorage.setItem('connections', JSON.stringify([...connections, connection]))
         setConnections([...connections, connection])
       })
  }

  const updateConnectionVersion = (connection: Connection, version: string) => {
    connections.forEach(item => {
      if (item.id === connection.id) item.version = version
    })
    localStorage.setItem('connections', JSON.stringify(connections))
    showToastInfoMessage('Connection Updated successfully.')
    setConnections(connections)
    return false
  }

  const removeConnection = (connection: Connection) => {
    const newConnections = connections.filter((item: any) => item.id !== connection.id)
    localStorage.setItem('connections', JSON.stringify(newConnections))
    setConnections(newConnections)
  }

  const removeAllConnections = () => {
    localStorage.removeItem('connections')
    setConnections([])
  }

  const getAppVersion = async (connection: Connection) => {
    try {
      const res = await fetch(`${connection?.secure ? 'https' : 'http'}://${connection?.address}/sn0wst0rm/api/1/version`,
        {method: 'GET', headers: {'content-type': 'application/json'}});
      return await res.json();
    } catch (err) {
      return errorToToast(err);
    }
  }

  const getPipelines = async (connection: Connection) => {
    if (!connection.address) return
    return fetch(`${connection?.secure ? 'https' : 'http'}://${connection?.address}/sn0wst0rm/api/1/pipelines`,
      {method: 'GET', headers: {'content-type': 'application/json'}}
    ).then(res => res.json()
      .then((body: Pipeline[]) => {
        return body
      }))
  }

  return (
    <Context.Provider value={{
      connections,
      addConnection,
      removeConnection,
      removeAllConnections,
      getAppVersion,
      updateConnectionVersion,
      getPipelines
    }}>
      {children}
    </Context.Provider>
  )

}

export function useContextProvider() {
  return useContext(Context)
}
