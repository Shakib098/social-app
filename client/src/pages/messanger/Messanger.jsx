import React, { useContext, useState, useEffect } from "react"
import "./messanger.css"
import Topbar from "../../components/topbar/Topbar"
import Conversation from "../../components/conversations/Conversation"
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/chatOnline";
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"

export default function Messanger() {
    const [conversations, setConversations] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const { user } = useContext(AuthContext)

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("/conversations/" + user._id);
                setConversations(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        getConversations()
    }, [user._id])

    useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

    return (
        <>
            <Topbar />
            <div className="messanger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder="Search for friend" className="chatMenuInput" />
                        {conversations.map((c) => (
                            <div onClick={()=>setCurrentChat(c)}>
                                <Conversation conversation={c} currentUser={user} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                            {
                                currentChat ? (
                                    <>
                        <div className="chatBoxTop">
                        {messages.map(m => (
                            <Message message={m} own={m.sender === user._id} />
                        ))}
                        </div>
                        <div className="chatBoxBottom">
                            <textarea className="chatMessageInput" placeholder="write something..."></textarea>
                            <button className="chatSubmitButton">Send</button>
                        </div></> ) : ( <span className="noConversationText">Open a Conversation to start a chat.</span>)}
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline />
                    </div>
                </div>
            </div>
        </>
    )
}