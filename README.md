# CHIP API Automation Solution

### This is a Sample Project to test APIs using JavaScript and Playwright. In this project you will find all the configurations & Test cases required to completely test the CREATE USER endpoint by Go Rest (https://gorest.co.in/)

#### Test Scenarios Covered

##### Happy Path cases:
- To successfully test CREATE USER post API endpoint with valid inputs
##### Non Happy / Negative cases:
- To test CREATE USER post API endpoint with invalid inputs
##### Edge Cases:
- To test for any other errors

#### PreRequisites
1. nodejs
2. Any IDE of your choice [I used VSCode]

#### Setup
1. Clone Repository from github using command below
    - git clone 
2. Open cloned Repository from vscode/Any IDE
3. open Terminal
4. In Project root directory  example: C:\Users\username\AnyFolder\chip>
5. Install All Dependencies using command >>> npm install >>> All dependencies must be installed here successfully

#### Test Execution Steps
1. execute tests using  >>> npx playwright test

#### Test Report
1. Verify HTML Test Execution Report using 
    ###### npx playwright show-report 
    OR
    ###### open index.html generated under ./playwright-report folder
