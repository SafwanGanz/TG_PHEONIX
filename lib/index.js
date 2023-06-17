import axios from "axios";

const getJson = async (url, options = {}) => {
  try {
    const res = await axios({
      method: "GET",
      url,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
      },
      ...options,
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

function verifyToken(token) {
    return new Promise(async (resolve, reject) => {
  const json = await getJson(`https://api.telegram.org/bot${token}/getMe`);
      if (json.ok==true) {
       resolve(true)
  
      }else{
          resolve(false)
      }
    });
  }

  export  {verifyToken,getJson}