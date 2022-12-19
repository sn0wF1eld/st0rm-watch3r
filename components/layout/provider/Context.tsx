import {createContext, ReactNode, useContext, useEffect, useState} from "react";

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

  const addConnection = (connection: Connection) => {
    localStorage.setItem('connections', JSON.stringify([...connections, connection]))
    setConnections([...connections, connection])
  }

  const removeConnection = (connection: Connection) => {
    const newConnections = connections.filter((item: any) => item.id !== connection.id)
    localStorage.setItem('connections', JSON.stringify(newConnections))
    setConnections(newConnections)
  }

  return (
    <Context.Provider value={{
      connections,
      addConnection,
      removeConnection
    }}>
      {children}
    </Context.Provider>
  )

}

export function useContextProvider() {
  return useContext(Context)
}
