import React, { useState } from 'react';
//import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase-config';

firebase.initializeApp(firebaseConfig);

function App() {

 const [user, setUser] = useState({
    isSingedIn : false,
    name:'' ,
    email:'' ,
  })

  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSingIn = () =>{
    firebase.auth().signInWithPopup(provider)
    .then(res=>{
      const {email, displayName} = res.user;
      const singInUser = {
        isSingedIn: true,
        name: displayName,
        email: email,
      }
      setUser(singInUser);
      console.log(email, displayName);
    })
    .catch(err=>{
      console.log(err);
      console.log(err.message);
    })
  }

  const handleSingOut=()=>{
    firebase.auth().signOut()
    .then(res =>{
       const isSingOutUser = {
         isSingedIn: false,
         name: '',
         email: '',
         password: '',
         error: '',
         isValid: false,
         existingUser: false
       }
       setUser(isSingOutUser);
    })
    .catch(res =>{

    })
  }

  const is_valid_email = email => /^.+@.+\..+$/.test(email);

  const hasNumber = myString => /\d/.test(myString);
  
  const switchForm = e =>{
    const createUser = {...user};
    createUser.existingUser = e.target.checked;
    setUser(createUser);
  }
   
  const handleChange = e =>{
    const newUserInfo = { 
       ...user
    };
    
   let isValid = true;

    if(e.target.name === 'email'){
     isValid = is_valid_email(e.target.value);
    }

    if(e.target.name === 'password'){
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }

    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }

  const createAccount = (event) =>{
    if(user.isValid){
       firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
          console.log(res);
          const createUser = {...user};
          createUser.isSingedIn = true;
          createUser.error = '';
          setUser(createUser);
      })
      .catch(err=>{
        console.log(err.message);
        const createUser = {...user};
        createUser.isSingedIn = false;
        createUser.error = err.message;
        setUser(createUser);
      })
    }
     event.preventDefault();
     event.target.reset();
  }

  const singInUser = event =>{
    if(user.isValid){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
     .then(res => {
         console.log(res);
         const createUser = {...user};
         createUser.isSingedIn = true;
         createUser.error = '';
         setUser(createUser);
     })
     .catch(err=>{
       console.log(err.message);
       const createUser = {...user};
       createUser.isSingedIn = false;
       createUser.error = err.message;
       setUser(createUser);
     })
   }
    event.preventDefault();
    event.target.reset();
  }

  return (
    <div className="App">
        {
          user.isSingedIn ? <button onClick={handleSingOut}>Sing Out</button> :
          <button onClick={handleSingIn}>Sing In</button>
        }

        {
          user.isSingedIn && <p>Welcome, {user.name}</p>
        }

        <h1>Our own authentication</h1>
        <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/>
        <label htmlFor="switchForm"> Returning User</label>

        <form style={{ display: user.existingUser ? 'block' : 'none' }} onSubmit={singInUser}>
          <input type="text" onBlur={handleChange} name="email" placeholder="Your Email" required/><br/>
          <input type="password" onBlur={handleChange} name="password" placeholder="Your Password" required/>
          <br/>
          <input type="submit" value="Sing In"/> 
        </form>

        <form style={{ display: user.existingUser ? 'none' : 'block' }} onSubmit={createAccount}>
          <input type="text" onBlur={handleChange} name="name" placeholder="Your Name" required/><br/>
          <input type="text" onBlur={handleChange} name="email" placeholder="Your Email" required/><br/>
          <input type="password" onBlur={handleChange} name="password" placeholder="Your Password" required/>
          <br/>
          <input type="submit" value="Create Account"/> 
        </form>
        {
          user.error && <p style = {{ color: 'red' }}>{user.error}</p>
        }
    </div>
  );
}

export default App;
