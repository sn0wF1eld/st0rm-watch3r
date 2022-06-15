import React, { FC } from 'react'
import { NavLink } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';

type ButtonProps = {
    title?: string,
    linkTo: string,
}

const activeLink = 'flex items-center gap-5 pl-4 pr-4 pt-3 pb-2.5 text-white text-md m-2'
const normalLink = 'flex items-center gap-5 pl-4 pr-4 pt-3 pb-2.5 text-md m-2 text-dark-blue hover:bg-secondary-bg'

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


function Sidebar() {
    const { connections } = useStateContext();
    
  return (
      <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-button-bg'>
        <div className="ml-3 h-screen
            md:overflow-hidden overflow-auto
            md:hover:overflow-auto pb-10">
            <div className='flex justify-between items-center w-full mt-10'>
                <NavLink 
                    className='hover:animate-rotate'
                    style={ {width: '18rem', height: '5rem', backgroundSize: "100%", backgroundPositionX: 'center', backgroundPositionY: 'center', backgroundRepeat: 'no-repeat', backgroundImage: "url('/Icemanmelting-snowflake-logo-deisgn-clean-final-just-text3.png"}} to='/' />

            </div>
            <div className="mt-10">
                <NavButton title='CDG Nodes' linkTo='/' />
                {
                    connections.map((connection: any) => (<div key={connection.ip} className='ml-6'>
                        <span className='text-light-blue'>{connection.name}</span>
                        <div>
                            <NavButton title='Metrics' linkTo={'/stats/' + connection.id}/>
                            <NavButton title='Steps State' linkTo={'/state/' + connection.id} />
                        </div>
                    </div>
                    ))

                }
            </div>
        </div>
      </div>
  )
}

export default Sidebar