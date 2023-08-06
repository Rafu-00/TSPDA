const acceptMessage = "Accepted"
const rejectMessage = "Rejected"

var userInput = ""
var headPosition = 0
var stack0 = "Z"
var stack1 = "Z"
var instructions = new Array()
var isAccepted = false

function sleep(milliseconds) {  
    return new Promise(resolve => setTimeout(resolve, milliseconds));  
 }  

function createInstruction(heptuple){

    instructions.push({stateName: heptuple.stateName,
                         read: heptuple.read,
                         stack0Top: heptuple.stack0Top,
                         stack1Top: heptuple.stack1Top,
                         destination: heptuple.destination,
                         stack0PushSymbol: heptuple.stack0PushSymbol,
                         stack1PushSymbol: heptuple.stack1PushSymbol,
                         isStartState: heptuple.isStartState,
                         isEndState: heptuple.isEndState})
}

function setup(){

    userInput = ""
    headPosition = 0
    stack0 = "Z"
    stack1 = "Z"
    instructions = new Array()
    isAccepted = false

    $("#leftTapeTextArea").text("")
    $("#currentTapeTextArea").text("")
    $("#rightTapeTextArea").text("")


    const stringInput = $("#stringInputTextArea").val()
    const specsInput = $("#specsInputTextArea").val()

    if(stringInput == "" && specsInput == ""){
        alert("Please input string and state definitions")
        return
    }

    if(stringInput == ""){
        alert("Please input a string")
        return
    }

    if(specsInput == ""){
        alert("Please input state definitions")
        return
    }

    const currentChar = stringInput.charAt(0)
    const rightTape = stringInput.substring(1)
    userInput = stringInput

    console.log(userInput.length)

    $("#currentTapeTextArea").text(currentChar)
    $("#rightTapeTextArea").text(rightTape)

    var specs = specsInput.split('\n')
    var state
    
    for(let i = 0; i < specs.length; i++){
        
        state = specs[i].split(" ")
        
        createInstruction({stateName: state[0],
                            read: state[1],
                            stack0Top: state[2],
                            stack1Top: state[3],
                            destination: state[4],
                            stack0PushSymbol: state[5],
                            stack1PushSymbol: state[6],
                            isStartState: state[7],
                            isEndState: state[8]})
    }

    for(let i = 0; i < instructions.length; i++){

        if(instructions[i].isStartState == "*"){
            $("#currentStateTextArea").text(instructions[i].stateName)
            break;
        }
    }

    $("#stack0TextArea").text(stack0)
    $("#stack1TextArea").text(stack1)

    console.log(instructions)
}

async function nextState(currentState, characterRead, stack0Top, stack1Top){

    var newStack0
    var newStack1
    
    for(let i = 0; i < instructions.length; i++){

        // console.log(instructions[i].stateName)
        // console.log(instructions[i].read)
        // console.log(instructions[i].stack0Top)
        // console.log(instructions[i].stack1Top)

        if(currentState == instructions[i].stateName && characterRead == instructions[i].read && stack0Top == instructions[i].stack0Top && stack1Top == instructions[i].stack1Top){

            console.log("Regular next state")

            if(instructions[i].stack0PushSymbol != "λ"){

                newStack0 = ""
                newStack0 = instructions[i].stack0PushSymbol + stack0
                stack0 = newStack0
                
            }else{
                stack0 = stack0.slice(1)
            }

            if(instructions[i].stack1PushSymbol != "λ"){

                newStack1 = ""
                newStack1 = instructions[i].stack1PushSymbol + stack1
                stack1 = newStack1
            }else{
                stack1 = stack1.slice(1)
            }

            headPosition += 1

            await sleep(500)

            $("#stack0TextArea").text(stack0)
            $("#stack1TextArea").text(stack1)

            await sleep(500)

            $("#currentStateTextArea").text(instructions[i].destination)

            await sleep(500)

            if(instructions[i].isEndState != "&"){

                $("#leftTapeTextArea").text(userInput.substring(0, headPosition))
                $("#currentTapeTextArea").text(userInput.charAt(headPosition))
                $("#rightTapeTextArea").text(userInput.substring(headPosition + 1))
                
            }

            await sleep(500)
            break;
        }

        if(currentState == instructions[i].stateName && stack0Top == instructions[i].stack0Top && stack1Top == instructions[i].stack1Top && instructions[i].isEndState == "&"){

            await endState(currentState, stack0Top, stack1Top, instructions[i].isEndState)
            await sleep(500)
        }
    }
}

async function endState(currentState, stack0Top, stack1Top, isEndState){

    var newStack0
    var newStack1

    for(let i = 0; i < instructions.length; i++){

        if(currentState == instructions[i].stateName && stack0Top == instructions[i].stack0Top && stack1Top == instructions[i].stack1Top && isEndState == "&"){

            console.log("Entered final state")
    
            if(instructions[i].stack0PushSymbol != "λ"){
    
                newStack0 = ""
                newStack0 = instructions[i].stack0PushSymbol + stack0
                stack0 = newStack0           
            }else{

                stack0 = stack0.slice(1)
            }
    
            if(instructions[i].stack1PushSymbol != "λ"){
    
                newStack1 = ""
                newStack1 = instructions[i].stack1PushSymbol + stack1
                stack1 = newStack1
            }else{
                
                stack1 = stack1.slice(1)
            }

            headPosition -= 1

            await sleep(500)

            $("#stack0TextArea").text(stack0)
            $("#stack1TextArea").text(stack1)

            await sleep(500)

            $("#currentStateTextArea").text(instructions[i].destination)

            await sleep(500)


            $("#leftTapeTextArea").text(userInput.substring(0, headPosition))
            $("#currentTapeTextArea").text(userInput.charAt(headPosition))
            $("#rightTapeTextArea").text(userInput.substring(headPosition + 1))
                
    
            isAccepted = true

            await sleep(500)          

            break;
        }
    }

}

async function run(){

    var currentState, characterRead, stack0Top, stack1Top

    for(let i = 0; i < userInput.length + 1; i++){

        currentState =  $("#currentStateTextArea").val()
        characterRead = $("#currentTapeTextArea").text()
        stack0Top = stack0.charAt(0)
        stack1Top = stack1.charAt(0)
        
        console.log(currentState)
        console.log(characterRead)
        console.log(stack0Top)
        console.log(stack1Top)

        await nextState(currentState, characterRead, stack0Top, stack1Top)

        if(isAccepted == true && i < userInput.length){
            isAccepted = false
            break;
        }

        if(isAccepted == true){
            alert("String is accepted!")
            break;
        }
    }
    
    if(isAccepted != true){
        alert("String is rejected!")
    }
    
}

// To-do:
// - Handle λ reads (state transitions and end states)