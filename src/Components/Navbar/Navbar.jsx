import React from 'react'
import chatimg from '../../assets/chat.jpg'
const Navbar = ({setUser}) => {
  const handleSubmit = () => {
    setUser(false);
  }
  return (
    <div className='nav-bar'>
      <div className='chat-img'>
        <img className="imgg" src={chatimg}  alt='image'/>
        <p><strong className='str'>C</strong>hat <strong className='str'>B</strong>ot</p>
      </div>
      <div>
        <a href='/' className='buttons' onClick={handleSubmit}>LOGOUT</a>
      </div>
    </div>
  )
}

export default Navbar
