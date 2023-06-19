import React, { useState } from 'react'
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "../Components/OTP/firebaseotp";
import { toast, Toaster } from "react-hot-toast";
import { RecaptchaVerifier,signInWithPhoneNumber } from "firebase/auth";
import "../App.css";
import Chat from './ChatBot/Chat';
import Navbar from './Navbar/Navbar';
const Home = () => {
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
        content: "First tell your name as programming chat bot. Don't include 'as an AI language' in your answers but tell as 'as a prgramming chat bot, i am here to solve your queries'. Explain with some coding snippets help them by providing also some interview tips.Explain about Prgramming languages as expected from interviewer point of view."
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
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  function onSignup() {
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;
    const formatPh = "+" + ph;
    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setShowOTP(true);
        toast.success("OTP sended successfully!");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function onOTPVerify() {
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
      })
      .catch((err) => {
        window.location.reload()
        alert(err)
        console.log(err);
      });
  }
  return (
    <section className="bg-emerald-500 flex items-center justify-center h-screen">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <>
            <div className='nav-bar-container'>
              <Navbar setUser={setUser}/>
            </div>
              <Chat />
            </>
        ) : (
          <div className='main-continers'>
            {showOTP ? (
              <>
              <div className='mob-container'>
                <div className='mob-inside'>
                  <div className='side-msg'>
                      <div className='line'></div>
                      <h1 className='opt-msgs'>OTP<br /> AUTHENTICATION</h1>
                  </div>
                  <div className='mob-div'>
                    <BsFillShieldLockFill size={50} className='mob-div-img'/>
                    <label htmlFor="phone">
                      <h3>Enter your OTP</h3>
                      <OtpInput value={otp} onChange={setOtp} OTPLength={6} otpType="number" disabled={false} autoFocus className="opt-container "></OtpInput>
                      <div className='sub-but'>
                        <button onClick={onOTPVerify}><span>Verify OTP</span></button>
                      </div>
                     </label>
                  </div>
                </div>
              </div>
              </>
            ) : (
              <>
                <div className='mob-container'>
                  <div className='mob-inside'>
                    <div className='side-msg'>
                      <div className='line'></div>
                      <h1 className='opt-msgs'>OTP<br /> AUTHENTICATION</h1>
                    </div>
                    <div className='mob-div'>
                      <BsTelephoneFill size={50} className='mob-div-img'/>
                      <label htmlFor='phone'>
                        <h2>Enter your Mobile Number</h2>
                        <PhoneInput country={"in"} value={ph} onChange={setPh} />
                        <div className='sub-but'>
                            <button type='submit' onClick={onSignup} >Submit</button>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default Home
