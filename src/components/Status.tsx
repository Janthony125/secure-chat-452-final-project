import { Button } from '@material-ui/core'
import React, { useState, useContext, useEffect} from 'react'
import { AccountContext } from "./Account"
import  Chat  from './Chat';

const Status = () => {
    const [status, setStatus] = useState(false)

    const { getSession, logout }: any = useContext(AccountContext)

    useEffect(() => {
        getSession()
            .then((session: any) => {
                console.log("Session: ", session)
                setStatus(true)
            })

    }, [])

    return (
        <div>
            {status ? 
                <Button onClick={logout}>Logout</Button> : "Please login"}
        </div>
    )
}

export default Status