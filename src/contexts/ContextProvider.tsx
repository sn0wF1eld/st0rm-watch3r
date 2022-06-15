import React, { createContext, FC, useContext, useState } from 'react'

const StateContext = createContext<any | null>(null)

const initialState = {
    connections: [] as any[]
}

export const ContextProvider: FC<({ children: any})> = ({ children }) => {
    const [connections, setConnections] = useState(initialState.connections)

    const addConnection = (connection: any) => {
        setConnections([...connections, connection])
    }

    const removeConnection = (connection: any) => {
        setConnections(connections.filter(item => item !== connection))
    }

    return (
    <StateContext.Provider
        value={{
            connections,
            setConnections,
            addConnection,
            removeConnection
        }}
    >
        {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)
