import React, { FC } from 'react'

type ButtonProps = {
    customFunction?: any;
    children?: any
}

const Button: FC<ButtonProps> = ({customFunction ,children}) => {
  return (
    <button
        className='p-2 font-bold text-20 w-60 bg-button-bg text-green-400 hover:bg-secondary-bg'
        type='button'
        onClick={() => customFunction()}
    >
        {children}
    </button>
  )
}

export default Button