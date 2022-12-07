import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type ModalHocProps = {
  children: React.ReactNode,
  selector: string
}

function ModalHoc({ children, selector }: ModalHocProps) {
  const ref = useRef<Element>()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    ref.current = document.querySelector(selector) || undefined
    setMounted(true)
  }, [selector])

  return mounted ? createPortal(children, ref.current as Element) : null
}

export default ModalHoc
