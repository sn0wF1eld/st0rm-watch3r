import React, { FC } from 'react'

type DisplayProps = {
    bgColor?: string;
    color?: string;
    data?: string|number;
    icon?: any;
    label?: string;
}

const NumberDisplay: FC<DisplayProps> = ({bgColor, color, data, icon, label}) => {
  return (
    <div className='flex flex-col h-full w-60 items-center bg-button-bg'>
        <span className='text-13 text-white p-2'>{label}</span>
        <span className='text-2em text-green-400 p-5 pt-1'>{data}</span>
    </div>
  )
}

export default NumberDisplay