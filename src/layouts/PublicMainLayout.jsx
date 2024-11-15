import { Fragment } from "react"
import { Outlet } from "react-router-dom"
import NavbarMenu from "@/components/Navbar/Navbar"
import Well from "@/components/Well"

const PublicMainLayout = () => {
  return (
    <Fragment>
      <NavbarMenu />
      <main>
        <Well />
        <Outlet />
      </main>
    </Fragment>
  )
}

export default PublicMainLayout
