import React, {useCallback} from 'react'
import ModalHoc from './ModalHoc'
import {AiFillCloseCircle} from "react-icons/ai";

type ModalProps = {
  open: boolean,
  children: any,
  onClose: Function,
  title: string,
  noOverlayClick?: boolean
}

function Modal({ open, onClose, title, children }: ModalProps) {
  const handleCloseClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    onClose()
  }, [onClose])

  return (
    <>
      {
        open && <ModalHoc selector='#modal'>
              <div className='bg-black fixed h-screen left-0 opacity-40 top-0 w-screen z-30' onClick={handleCloseClick}/>
              <div
                  className="fixed top-1/2 left-1/2 bg-gray-900 p-20 pb-10 pt-14 rounded border-1px border-solid border-gray-400 z-30 -translate-x-1/2 -translate-y-1/2"
              >
                  <a href='#' className='absolute text-light-blue top-2 right-2' onClick={handleCloseClick}><AiFillCloseCircle/></a>
                  <div className='w-full text-lg text-light-blue text-center mb-3 -mt-3'>
                    {title}
                  </div>
                  <div className={'max-h-[70vh] overflow-y-auto '}>
                    {children}
                  </div>
              </div>
          </ModalHoc>
      }
    </>
  )
}

export default Modal
