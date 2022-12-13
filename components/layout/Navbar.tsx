import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {Connection, useContextProvider} from "./provider/Context";
import {useEffect, useState} from "react";
import NotificationComponent from "../notifications/NotificationComponent";

export default function Navbar() {
  const {connections} = useContextProvider()
  const [openConnections, setOpenConnections] = useState(false)
  const [openChildren, setOpenChildren] = useState('')

  useEffect(() => {
    // TODO: add outside click handling
    setOpenChildren('')
  }, [openConnections])

  const currentLink = usePathname()

  const activeLink = 'text-white'

  return (
    <nav
      className="bg-button-bg px-2 w-auto border-b border-gray-200 p-3 sticky top-0 z-20">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <Link
          href='/'
        >
          <Image
            className='hover:animate-rotate'
            src={"/Icemanmelting-snowflake-logo-deisgn-final2.png"}
            alt={"logo"}
            width={75}
            height={75}
          />
        </Link>
        <div className="flex md:order-2">
          <div>
            <NotificationComponent />
          </div>
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
          <ul
            className="flex flex-col list-none p-4 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0">
            <li className={'flex items-center'}>
              <Link href={'/'} className={currentLink === '/' ? activeLink : 'text-gray-300'}>
                Connections Form
              </Link>
            </li>
            <li>
              <span
                className="block p-0 text-white rounded hover:bg-transparent hover:text-light-blue cursor-pointer"
                onClick={() => setOpenConnections(e => !e)}
              >
                  Connections
              </span>
              <div
                className={`z-10 absolute font-normal bg-white divide-y divide-gray-100 rounded shadow w-44 ${openConnections ? '' : 'hidden'}`}>
                <ul className={'list-none p-0'}>
                  {
                    connections.map((connection: Connection) => (
                      <li key={connection?.name}>
                        <span
                          className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 hover:text-light-blue cursor-pointer"
                          onMouseEnter={() => setOpenChildren(connection.id)}
                        >
                            {connection?.name}
                        </span>
                        <div
                          className={`z-10 -mt-9 p-0 bg-white divide-y divide-gray-100 rounded shadow w-44 ml-44 absolute ${openChildren === connection.id ? '' : 'hidden'}`}>
                          <ul className="list-none text-sm text-gray-700"
                              aria-labelledby="doubleDropdownButton">
                            <li>
                              <Link
                                href={'/stats/' + connection?.id}
                                className={'no-underline text-gray-500 md:hover:text-light-blue'}
                                onClick={() => setOpenConnections(false)}
                              >
                                <span>JVM Metrics</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href={'/pipelines/' + connection?.id}
                                className={'no-underline text-gray-500 md:hover:text-light-blue'}
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