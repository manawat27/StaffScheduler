export default function Layout(){
    return (
        <div className="flex flex-col h-screen" style={{height: "95%"}}>
            <div className="fixed w-full z-100">
                Add header inside
            </div>

            {/* main body here */}
            <div className="fixed flex-1 overflow-x-scroll">
                <div className="fixed z-40">
                    {/* <NavBar /> */}
                </div>
            </div>
        </div>
    )
}