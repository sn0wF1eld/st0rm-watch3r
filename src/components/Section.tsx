import React, { FC } from 'react'

type SectionProps = {
    label?: string
    children?: any
}

const Section: FC<SectionProps> = ({ label, children }) => {
    return (
        <div className='w-1/2 mb-10'>
            <div className='flex flex-col w-full pl-10 pb-10 pr-10'>
                <div className="flex w-full flex-col mt-5">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Section
