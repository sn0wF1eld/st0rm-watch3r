import React, { useCallback, useEffect, useRef } from 'react'
import Overlay from '../layout/provider/Overlay'
import ModalHoc from './ModalHoc'
import {AiFillCloseCircle} from "react-icons/ai";

type ModalProps = {
  open: boolean,
  children: any,
  onClose: Function,
  title: string,
  noOverlayClick?: boolean
}

function Modal({ open, onClose, title, children, noOverlayClick }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const firstRenderRef = useRef(true)

  const handleCloseClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    onClose()
  }, [onClose])

  useEffect(() => {
    // first render/doublemount safeguard
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }
    const handleBackdropClick: any = (e: React.MouseEvent) => {
      if (!open) return window.removeEventListener('click', handleBackdropClick)
      if (!modalRef.current?.contains(e.target as any)) {
        return handleCloseClick(e)
      }
    }

    if (noOverlayClick) {
      setTimeout(() => window.removeEventListener('click', handleBackdropClick), 50)
      return window.removeEventListener('click', handleBackdropClick)
    }
    // attach event listener to the whole window with our handler
    setTimeout(() => {
      window.addEventListener('click', handleBackdropClick);
    }, 200)
    // remove the event listener when the modal is closed
    return () => window.removeEventListener('click', handleBackdropClick);
  }, [open, noOverlayClick]);

  return (
    <>
      {
        open && <ModalHoc selector='#modal'>
              <Overlay />
              <div
                  className="fixed top-1/2 left-1/2 bg-gray-900 p-20 pb-10 pt-14 rounded border-1px border-solid border-gray-400 z-30 -translate-x-1/2 -translate-y-1/2"
                  ref={modalRef}
              >
                  <a href='#' className='absolute text-light-blue top-2 right-2' onClick={handleCloseClick}><AiFillCloseCircle/></a>
                  <div className='w-full text-lg text-light-blue text-center mb-3 -mt-3'>
                    {title}
                  </div>
                  <div className="max-h-[85vh] overflow-y-auto">
                    {children}
                  </div>
              </div>
          </ModalHoc>
      }
    </>
  )
}

export default Modal
