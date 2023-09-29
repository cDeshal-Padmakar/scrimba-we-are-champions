// getuserId
import { getUserId } from "./userid.js"
const user = getUserId()

import { initializeApp} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js"
import { getDatabase, ref, push, onValue, set} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js"

const endorsementInputTextEl = document.getElementById("endorsement-input-text")
const fromInputTextEl = document.getElementById("from-input-text")
const toInputTextEl = document.getElementById("to-input-text")
const publishBtnEl = document.getElementById("publish-btn")
const endorsementListEl = document.getElementById("endorsement-ul")


const appSettings = {
    databaseURL: "https://we-are-champions-938b2-default-rtdb.asia-southeast1.firebasedatabase.app/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementInDB = ref(database, "endorsements")




onValue(endorsementInDB, function(snapshot) {
    if(snapshot.exists())
    {
        let itemsArray = Object.entries(snapshot.val())
        clearEndorsementList()
        for(let i = 0; i < itemsArray.length; i++)
        {
            let currentItem = itemsArray[i]
            appendCurrentItemToEndorsementList(currentItem)
        }
    }
    else
    {
        clearEndorsementList()
    }
    
})

function appendCurrentItemToEndorsementList(item)
{
    let itemId = item[0]
    let itemObject = item[1]
    let likeArray = JSON.parse(itemObject.like)
    
    let newListEl = document.createElement("li")
    newListEl.innerHTML = 
        `
            <p class="bold">To ${itemObject.to}</p>
            <p id="mid">${itemObject.endorsement}</p>
            <p class="bold">From ${itemObject.from}<span class="like-span-container">🖤 ${likeArray.length}</span></p>
        `
    
    // like
    newListEl.addEventListener("click", function() {
        if(likeArray.includes(`${user}`))
        {
            const userIndexInLikeArray = likeArray.indexOf(`${user}`)
            likeArray.splice(userIndexInLikeArray, 1)
            let likeArrayToSting = JSON.stringify(likeArray)
            set(ref(database, `endorsements/${itemId}`), {
                endorsement: itemObject.endorsement,
                to: itemObject.to,
                from: itemObject.from,
                like: likeArrayToSting})
        }
        else
        {
            likeArray.push(`${user}`)
            let likeArrayToSting = JSON.stringify(likeArray)
            set(ref(database, `endorsements/${itemId}`), {
                endorsement: itemObject.endorsement,
                to: itemObject.to,
                from: itemObject.from,
                like: likeArrayToSting})
            
        }
    })

    endorsementListEl.append(newListEl)
    
}

publishBtnEl.addEventListener("click", function() {
    let input = getInput()
    if(input.from != "" && input.to != "" && input.endorsement != "")
    {
        push(endorsementInDB, input)
        clearInputText()
    }
})

function getInput() {
    let inputValue = {
        from: fromInputTextEl.value,
        to: toInputTextEl.value,
        endorsement: endorsementInputTextEl.value,
        like: `["${user}"]`
    }
    return inputValue
}

function clearEndorsementList() {
    endorsementListEl.innerText = ""
}

function clearInputText() {
    endorsementInputTextEl.value = ""
    fromInputTextEl.value = ""
    toInputTextEl.value = ""
}

