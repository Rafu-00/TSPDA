const acceptMessage = "Accepted"
const rejectMessage = "Rejected"

var userInput = ""
var headPosition = 0
var stack0 = ""
var stack1 = ""
var isStopped = false
var isAccepted = false

var numberOfStates = 0
var inputAlphabet = new Array()
var stack0Alphabet = new Array()
var stack1Alphabet = new Array()
var instructions = new Array()
var initialState = ""
var stack0InitialSymbol = ""
var stack1InitialSymbol = ""
var finalStates = new Array()

var adjList = new Array()

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

function stop(){
    
    isStopped = true
}

async function buildAdjList(){

    for(let i = 0; i < instructions.length; i++){
        
        adjList.push({stateName: instructions[i].stateName, destination: instructions[i].destination})
        console.log("Adj list no: " + i)
    }
}

function customPreset(){
    $("#leftTapeTextArea").text("")
    $("#currentTapeTextArea").text("")
    $("#rightTapeTextArea").text("")
    $("#currentTimelineTextArea").text("")
    $("#specsInputTextArea").val("")
    $("#stringInputTextArea").val("")
}

function secondPreset(){
    let string = `7\na b c\na b\na b\nstart a Z Z loopA a λ * _\nloopA a a Z loopA a λ _ _\nloopA b a Z loopB ^ b _ _\nloopB b a b loopB ^ b _ _\nloopB c Z b loopC λ ^ _ _\nloopC c Z b loopC λ ^ _ _\nloopC λ Z Z loopC ^ ^ _ &\nstart\nZ\nZ\nloopC`

    $("#leftTapeTextArea").text("")
    $("#currentTapeTextArea").text("a")
    $("#rightTapeTextArea").text("aabbbccc")
    $("#specsInputTextArea").val(string)
    $("#stringInputTextArea").val("aaabbbccc")
}

function setup(){

    userInput = ""
    headPosition = 0
    stack0 = ""
    stack1 = ""
    instructions = new Array()
    isAccepted = false
    isStopped = false
    adjList = new Array()

    $("#leftTapeTextArea").text("")
    $("#currentTapeTextArea").text("")
    $("#rightTapeTextArea").text("")
    $("#currentTimelineTextArea").text("")


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

    var specs = specsInput.split('\n')
    var state
    
    for(let i = 0; i < specs.length; i++){
        
        state = specs[i].split(" ")

        if(i == 0){

            numberOfStates = parseInt(state[0]) 
        }else if(i == 1){

            for(let j = 0; j < state.length; j++){
                inputAlphabet.push(state[j])
            }
        }else if(i == 2){

            for(let j = 0; j < state.length; j++){
                stack0Alphabet.push(state[j])
            }
        }else if(i == 3){

            for(let j = 0; j < state.length; j++){
                stack1Alphabet.push(state[j])
            }
        }else if(i == specs.length - 4){

            initialState = state[0]
        }else if(i == specs.length - 3){

            stack0InitialSymbol = state[0]
            stack0 = stack0 + stack0InitialSymbol
        }else if(i == specs.length - 2){

            stack1InitialSymbol = state[0]
            stack1 = stack1 + stack1InitialSymbol
        }else if(i == specs.length - 1){

            for(let j = 0; j < state.length; j++){
                finalStates.push(state[j])
            }
        }else{

            createInstruction({stateName: state[0],
                               read: state[1],
                               stack0Top: state[2],
                               stack1Top: state[3],
                               destination: state[4],
                               stack0PushSymbol: state[5],
                               stack1PushSymbol: state[6]})
        }
    }

    buildAdjList()

    $("#currentTapeTextArea").text(currentChar)
    $("#rightTapeTextArea").text(rightTape)

    $("#currentStateTextArea").text(initialState)

    $("#stack0TextArea").text(stack0)
    $("#stack1TextArea").text(stack1)

    console.log(instructions)
    console.log(adjList)
}

async function nextState(currentState, characterRead, stack0Top, stack1Top){

    var newStack0
    var newStack1
    
    for(let i = 0; i < instructions.length; i++){

        if(isStopped == true){
            alert("You stopped the machine. Press Set and then Run again.")
            break;
        }

        if(currentState == instructions[i].stateName && stack0Top == instructions[i].stack0Top && stack1Top == instructions[i].stack1Top && finalStates.includes(instructions[i].destination) == true){

            await endState(currentState, stack0Top, stack1Top, instructions[i].isEndState)
            await sleep(500)
        }

        if(currentState == instructions[i].stateName && instructions[i].read == "λ" && stack0Top == instructions[i].stack0Top && stack1Top == instructions[i].stack1Top && instructions[i].stack0PushSymbol != "^" && instructions[i].stack1PushSymbol != "^"){

            console.log("No changes next state")

            if(instructions[i].stack0PushSymbol != "λ" && instructions[i].stack0PushSymbol != "^"){

                newStack0 = ""
                newStack0 = instructions[i].stack0PushSymbol + stack0
                stack0 = newStack0
            }else if(instructions[i].stack0PushSymbol == "^"){

                stack0 = stack0.slice(1)
            }else{
                stack0 = stack0
            }

            // if(instructions[i].stack0PushSymbol != "λ"){

            //     newStack0 = ""
            //     newStack0 = instructions[i].stack0PushSymbol + stack0
            //     stack0 = newStack0
                
            // }else{
            //     stack0 = stack0.slice(1)
            // }

            if(instructions[i].stack1PushSymbol != "λ" && instructions[i].stack1PushSymbol != "^"){

                newStack1 = ""
                newStack1 = instructions[i].stack1PushSymbol + stack1
                stack1 = newStack1
            }else if(instructions[i].stack1PushSymbol == "^"){

                stack1 = stack1.slice(1)
            }else{

                stack1 = stack1
            }

            // if(instructions[i].stack1PushSymbol != "λ"){

            //     newStack1 = ""
            //     newStack1 = instructions[i].stack1PushSymbol + stack1
            //     stack1 = newStack1
            // }else{
            //     stack1 = stack1.slice(1)
            // }

            await sleep(500)

            $("#stack0TextArea").text(stack0)
            $("#stack1TextArea").text(stack1)

            await sleep(500)

            $("#currentStateTextArea").text(instructions[i].destination)

            await sleep(500)

            $("#currentTimelineTextArea").text($("#currentTimelineTextArea").val() + currentState + " -> ")

            await sleep(500)

            if(instructions[i].isEndState != "&"){

                $("#leftTapeTextArea").text(userInput.substring(0, headPosition))
                $("#currentTapeTextArea").text(userInput.charAt(headPosition))
                $("#rightTapeTextArea").text(userInput.substring(headPosition + 1))
                
            }

            await sleep(500)
            break;
        }

        if(currentState == instructions[i].stateName && characterRead == instructions[i].read && stack0Top == instructions[i].stack0Top && stack1Top == instructions[i].stack1Top){

            console.log("Regular next state")

            if(instructions[i].stack0PushSymbol != "λ" && instructions[i].stack0PushSymbol != "^"){

                newStack0 = ""
                newStack0 = instructions[i].stack0PushSymbol + stack0
                stack0 = newStack0
            }else if(instructions[i].stack0PushSymbol == "^"){

                stack0 = stack0.slice(1)
            }else{
                stack0 = stack0
            }

            // if(instructions[i].stack0PushSymbol != "λ"){

            //     newStack0 = ""
            //     newStack0 = instructions[i].stack0PushSymbol + stack0
            //     stack0 = newStack0
                
            // }else{
            //     stack0 = stack0.slice(1)
            // }

            if(instructions[i].stack1PushSymbol != "λ" && instructions[i].stack1PushSymbol != "^"){

                newStack1 = ""
                newStack1 = instructions[i].stack1PushSymbol + stack1
                stack1 = newStack1
            }else if(instructions[i].stack1PushSymbol == "^"){

                stack1 = stack1.slice(1)
            }else{

                stack1 = stack1
            }

            // if(instructions[i].stack1PushSymbol != "λ"){

            //     newStack1 = ""
            //     newStack1 = instructions[i].stack1PushSymbol + stack1
            //     stack1 = newStack1
            // }else{
            //     stack1 = stack1.slice(1)
            // }

            headPosition += 1

            await sleep(500)

            $("#stack0TextArea").text(stack0)
            $("#stack1TextArea").text(stack1)

            await sleep(500)

            $("#currentStateTextArea").text(instructions[i].destination)

            await sleep(500)

            $("#currentTimelineTextArea").text($("#currentTimelineTextArea").val() + currentState + " -> ")

            await sleep(500)

            if(instructions[i].isEndState != "&"){

                $("#leftTapeTextArea").text(userInput.substring(0, headPosition))
                $("#currentTapeTextArea").text(userInput.charAt(headPosition))
                $("#rightTapeTextArea").text(userInput.substring(headPosition + 1))
                
            }

            await sleep(500)
            break;
        }
    }
}

async function endState(currentState, stack0Top, stack1Top, isEndState){

    var newStack0
    var newStack1

    for(let i = 0; i < instructions.length; i++){

        if(isStopped == true){
            alert("You stopped the machine. Press Set and then Run again.")
            break;
        }

        if(currentState == instructions[i].stateName && stack0Top == instructions[i].stack0Top && stack1Top == instructions[i].stack1Top && finalStates.includes(currentState) == true){

            console.log("Entered final state")

            if(instructions[i].stack0PushSymbol != "λ" && instructions[i].stack0PushSymbol != "^"){

                newStack0 = ""
                newStack0 = instructions[i].stack0PushSymbol + stack0
                stack0 = newStack0
            }else if(instructions[i].stack0PushSymbol == "^"){

                stack0 = stack0.slice(1)
            }else{
                
                continue
            }
    
            // if(instructions[i].stack0PushSymbol != "λ"){
    
            //     newStack0 = ""
            //     newStack0 = instructions[i].stack0PushSymbol + stack0
            //     stack0 = newStack0           
            // }else{

            //     stack0 = stack0.slice(1)
            // }

            if(instructions[i].stack1PushSymbol != "λ" && instructions[i].stack1PushSymbol != "^"){

                newStack1 = ""
                newStack1 = instructions[i].stack1PushSymbol + stack1
                stack1 = newStack1
            }else if(instructions[i].stack1PushSymbol == "^"){

                stack1 = stack1.slice(1)
            }else{

                continue
            }
    
            // if(instructions[i].stack1PushSymbol != "λ"){
    
            //     newStack1 = ""
            //     newStack1 = instructions[i].stack1PushSymbol + stack1
            //     stack1 = newStack1
            // }else{
                
            //     stack1 = stack1.slice(1)
            // }

            headPosition -= 1

            await sleep(500)

            $("#stack0TextArea").text(stack0)
            $("#stack1TextArea").text(stack1)

            await sleep(500)

            $("#currentStateTextArea").text(instructions[i].destination)

            await sleep(500)

            $("#currentTimelineTextArea").text($("#currentTimelineTextArea").val() + currentState)

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

        if(isStopped == true){
            alert("You stopped the machine. Press Set and then Run again.")
            break;
        }

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
    
    if(isAccepted != true && isStopped != true){
        alert("String is rejected!")      
    }
    
}

// To-do:
// - Handle λ reads (state transitions and end states)