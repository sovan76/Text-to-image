
import { createContext, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();  

const AppContextProvider = (props) => {

     const [user, setUser] = useState(null);
     const [isLoginOpen, setIsLoginOpen] = useState(false);
     const [credit, setCredit] = useState(0);
     const [token, setToken] = useState(localStorage.getItem('token') || null);
     const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

     const navigate = useNavigate();
    
const loadCreditsData = async () => {
  try {
    console.log("TOKEN:", token);

    const { data } = await axios.get(
      `${backendUrl}/api/user/credits`,
      {
        headers: {
          token: token,
        },
      }
    );

    console.log("CREDITS RESPONSE:", data);

    if (data.success) {
      setCredit(data.creditBalance);
      setUser(data.user);
    }
  } catch (error) {
    console.log(
      "CREDITS ERROR:",
      error.response?.data || error
    );
  }
};

 const  generateImage = async (prompt) => {
  try {
    const { data } = await axios.post(
      `${backendUrl}/api/image/generate-image`,
      { prompt },
      {
        headers: {
        token: token,
        },
      }
    );
    if (data.success) {
      loadCreditsData();
      return data.image;
    }else{
      throw new Error(data.message || "Image generation failed");
      loadCreditsData();
      if(data.creditBalance == 0){
        navigate('/pricing'); // Redirect to credits page if balance is zero
      }
    }
  } catch (error) {
    console.log(
      "GENERATE ERROR:",
      error.response?.data || error
    );
  }
};

useEffect(() => {
  if (token) {
    loadCreditsData();
  }
}, [token]);
     
     // logout
     const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
     };

     const value= {
        user,loadCreditsData, setUser, isLoginOpen, setIsLoginOpen, backendUrl, token, setToken ,credit, setCredit, logout,
          generateImage
     }
  

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
      )
}

export default AppContextProvider;
    