import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion'

export const Main = () => {
    return (
        <div className="d-flex flex-column" >
            <div ><h1 style={{display: 'flex',  flexDirection: "row", justifyContent:'center', alignItems:'center', height: '100vh'}}>Secure Chat (Powered by AWS)</h1></div>
            {/* <div className="p-2 col-example text-left"><Link to="/components/Signup">Signusdfdsp</Link></div>
            <div className="p-2 col-example text-left"><Link to={"/components/Login"}>Login</Link></div> */}
        </div>

    )
}