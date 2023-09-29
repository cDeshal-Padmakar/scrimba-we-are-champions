const letter = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]

export function getUserId()
{
    if(localStorage.getItem("userId") === null)
    {
        let userId = ""
        for(let i = 0; i < 16; i++)
        {
            let randomNum = Math.floor( Math.random()*15 )
            userId += letter[randomNum]
        }
        localStorage.setItem("userId", userId)
    }
    return ( localStorage.getItem("userId") )
}
