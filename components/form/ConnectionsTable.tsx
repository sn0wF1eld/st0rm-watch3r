import {Connection, useContextProvider} from "../layout/provider/Context";
import {TbPlugConnectedX} from "react-icons/tb";
import Modal from "../modal/Modal";
import {useState} from "react";

export default function ConnectionsTable() {
  const {removeConnection, connections} = useContextProvider()
  const [openModal, setOpenModal] = useState(false)
  const [selectedConnection, setSelectedConnection] = useState({} as Connection)

  const confirmRemoveConnection = (connection: Connection) => {
    setOpenModal(true)
    setSelectedConnection(connection)
  }

  const handleRemoveConnection = () => {
    removeConnection(selectedConnection)
    setSelectedConnection({} as Connection)
    setOpenModal(false)
  }

  if (!connections.length) return <h3 className='text-center text-light-blue'>No connections to display</h3>

  return (
    <div className='flex rounded p-5 w-auto'>
      <table className='w-full rounded table-auto border-spacing-3 border-separate'>
        <thead>
        <tr className='text-light-blue'>
          <th>Name</th>
          <th>IP</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {
          connections.map((connection: Connection) => (
            <tr key={connection.id} className='rounded text-white p-5 bg-blue-700 hover:bg-blue-500'>
              <td className='p-3 rounded text-center'>{connection.name}</td>
              <td className='p-3 rounded text-center'>{connection.address}</td>
              <td className='p-3 rounded text-center'>
                <button className='p-2 rounded bg-red-500 cursor-pointer hover:bg-red-400'
                        onClick={() => confirmRemoveConnection(connection)}>
                  <TbPlugConnectedX/></button>
              </td>
            </tr>
          ))
        }
        </tbody>
      </table>
      {openModal &&
          <Modal
              open={openModal}
              title='Error Adding Connection'
              onClose={() => setOpenModal(false)}
          >
              <h3 className="text-center text-light-blue">Delete connection {selectedConnection.name}?</h3>
              <div className='flex justify-end gap-10'>
                <button className='p-2 rounded bg-red-500 cursor-pointer hover:bg-red-400' onClick={() => {
                  setOpenModal(false);
                  setSelectedConnection({} as Connection)
                }}>
                    Cancel
                </button>
                <button className='p-2 rounded bg-green-600 hover:cursor-pointer hover:bg-green-400'
                        onClick={() => handleRemoveConnection()}>
                    Delete
                </button>
              </div>
          </Modal>}
    </div>
  )
}