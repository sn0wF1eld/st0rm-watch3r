import Image from "next/image";
import {useState} from "react";
import Modal from "../modal/Modal";

export default function Footer() {
  const [openAbout, setOpenAbout] = useState(false)

  return (
    <div className={'absolute bottom-0 flex bg-opacity-30 backdrop-filter backdrop-blur px-2 gap-10 h-20 p-2 items-center'}>
      <Image
        className='hover:animate-rotate'
        src={"/Icemanmelting-snowflake-logo-deisgn-final2.png"}
        alt={"logo"}
        width={40}
        height={40}
      />
      <span className={'text-light-blue cursor-pointer'} onClick={() => setOpenAbout(true)}>About</span>
      {
        openAbout &&
          <Modal open={openAbout} onClose={() => setOpenAbout(false)} title={'About'}>
              <div className={'flex gap-5'}>
                  <div className={'flex flex-col gap-5'}>
                      <Image
                          src={"/snowstorm-1.png"}
                          alt={"snowstorm1"}
                          width={200}
                          height={200}
                      />
                      <Image
                          src={"/snowstorm-2.png"}
                          alt={"snowstorm2"}
                          width={200}
                          height={200}
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
    </div>
  )
}