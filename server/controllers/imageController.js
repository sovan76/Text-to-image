
import userModel from '../models/userModel.js';
import FormData from 'form-data';
import axios from 'axios';


export const generateImage = async (req, res) => {
  try {
    const {userId, prompt } = req.body;
    
    const user =  await userModel.findById(userId);

    if (!user || ! prompt) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    if (user.creditBalance <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Insufficient credits'
        });
    }
    
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('n', 1);
    formData.append('size', '1024x1024');

    const  {data} = axios.post('https://api.openai.com/v1/images/generations', formData, {
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'multipart/form-data'
        },
        responseType: 'arraybuffer'
    }); 

    const base64Image = Buffer.from(data, 'binary').toString('base64');

    user.creditBalance -= 1;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Image generated successfully",
        image: base64Image,
        creditBalance: user.creditBalance 
    });

  } catch (error) {
    console.error('Image Generation Error:', error);
    res.status(500).json({  
        success: false, 
        message: error.message
    });
    }
};