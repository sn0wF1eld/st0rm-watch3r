import {useState} from "react";
import {Connection, useContextProvider} from "../layout/provider/Context";
import {useForm} from "react-hook-form";
import uuid from "react-uuid";
import {TbPlugConnected} from "react-icons/tb";
import Modal from "../modal/Modal";


function Form() {
  const {register, handleSubmit, formState: {errors}, reset} = useForm()
  const {addConnection, connections} = useContextProvider()
  const [openModal, setOpenModal] = useState(false)

  function onSubmit(connection: any) {
    if (connections.find((item: Connection) => item.address === connection.address)) {
      setOpenModal(() => true)
      reset()

      return
    }
    addConnection(connection)
    reset()
  }

  const inputStyle = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
  const inputErrorStyle = 'ring-red-500 border-red-500'
  const errorElement = <span className='text-red-400'>This field is required</span>

  return (
    <div className='flex rounded p-5 w-auto mt-10'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-row gap-3'>
        <div>
          <h3 className='text-light-blue'>Add Connection</h3>
          <div className="flex gap-3">
            <div className='flex flex-col'>
              <input className={inputStyle + (errors.name && inputErrorStyle)} type="text"
                     placeholder='Connection Name' {...register('name', {required: true})}/>
              {errors.name && errorElement}
            </div>
            <div className='flex flex-col'>
              <input className={inputStyle + (errors.address && inputErrorStyle)} type="text"
                     placeholder='Connection IP' {...register('address', {required: true})}/>
              {errors.address && errorElement}
            </div>
            <input hidden value={uuid()} {...register('id')}/>
            <button type="submit" className='p-2 rounded bg-green-600 hover:cursor-pointer hover:bg-green-400'>
              <span className='flex'>
                <TbPlugConnected/>
              </span>
            </button>
          </div>
        </div>
      </form>
      {openModal &&
          <Modal
              open={openModal}
              title='Error Adding Connection'
              onClose={() => setOpenModal(false)}
          >
              <h3 className="text-center text-light-blue">Connection already exists.</h3>
          </Modal>}
    </div>
  )
}

export default Form