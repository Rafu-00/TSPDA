const acceptMessage = "Accepted"
const rejectMessage = "Rejected"

var userInput = ""
var headPosition = 0
var tape = ""
var stack0 = "Z"
var stack1 = "Z"
var instructions = new Array()

var isFinalState = false

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
                         stack1PushSymbol: heptuple.stack1PushSymbol})
}

function setup(){

    userInput = ""
    headPosition = 0
    tape = ""
    stack0 = "Z"
    stack1 = "Z"
    instructions = new Array()
    isFinalState = false


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
                            stack1PushSymbol: state[6]})

    }

    const firstChar = stringInput.charAt(0)

    for(let i = 0; i < instructions.length; i++){

        if(instructions[i].read == firstChar && instructions[i].stack0Top == "Z" && instructions[i].stack1Top == "Z"){
            $("#currentStateTextArea").text(instructions[i].stateName)
            break;
        }
    }

    $("#stack0TextArea").text(stack0)
    $("#stack1TextArea").text(stack1)

    console.log(instructions)
}

async function nextState(currentState, characterRead, stack0Top, stack1Top){
    
    for(let i = 0; i < instructions.length; i++){

        if(currentState == instructions[i].stateName && characterRead == instructions[i].read && stack0Top == instructions[i].stack0Top && stack1Top == instructions[i].stack1Top){
            
            $("#currentStateTextArea").text(instructions[i].destination)
            
            await sleep(1000)

            if(instructions[i].stack0PushSymbol != "λ"){

                var newStack0 = instructions[i].stack0PushSymbol + stack0
                stack0 = newStack0
                $("#stack0TextArea").text(stack0)
            }else{
                stack0 = stack0.slice(1)
                $("#stack0TextArea").text(stack0)
            }

            await sleep(1000)

            if(instructions[i].stack1PushSymbol != "λ"){

                var newStack1 = instructions[i].stack1PushSymbol + stack1
                stack1 = newStack1
                $("#stack0TextArea").text(stack1)
            }else{
                stack1 = stack1.slice(1)
                $("#stack0TextArea").text(stack1)
            }

            await sleep(1000)

            headPosition += 1
            $("#leftTapeTextArea").text(userInput.substring(0, headPosition - 1))
            $("#currentTapeTextArea").text(userInput.charAt(headPosition))
            $("#rightTapeTextArea").text(userInput.substring(headPosition + 1))

            if(characterRead == "λ" && instructions[i].stack0Top == "Z" && instructions[i].stack1Top == "Z" && instructions[i].stack0PushSymbol == "λ" && instructions[i].stack1PushSymbol == "λ"){
                isFinalState = true
            }

            break;
        }

        if(currentState == instructions[i].stateName && characterRead == "λ" && stack0Top == instructions[i].stack0Top && stack1Top == instructions[i].stack1Top){
            $("#currentStateTextArea").text(instructions[i].destination)

            if(instructions[i].stack0PushSymbol != "λ"){

                var newStack0 = instructions[i].stack0PushSymbol + stack0
                stack0 = newStack0
                $("#stack0TextArea").text(stack0)
            }else{
                stack0 = stack0.slice(1)
                $("#stack0TextArea").text(stack0)
            }

            if(instructions[i].stack1PushSymbol != "λ"){

                var newStack1 = instructions[i].stack1PushSymbol + stack1
                stack1 = newStack1
                $("#stack0TextArea").text(stack1)
            }else{
                stack1 = stack1.slice(1)
                $("#stack0TextArea").text(stack1)
            }

            isFinalState = true
            
            break;
        }
    }
}

async function run(){

    var currentState, characterRead, stack0Top, stack1Top

    for(let i = 0; i < userInput.length; i++){

        currentState =  $("#currentStateTextArea").val()
        characterRead = $("#currentTapeTextArea").text()
        stack0Top = stack0.charAt(0)
        stack1Top = stack1.charAt(0)

        nextState(currentState, characterRead, stack0Top, stack1Top)

        await sleep(1000)

        if(isFinalState == true){
            alert("String is accepted!")
            break;
        }

        console.log(currentState)
        console.log(characterRead)
        console.log(stack0Top)
        console.log(stack1Top)
    }

    await sleep(1000)
    
    alert("String is rejected!")
}