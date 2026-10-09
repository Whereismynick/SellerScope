import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"

import Sidebar from "../components/Sidebar/Sidebar"
import Header from "../components/Header/Header"

const MainLayout = () => {
	const { pathname } = useLocation()

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "auto"
		})
	}, [pathname])

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