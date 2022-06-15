import React from 'react'

function Loader() {
  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center' style={{ zIndex: 9000}}>
       {/* <div className="w-40 h-40 border-t-4 border-b-4 border-light-blue rounded-full animate-spin"></div> */}
       <div className="w-50 h-50 animate-rotate" style={ {width: '13vw', height: '13vw', backgroundSize: "100%", backgroundImage: "url('/Icemanmelting-snowflake-logo-deisgn-final2.png"}}></div>
    </div>
  )
}

export default Loader