const { test, expect } = require('@playwright/test');
export class BaseService{

    constructor(response){
        this.response=response;
    }
    
    async getUserDetails(request,baseURL){
        return this.response = await request.get(`${baseURL}/public/v1/users/`);
    }


    async getUserDetailsById(request,baseURL,id){
        return this.response = await request.get(`${baseURL}/public/v1/users/${id}`);
    
    }

    async createUserDetails(request,baseURL,name,gender,email,status){
        return this.response = await request.post(`${baseURL}/public/v1/users`,{
            data:{
                "name":`${name}`, "gender":`${gender}`, "email":`${email}`, "status":`${status}`
            }
        });
    }

    async createUserDetailsInvalidToken(request,baseURL,name,gender,email,status){
        return this.response = await request.post(`${baseURL}/public/v1/users`,{
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer INVALID TOKEN"
            },
            data:{
                "name":`${name}`, "gender":`${gender}`, "email":`${email}`, "status":`${status}`
            }
        });
    }



    async createUserDetailsInvalidPayload(request,baseURL,name,gender,email,status){
        let requestBody = "{\n" +
        "    \"name: \"QATester\",\n" +
        "    \"gender: \"MALE\",\n" +
        "    \"email: \"eve.holt@reqres.in\",\n" +
        "    \"status\": \"active\"\n" +
        "}";

        return this.response = await request.post(`${baseURL}/public/v1/users`,{
            data:requestBody
        });
    }


    async deleteUserDetailsById(request,baseURL,id){
        return this.response = await request.delete(`${baseURL}/public/v1/users/${id}`);
    }

}