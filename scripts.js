const acceptMessage = "Accepted"
const rejectMessage = "Rejected"

var userInput = ""
var headPosition = 0
var tape = new Array()
var stack0 = new Array()
var stack1 = new Array()
var instructions = new Array()

var isFinalState = false

function createInstruction(quantuple){
    instructions.append({origin: {stateName: quantuple.name,
                                  characterRead: quantuple.characterRead,
                                  stackTop: quantuple.stackTop}}, 
                        {destination: {destinationState: quantuple.destination,
                                       popCharacter: quantuple.popCharacter}})
}

function setTape(){
    const tapeString = $("#stringInputTextArea").val()
    userInput = tapeString
    $("#tapeTextArea").text(tapeString)
}