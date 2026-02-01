import Header from "../Head/Header/Header";
import Footer from "../Footer/Footer";
import SideBar from "../SideBar/SideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <Header />

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-800 text-white min-h-full">
                    <SideBar />
                </aside>

                {/* Main content */}
                <div className={`flex flex-col flex-1 min-w-0 mt-10`}>
                    <main className="flex-1 min-w-0 mt-16 min-h-[100vh]">
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
}