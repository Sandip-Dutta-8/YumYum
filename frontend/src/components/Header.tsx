import { Link } from "react-router-dom"
import MobileNav from "./MobileNav";
import MainNav from "./MainNav";
import { ModeToggle } from "./mode-toggle";

const Header = () => {
    return (
        <div className="border-b-2 border-b-orange-500 py-6 px-8 shadow-md shadow-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link
                    to="/"
                    className="text-3xl font-bold tracking-tight text-orange-500"
                >
                    YumYum
                </Link>
                <div className="flex items-center gap-3 lg:gap-8">
                    <div><ModeToggle /></div>
                    <div className="md:hidden">
                        <MobileNav />
                    </div>
                    <div className="hidden md:block">
                        <MainNav />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header