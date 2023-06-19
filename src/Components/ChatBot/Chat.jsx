import React, { useState } from 'react'
import "react-phone-input-2/lib/style.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css"
import {MainContainer, ChatContainer, Message,MessageList,MessageInput, TypingIndicator} from "@chatscope/chat-ui-kit-react"

const Chat = () => {
  const API_KEY ="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"
  const [messages, setMessages] = useState([
    {
        message:"Hello, i am ChatBot. I asure that I will clear all your programming related quires at my best. You can use me at any time if you have any doubts.\nHappy Learning!!!",
        sender: "ChatGPT"
    }
  ])
  const [typing, setTyping] = useState(false)
  const handleSend = async(message) =>{
    const newMessage = {
        message:message,
        sender:"user",
        direction:"outgoing"
    }
    const newMessages = [...messages, newMessage]; // all the old messages + new message
    //update out messages
    setMessages(newMessages)
    setTyping(true)
    //set a typing includer
    //send to chatgpt
    await processMessageToChatGPT(newMessages);
  }
  async function processMessageToChatGPT(chatMessages){
    //chatMessages {sender :"user of chatgpt" , message: "the message"}
    //apimessages {role:"user of assistant", content: "the message"}

    let apiMessage = chatMessages.map((messageObject) => {
        let role = "";
        if(messageObject.sender==="ChatGPT"){
            role="assistant"
        }else{
            role="user"
        }
        return {role:role, content: messageObject.message}
    });

    const systemMessage = {
        role: "system",
        content: "First tell your name as programming chat bot. Don't include 'as an AI language' in your answers but tell as 'as a prgramming chat bot, i am here to solve your queries'.Explain about Prgramming languages as expected from interviewer point of view."
    }

    const apiRequestBody = {
        "model": "gpt-3.5-turbo",
        "messages": [
            systemMessage,
            ...apiMessage //[message1, message2, etc...]
        ]
    }

    await fetch("https://api.openai.com/v1/chat/completions" ,{
        method: "POST",
        headers: {
            "Authorization": "Bearer "+ API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
    }).then((data) => {
        return data.json();
    }).then((data) => {
        setMessages(
            [
                ...chatMessages,{
                    message: data.choices[0].message.content,
                    sender: "ChatGPT",
                }
            ]
            );
            setTyping(false)
            })
  }
  

  return (
      <div className='top-container'>
            <div  className='main-chat-container'>
              <MainContainer className='chat-box' style={{padding:"15px", borderRadius:"20px", boxShadow: "0px 5px 10px rgb(0 178 255)"}}>
                  <ChatContainer>
                      <MessageList scrollBehavior='smooth' typingIndicator = { typing ? <TypingIndicator content="typing..." />: null}>
                          
                          {
                              messages.map((message, i) =>{
                                  return <Message key={i} model={message} />
                              })
                          }
                      </MessageList>
                      <MessageInput placeholder='Type message here!!!' onSend={handleSend}/>
                  </ChatContainer>
              </MainContainer>
            </div>
        </div>
  )
}

export default Chat
