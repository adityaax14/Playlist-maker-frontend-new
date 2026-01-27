import React from "react";

const BASE_URL="http://localhost:8000/api/v2/courses";

export const fetchCourses= async()=>{
   const res= await fetch(BASE_URL,{
     credentials: "include"
   });
   return res.json();
};

export const createCourse= async(data)=>{
  const res=await fetch(BASE_URL,{
    method:"POST",
    headers:{
      "Content-Type": "application/json"
    },
    credentials: "include",
    body:JSON.stringify(data)

  });
  return res.json();
}

