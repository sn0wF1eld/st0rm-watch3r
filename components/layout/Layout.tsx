import {ReactNode} from "react";
import LayoutProvider from "./provider/Context";
import Navbar from "./Navbar";

type LayoutProps = {
    children: ReactNode
}

export default function Layout({children}: LayoutProps) {
    return (
        <LayoutProvider>
            <div className='bg-main-bg h-screen overflow-auto flex flex-col gap-10'>
                <Navbar/>
                <main className={"w-full"}>
                    {children}
                </main>
            </div>
        </LayoutProvider>
    )
}