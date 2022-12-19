import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {Connection, useContextProvider} from "./provider/Context";
import {MutableRefObject, useEffect, useState} from "react";
import NotificationComponent from "../notifications/NotificationComponent";
import {useOutsideClick} from "../pipelines/utils/NavUtils";

export default function Navbar() {
  const {connections} = useContextProvider()
  const [openConnections, setOpenConnections] = useState(false)
  const [openChildren, setOpenChildren] = useState('')

  useEffect(() => {
    setOpenChildren('')
  }, [openConnections])

  const currentLink = usePathname()

  const activeLink = 'text-dark-blue'

  const handleOutsideClick = () => {
    setOpenChildren('')
    setOpenConnections(false)
  }

  const connectionsRef = useOutsideClick(handleOutsideClick) as MutableRefObject<HTMLDivElement>

  return (
    <nav
      className="p-0 bg-opacity-30 backdrop-filter backdrop-blur px-2 w-auto border-b border-gray-200 sticky top-0 z-20">
      <div className="flex items-center gap-10 w-full">
        <Link
          href='/'
        >
          <Image
            className='hover:animate-rotate'
            src={"/Icemanmelting-snowflake-logo-deisgn-final2.png"}
            alt={"logo"}
            width={40}
            height={40}
          />
        </Link>
        <div className="flex mr-3 md:order-2 ml-auto">
          <div>
            <NotificationComponent />
          </div>
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
          <ul
            className="flex flex-col list-none p-4 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0">
            <li className={'flex items-center'}>
              <Link href={'/'} className={currentLink === '/' ? activeLink : 'text-gray-300'}>
                Connections Form
              </Link>
            </li>
            <li>
              <span
                ref={connectionsRef}
                className="block p-0 text-white rounded hover:bg-transparent hover:text-light-blue cursor-pointer"
                onClick={() => setOpenConnections(e => !e)}
              >
                  Connections
              </span>
              <div
                className={`z-10 bg-opacity-30 backdrop-blur backdrop-filter absolute font-normal bg-white divide-y divide-gray-100 rounded shadow w-44 ${openConnections ? '' : 'hidden'}`}>
                <ul className={'list-none p-0'}>
                  {
                    connections.map((connection: Connection) => (
                      <li key={connection?.name}>
                        <span
                          className="block py-3 pl-3 pr-4 text-white rounded hover:bg-gray-100 hover:text-light-blue cursor-pointer"
                          onMouseEnter={() => setOpenChildren(connection.id)}
                        >
                            {connection?.name}
                        </span>
                        <div
                          className={`z-10 -mt-9 p-0 bg-white bg-opacity-30 backdrop-blur backdrop-filter divide-y divide-gray-100 rounded shadow w-44 ml-44 absolute ${openChildren === connection.id ? '' : 'hidden'}`}>
                          <ul className="list-none text-sm text-white p-0 border-r-0 border-t-0 border-b-0 border-l-2 border-solid border-gray-400">
                            <li className={'py-3 pl-2 rounded hover:bg-gray-100 cursor-pointer'}>
                              <Link
                                href={'/stats/' + connection?.id}
                                className={'no-underline pl-2 py-3 -ml-2 -my-3 inline-block h-full text-white hover:text-light-blue w-full'}
                                onClick={() => setOpenConnections(false)}
                              >
                                <span>JVM Metrics</span>
                              </Link>
                            </li>
                            <li className={'py-3 pl-2 rounded hover:bg-gray-100 cursor-pointer'}>
                              <Link
                                href={'/pipelines/' + connection?.id}
                                className={'no-underline inline-block h-full text-white hover:text-light-blue w-full'}
                                onClick={() => setOpenConnections(false)}
                              >
                                <span>Pipelines</span>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}