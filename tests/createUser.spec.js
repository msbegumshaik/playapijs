// @ts-check
const { test, expect } = require('@playwright/test');
const { BaseService } = require('./pages/BaseService');

test.describe.configure({ mode: 'serial' });
test.describe('Go Rest Create User API Test Suite',()=>{
  const base = new BaseService();
  let response;
  let USER_ID;
  let SC_UNPROCESSABLE_ENTITY =  Number(process.env.SC_UNPROCESSABLE_ENTITY);
  let SC_OK = Number(process.env.SC_OK);
  let SC_CREATED = Number(process.env.SC_CREATED);
  let SC_UNAUTHORIZED = Number(process.env.SC_UNAUTHORIZED);

  test.beforeAll('Happy-Path -> User should be able to create user successfully', async ({ request,baseURL }) => {
    response = await base.createUserDetails( request,baseURL,process.env.USER_NAME,process.env.GENDER_MALE,process.env.EMAIL,process.env.STATUS_ACTIVE);
    const jsonData = await response.json();
    USER_ID = jsonData.data.id;
    expect(response.status()).toBe(SC_CREATED);
    expect(jsonData.data.name).toEqual(process.env.USER_NAME);
    expect(jsonData.data.gender).toEqual(process.env.GENDER_MALE);
    expect(jsonData.data.email).toEqual(process.env.EMAIL);
    expect(jsonData.data.status).toEqual(process.env.STATUS_ACTIVE);
  });


  test.skip('User should be able to get all user details', async ({ request,baseURL }) => {
    response = await base.getUserDetails( request,baseURL);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(SC_OK);
  });

  test('Happy-Path -> User should be able to validate new user created successfully by ID', async ({ request,baseURL }) => {
    response = await base.getUserDetailsById( request,baseURL,USER_ID);
    const jsonData = await response.json();
    expect(response.status()).toBe(SC_OK);
    expect(jsonData.data.id).toEqual(USER_ID);
    expect(jsonData.data.name).toEqual(process.env.USER_NAME);
    expect(jsonData.data.gender).toEqual(process.env.GENDER_MALE);
    expect(jsonData.data.email).toEqual(process.env.EMAIL);
    expect(jsonData.data.status).toEqual(process.env.STATUS_ACTIVE);
  });


  test('Un-Happy-Path -> Create User => Duplicate email validation', async ({ request,baseURL }) => {
    response = await base.createUserDetails( request,baseURL,process.env.USER_NAME,process.env.GENDER_FEMALE,process.env.EMAIL,process.env.STATUS_ACTIVE);
    const jsonData = await response.json();
    expect(response.status()).toEqual(SC_UNPROCESSABLE_ENTITY);
    expect(jsonData.data[0].field).toEqual(process.env.FIELD_EMAIL);
    expect(jsonData.data[0].message).toEqual(process.env.EMAIL_DUPLICATE);
  });

  test('Un-Happy-Path -> Create User => Empty payload validation', async ({ request,baseURL }) => {
    response = await base.createUserDetails( request,baseURL,process.env.EMPTY_DATA,process.env.EMPTY_DATA,process.env.EMPTY_DATA,process.env.EMPTY_DATA);
    const jsonData = await response.json();
    expect(response.status()).toBe(SC_UNPROCESSABLE_ENTITY);
    expect(jsonData.data[0].field).toEqual(process.env.FIELD_EMAIL);
    expect(jsonData.data[0].message).toEqual(process.env.BLANK_OTHER_MSG);
    expect(jsonData.data[1].field).toEqual(process.env.FIELD_NAME);
    expect(jsonData.data[1].message).toEqual(process.env.BLANK_OTHER_MSG);
    expect(jsonData.data[2].field).toEqual(process.env.FIELD_GENDER);
    expect(jsonData.data[2].message).toEqual(process.env.BLANK_GENDER_MSG);
    expect(jsonData.data[3].field).toEqual(process.env.FIELD_STATUS);
    expect(jsonData.data[3].message).toEqual(process.env.BLANK_OTHER_MSG);
  });


  test('Un-Happy-Path -> Create User => Name field max length validation ', async ({ request,baseURL }) => {
    response = await base.createUserDetails( request,baseURL,process.env.USER_NAME_MAX,process.env.GENDER_FEMALE,"testemailforgorest@test.ae",process.env.STATUS_INACTIVE);
    const jsonData = await response.json();
    expect(response.status()).toBe(SC_UNPROCESSABLE_ENTITY);
    expect(jsonData.data[0].field).toEqual(process.env.FIELD_NAME);
    expect(jsonData.data[0].message).toEqual(process.env.ERROR_MSG_MAX_LENGTH);
  });


  test('Un-Happy-Path -> Create User => wrong gender input validation', async ({ request,baseURL }) => {
    response = await base.createUserDetails( request,baseURL,process.env.USER_NAME,"trans","testemailforgorest@test.ae",process.env.STATUS_INACTIVE);
    const jsonData = await response.json();
    expect(response.status()).toBe(SC_UNPROCESSABLE_ENTITY);
    expect(jsonData.data[0].field).toEqual(process.env.FIELD_GENDER);
    expect(jsonData.data[0].message).toEqual(process.env.INVALID_GENDER_MSG);
    /*
    Wrong gender input message has a typo
    */
    console.log("Wrong gender input message in response has a typo Should be or but it has of : ",jsonData.data[0].message)
  });

  test('Un-Happy-Path -> Create User => wrong status input validation', async ({ request,baseURL }) => {
    try{
      response = await base.createUserDetails( request,baseURL,process.env.USER_NAME,process.env.GENDER_MALE,"testemailforgorest123@test.ae","nostatus");
      const jsonData = await response.json();
      expect(response.status()).toBe(SC_UNPROCESSABLE_ENTITY);
      expect(jsonData.data[0].field).toEqual(process.env.FIELD_STATUS);
      expect(jsonData.data[0].message).toEqual(process.env.INVALID_STATUS_MSG);
    }catch(e){
      console.log("Invalid STATUS returns wrong error message : ",process.env.BLANK_OTHER_MSG)
    }
  });


  test('Edge-Case -> Create User => Invalid Bearer Token', async ({ request,baseURL }) => {
    response = await base.createUserDetailsInvalidToken( request,baseURL,process.env.USER_NAME,process.env.GENDER_FEMALE,"testemailforgorest@test.ae",process.env.STATUS_INACTIVE);
    const jsonData = await response.json();
    expect(response.status()).toBe(SC_UNAUTHORIZED);
    expect(jsonData.data.message).toEqual(process.env.INVALID_TOKEN_MSG);
  });

  test('Edge-Case -> Create User => Invalid pay load', async ({ request,baseURL }) => {
    response = await base.createUserDetailsInvalidPayload( request,baseURL,process.env.USER_NAME,process.env.GENDER_FEMALE,"testemailforgorest@test.ae",process.env.STATUS_INACTIVE);
    const jsonData = await response.json();
    expect(response.status()).toBe(SC_UNAUTHORIZED);
    console.log("Invalid payload returns wrong error message : ",process.env.INVALID_PAYLOAD_MSG)
    expect(jsonData.data.message).toEqual(process.env.INVALID_PAYLOAD_MSG);
  });



  test.afterAll('tear down delete User', async ({request,baseURL})=>{
    console.log(USER_ID);
    await base.deleteUserDetailsById(request,baseURL,USER_ID);
  })


})

