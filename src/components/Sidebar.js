import {CSidebar, CSidebarNav, CNavItem ,CNavTitle, CIcon } from "@coreui/react";

function Sidebar(){
    const logoutFn=()=>{
        localStorage.clear();
        window.location.href="/"
    }
    return (
        <CSidebar unfoldable className="vh-100 bg-black">
        <CSidebarNav>
        <CNavItem className="bg-success">
            <i className="bi bi-bar-chart"></i>
            <h5>TETHERX</h5>
        </CNavItem>
        <CNavTitle>A CRM app for all your need...</CNavTitle>
        <div onClick={logoutFn}>
            <CNavItem>
                
                <div className="text-white mx-3 my-2">
                <i className="bi bi-box-arrow-left text-white mx-3 my-2"/>
 
                    Logout</div>
            </CNavItem>
        </div>
        </CSidebarNav>    
        </CSidebar>
    )
  

}

export default Sidebar;
