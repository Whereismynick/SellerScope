import Sidebar from "../components/Sidebar/Sidebar"
import Header from "../components/Header/Header"
import { Outlet } from "react-router-dom"



const MainLayout = () => {
	return (
		<div className="layout">
		<Sidebar />
		<main className="content">
			<Header />
			<Outlet />
		</main>
	</div>
	)
}

export default MainLayout