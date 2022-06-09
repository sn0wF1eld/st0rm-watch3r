import React, { FC } from 'react'
import { NavLink } from 'react-router-dom';
import GeneralStats from './GeneralStats';

type ButtonProps = {
    title?: string,
    linkTo: string,
}

const activeLink = 'flex items-center gap-5 pl-4 pr-4 pt-3 pb-2.5 rounded-lg m-2 text-white text-md'
const normalLink = 'flex items-center gap-5 pl-4 pr-4 pt-3 pb-2.5 rounded-lg text-md m-2 text-dark-blue hover:bg-secondary-bg'

const NavButton: FC<ButtonProps> = ({title, linkTo}) => {
    return (
        <NavLink
            to={linkTo}
            style={({isActive}) => ({ backgroundColor: isActive ? '#42c8f1' : ''})}
            className={({isActive}) => (isActive ? activeLink : normalLink)}
        >
            <span>{title}</span>
        </NavLink>
    )
}

function Navbar() {
  return (
      <div>
        <div className="fixed bg-button-bg w-full navbar" style={{zIndex: 9999}}>
            <div className='flex gap-2 p-2 relative'>
                <NavLink 
                    className='hover:animate-rotate'
                    style={ {width: '63px', backgroundSize: "100%", backgroundImage: "url('/Icemanmelting-snowflake-logo-deisgn-final2.png"}} to='/' />
                <div className="flex w-full items-center">
                    <NavButton title='Form' linkTo='/' />
                    <NavButton title='Stats' linkTo='/stats' />
                    <NavButton title='State' linkTo='/state' />
                    <div className='ml-auto'>
                        <GeneralStats />
                    </div>
                </div>
            </div>
        </div>
      </div>
  )
}

export default Navbar