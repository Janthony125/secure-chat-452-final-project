import React, {useState, useEffect, useCallback, useRef, useContext} from 'react';
import {ChatClient} from './chat-helper'
import { AccountContext } from './Account';
var CryptoJS = require("crypto-js");
var sha256 = require('js-sha256'); 
 
// AES
function encryptMessage(messageToencrypt: any, secretKey: any) {
 var encrytedMessage = CryptoJS.AES.encrypt(messageToencrypt, secretKey)
 return encrytedMessage.toString()
}
 
function decryptMessage(encryptMessage: any, secretKey: any) {
 var decryptedBytes = CryptoJS.AES.decrypt(encryptMessage, secretKey)
 console.log('**DECRYPTED BYTES**', decryptedBytes)
 var decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8)
 console.log('INSIDE DECRYPTED FUNCTION: ', decryptMessage)
 return decryptedMessage

}



// web socket url on aws
const URL = 'wss://44dsc4exbi.execute-api.us-east-1.amazonaws.com/production'

function Chat() {
  const { getSession }: any = useContext(AccountContext)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    getSession().then(() => {
      setLoggedIn(true)
    })
  })

  const socket = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [members, setMembers] = useState([
  ])
  const [chatRows, setChatRows] = useState<React.ReactNode[]>([
  ])

  const onSocketOpen = useCallback(() => {
    setIsConnected(true)
    const name = prompt('Enter your name')
    socket.current?.send(JSON.stringify({
      action: 'setName',
      name,
    }))
  }, [])

  const onSocketClose = useCallback(() => {
    setIsConnected(false)
  }, [])

  const onSocketMessage = useCallback((dataStr: any) => {
    const data = JSON.parse(dataStr)
    if (data.members) {
      setMembers(data.members)
    } else if(data.publicMessage) {
      setChatRows(oldArray => [...oldArray, <span><b>{data.publicMessage}</b></span>])
    } else if(data.privateMessage) {
      console.log('MESSAGE RECEIVED (PRIVATE): ', data.privateMessage)
      const dMessage = decryptMessage(data.privateMessage, 'ShVmYq3s6v9y$B&E)H@McQfTjWnZr4u7')
      console.log('DECRYPTED MESSAGE (PRIVATE): ', dMessage)
      console.log('HASH RECEIVED (PRVATE): ', data.hash)
      data.privateMessage = dMessage
      alert(`${data.person}:  ${data.privateMessage}`)
    } else if(data.systemMessage) {
      setChatRows(oldArray => [...oldArray, <span><b>{data.systemMessage}</b></span>])
    }
  }, [])

  const onConnect = useCallback(() => {
    if (socket.current?.readyState !== WebSocket.OPEN) {
      socket.current = new WebSocket(URL)
      socket.current.addEventListener('open', onSocketOpen)
      socket.current.addEventListener('close', onSocketClose)
      socket.current.addEventListener('message', (event) => {
        onSocketMessage(event.data)
      })
    }
  }, [])

  useEffect(() => {
    return () => {
      socket.current?.close()
    }
  }, [])

  const onSendPrivateMessage = useCallback((to: string) => {
   
    let message = prompt('Enter private message for ' + to);
    var hash = sha256(message)
    console.log('HASH SENT: ', hash)
    const eMessage = encryptMessage(message, 'ShVmYq3s6v9y$B&E)H@McQfTjWnZr4u7')
    console.log('ENCRYPTED MESSAGE (PRIVATE): ', eMessage)
    message = eMessage
    socket.current?.send(JSON.stringify({
      action: 'sendPrivate',
      message,
      to,
      hash
    }))
  }, [])
  
  const onSendPublicMessage = useCallback(() => {
    let message = prompt('Enter public message for');
    socket.current?.send(JSON.stringify({
      action: 'sendPublic',
      message
    }))
  }, [])

  const onDisconnect = useCallback(() => {
    socket.current?.close()
    setMembers([])
    setChatRows([])
  }, [isConnected])

  return (
    <div>
      {loggedIn && (
        <ChatClient
        isConnected={isConnected}
        members={members}
        chatRows={chatRows}
        onPublicMessage={onSendPublicMessage}
        onPrivateMessage={onSendPrivateMessage}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
      />
      )}
      
    </div>
    
  )

}

export default Chat;
