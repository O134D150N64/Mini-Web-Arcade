// Initialize variables from their corresponding id matches
let character = document.getElementById("character");
let block = document.getElementById("block");
let counter = 0;

// Begin function to animate jumping
function jump() {
    if ( character.classList == "animate") {
        return;
    }
    character.classList.add("animate");
    setTimeout( function(){ // set a timeout to remove the animation
        character.classList.remove("animate");
    },300);
}

// Function to set an interval
var checkDead = setInterval(function() {
    let characterTop = parseInt( window.getComputedStyle(character).getPropertyValue("top") );
    let blockLeft = parseInt( window.getComputedStyle(block).getPropertyValue("left") );
    /* If the blocks colide, use an if else loop to return a statement telling the user that they lost,
    otherwise keep looping and adding the counter to display the final added score until the user has lost */ 
    if ( blockLeft < 20 && blockLeft >- 20 && characterTop >= 110 ){
        block.style.animation = "none";
        game_over = Math.floor(counter/100);
        alert("Game Over.");
        alert("Your score is : " + " " + game_over);
        counter = 0; // Set counter reset back to 0 once the game is concluded
        block.style.animation = "block 1s infinite linear"; // the block animation
    }
    else {
        counter++; // increment counter to build up total score
        document.getElementById("scoreSpan").innerHTML = Math.floor(counter/100); // display the final score    
    }
}, 10);