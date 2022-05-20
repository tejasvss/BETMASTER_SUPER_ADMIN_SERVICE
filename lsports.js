const axios=require('axios');

const data=async()=>{

    try{
const result=await axios.get("https://prematch.lsports.eu/OddService/GetSports?username=skystopcs@gmail.com&password=G735@dhu8T&guid=5a5b464d-9ad6-43c5-9f42-71a587c58cb0");
console.log("Data",result)
    }
    catch(error)
    {
        console.log("Error",error)
    }
}


data();
