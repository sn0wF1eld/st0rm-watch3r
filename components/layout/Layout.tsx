import {ReactNode} from "react";
import LayoutProvider from "./provider/Context";
import Navbar from "./Navbar";

type LayoutProps = {
    children: ReactNode
}

export default function Layout({children}: LayoutProps) {
    return (
        <LayoutProvider>
            <div className='h-screen bg-gradient-to-b from-gray-900 to-gray-700 overflow-auto flex flex-col gap-10 p-0'>
                <Navbar/>
                <main className={"w-auto pl-6 pr-6"}>
                    {children}
                </main>
            </div>
        </LayoutProvider>
    )
}