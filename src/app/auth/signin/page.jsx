"use client"
import React, {useState} from 'react';
import { useRouter } from 'next/navigation'; // Next.js router
//need to handle onclick to not send credentials over query parameters
  const Signin = () => {
    const [username, setUser] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
  
    const handleLogin = (e) => {
      e.preventDefault();
      // Perform login logic (e.g., API request)
      //Pseudo auth for now 10/16/2024
      if(username == 'client' && password == '123456'){
        router.push('/cdash/profile');
      }
      else if(username == 'vendor' && password == '123456'){
        router.push('/vdash/profile');
      }
      else{
        router.push('/404');
      }
      console.log(`Form submitted username: ${username}, password: ${password}`);
    };
    const handleRegister = (e) => {
        e.preventDefault();
        console.log('redirecting to register');
        router.push('/register');
    }
    const handleReset = (e) => {
        e.preventDefault();
        console.log('redirecting to reset_password');
        router.push('/reset_password');
    }
return(
    <div>
        <div>
        <form>
            <label>Username</label><br/>
            <input type="text" id="username" name="username" onChange={(e) => setUser(e.target.value)}></input><br/>
            <label>Password</label><br/>
            <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)}></input><br/>
            <button name="login" onClick={handleLogin}>Log In</button> 
        </form>
        <button name="register" onClick={handleRegister}>Register</button>
        <button name="reset" onClick={handleReset}>Reset Password</button>
        </div>
    </div>
    )
}

export default Signin;