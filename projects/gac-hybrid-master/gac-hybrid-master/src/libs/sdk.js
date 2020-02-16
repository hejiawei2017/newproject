window.GAC.accessToken = getToken();

function getToken (){
    if(window.GacJSBridge){
        return window.GacJSBridge.getToken()
    }else{
        return `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtc2ciOiJzdWNjZXNzIiwibGljZW5zZSI6Im1hZGUgYnkgZ2FjLW5pbyIsImNvZGUiOjAsImRhdGEiOm51bGwsInVzZXJfbmFtZSI6IjEzNDAxMDI5Mjg1MTU1NTU1NjY0ODc1OCIsInNjb3BlIjpbInNlcnZlciJdLCJleHAiOjE1NjUyNzQ3ODUsInVzZXJJZCI6MTkxLCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiLCJhcHBfc3Bfcm9sZSJdLCJqdGkiOiIzZjM4ZDliZC02MWY1LTRiM2MtOTdlNS1hMWU2MzJhOTA1NjYiLCJjbGllbnRfaWQiOiJ3ZWl4aW4tY2xpZW50In0.o0pnIS7NPEvwuzT0IFUtiun-4ZUkN8RBcEZ4A2-DLig`
    }

}