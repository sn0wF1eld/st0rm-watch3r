import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {Connection, useContextProvider} from "./provider/Context";
import {MutableRefObject, useEffect, useState} from "react";
import NotificationComponent from "../notifications/NotificationComponent";
import {useOutsideClick} from "../pipelines/utils/NavUtils";
import Modal from "../modal/Modal";

export default function Navbar() {
  const {connections} = useContextProvider()
  const [openConnections, setOpenConnections] = useState(false)
  const [openChildren, setOpenChildren] = useState('')
  const [openAbout, setOpenAbout] = useState(false)

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
            src={"/st0rmwatch3r-name.png"}
            alt={"logo"}
            width={230}
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
                            <li className={'rounded hover:bg-gray-100 cursor-pointer'}>
                              <Link
                                href={'/stats/' + connection?.name}
                                className={'no-underline py-3 pl-2 inline-block h-full text-white hover:text-light-blue w-full'}
                                onClick={() => setOpenConnections(false)}
                              >
                                <span>JVM Metrics</span>
                              </Link>
                            </li>
                            <li className={'rounded hover:bg-gray-100 cursor-pointer'}>
                              <Link
                                href={'/pipelines/' + connection?.name}
                                className={'py-3 pl-2 no-underline inline-block h-full text-white hover:text-light-blue w-full'}
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
            <li className={'flex items-center'}>
              <span onClick={() => setOpenAbout(true)} className={'block p-0 text-white rounded hover:bg-transparent hover:text-light-blue cursor-pointer'}>About</span>
              {
                openAbout &&
                  <Modal open={openAbout} onClose={() => setOpenAbout(false)} title={'About'}>
                      <div className={'flex gap-5'}>
                          <div className={'flex flex-col gap-5'}>
                              <Image
                                  src={"/sn0wst0rm.png"}
                                  alt={"snowstorm1"}
                                  width={250}
                                  height={200}
                              />
                            <Image
                                src={"/sn0wst0rm-name.png"}
                                alt={"snowstorm2"}
                                width={230}
                                height={40}
                            />
                              <Image
                                  src={"/st0rmwatch3r.png"}
                                  alt={"st0rmwatch3r1"}
                                  width={250}
                                  height={200}
                              />
                            <Image
                                src={"/st0rmwatch3r-name.png"}
                                alt={"st0rmwatch3r2"}
                                width={230}
                                height={40}
                            />
                          </div>
                          <div className={'flex flex-col justify-between text-light-blue'}>
                              <span>St0rm Watch3r 1.0.1-beta</span>
                              <span>St0rm Watch3r is a monitoring tool to be used in conjunction with the Sn0wSt0rm framework.</span>
                              <span>Copyright © 2020-2022 Sn0wf1eld, Lda</span>
                              <span>St0rm Watch3r, Sn0wSt0rm and Sn0wf1eld and their logos are trademarks of Sn0wf1eld, Lda, registered in Portugal and other countries.</span>
                          </div>
                      </div>
                  </Modal>
              }
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}