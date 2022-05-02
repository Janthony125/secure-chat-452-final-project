import React, { createContext, useReducer, useState } from 'react'
import { CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import Pool from '../UserPool'

  

const AccountContext = createContext({});


const Account = (props: any) => {

    const getSession = async () => {
        return await new Promise((resolve, reject) => {
            const user = Pool.getCurrentUser();
            if (user) {
                user.getSession((err: any, session: any) => {
                    if(err) {
                        reject()
                    } else {
                        resolve(session);
                    }
                })
            } else {
                reject()
            }
        })
    }
    
    const authenticate = async (Username: any, Password: any) => {
        return await new Promise((resolve, reject) => {
            const user = new CognitoUser({ Username, Pool: Pool })
   
            const authDetails = new AuthenticationDetails({
                Username,
                Password
            })
   
            user.authenticateUser(authDetails, {
            onSuccess: (data) => {
                console.log("onSuccess: ", data);
                resolve(data)
            },
            onFailure: (err: any) => {
                console.error("onFailure: ", err)
                reject(err)
            },
            newPasswordRequired: (data: any) => {
                console.log("newPasswordRequired: ", data)
                resolve(data)
            },
            })
        })
    }

    const logout = () => {
        const user = Pool.getCurrentUser()
        if (user) {
            user.signOut()
        }
    }
    return (
        <AccountContext.Provider value={{ authenticate, getSession, logout }}>
            {props.children}
        </AccountContext.Provider>
    )
}


export { Account, AccountContext } ;