let tutorialIndex = 0;
const tutorialPages = [
    `<h2>Welcome!</h2>
     <p>This tutorial will show you how to use the page.</p>`,

    `<h2>Random Expression</h2>
     <p>Click the "Random Expression" button to highlight a random expression!</p>`,

    `<h2>Character Sets</h2>
     <p>Use the dropdown to switch character sets!</p>`,

    `<h2>Dark Mode</h2>
     <p>Press the "Dark Mode" button to toggle between light and dark themes.</p>`
];

function openTutorial() {
    document.getElementById("tutorial-window").style.display = "block";
    updateTutorialContent();
}

function closeTutorial() {
    document.getElementById("tutorial-window").style.display = "none";
}

function nextTutorialPage() {
    if (tutorialIndex < tutorialPages.length - 1) {
        tutorialIndex++;
        updateTutorialContent();
    }
}

function prevTutorialPage() {
    if (tutorialIndex > 0) {
        tutorialIndex--;
        updateTutorialContent();
    }
}

function goToPage(index) {
    tutorialIndex = index;
    updateTutorialContent();
}

function updateTutorialContent() {
    document.getElementById("tutorial-body").innerHTML = tutorialPages[tutorialIndex];
}

// Make the tutorial window draggable
const tutorialWindow = document.getElementById("tutorial-window");
const titleBar = document.getElementById("tutorial-title-bar");

let isDragging = false;
let offsetX, offsetY;

titleBar.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - tutorialWindow.getBoundingClientRect().left;
    offsetY = e.clientY - tutorialWindow.getBoundingClientRect().top;
    tutorialWindow.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;

    // Keep the window within the screen bounds
    const maxX = window.innerWidth - tutorialWindow.offsetWidth;
    const maxY = window.innerHeight - tutorialWindow.offsetHeight;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    tutorialWindow.style.left = `${newX}px`;
    tutorialWindow.style.top = `${newY}px`;
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    tutorialWindow.style.cursor = "grab";
});



let lastHighlightedIndex = -1; // Store the last highlighted index

function randomExpression() {
    document.querySelectorAll('.expression').forEach(exp => exp.classList.remove('highlighted'));

    let expressions = document.querySelectorAll('.expression');
    let randomIndex;

    // Keep picking a new index until it's different from the last one
    do {
        randomIndex = Math.floor(Math.random() * expressions.length);
    } while (randomIndex === lastHighlightedIndex);

    let chosenExpression = expressions[randomIndex];
    chosenExpression.classList.add('highlighted');

    lastHighlightedIndex = randomIndex; // Update last highlighted index

    setTimeout(() => {
        chosenExpression.classList.remove('highlighted');
    }, 3000);
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');

    // Update border color if an expression is highlighted
    let highlighted = document.querySelector('.highlighted');
    if (highlighted) {
        //mick was here
    }
}
// Character sets with corresponding images and hover text
const expressionSets = {
    nb: {
        images: ["happynb.png", "sadnb.png", "pleasednb.png", "angrynb.png", "confusednb.png"],
        hoverText: ["yay he smile!!", "nooo he sad :(", "he is pleased!", "he is very angry!!", "he is so confused???"]
    },
    mick: {
        images: ["happymick.png", "sadmick.png", "pleasedmick.png", "angrymick.png", "confusedmick.png"],
        hoverText: ["he so happy!", "why he so sad :(", "very pleased indeed!", "mick is mad >:(", "mick is confused???"]
    }
};

function updateExpressions() {
    let selectedSet = document.getElementById("characterSelect").value;
    let expressions = document.querySelectorAll(".expression img");
    let hoverTexts = document.querySelectorAll(".expression-hover-text");

    expressions.forEach((img, index) => {
        if (expressionSets[selectedSet].images[index]) {
            img.src = expressionSets[selectedSet].images[index];
        }
    });

    hoverTexts.forEach((text, index) => {
        if (expressionSets[selectedSet].hoverText[index]) {
            text.textContent = expressionSets[selectedSet].hoverText[index];
        }
    });
}
// Open and close the side panel
function toggleComparisonPanel() {
    let panel = document.getElementById("expression-comparison");
    panel.classList.toggle("active");
}

// Allow dragging an expression (Desktop)
document.querySelectorAll(".expression img").forEach(img => {
    img.setAttribute("draggable", "true");
    img.addEventListener("dragstart", dragExpression);
});

function dragExpression(event) {
    event.dataTransfer.setData("text", event.target.src); // Store image source
}

function allowDrop(event) {
    event.preventDefault();
}

// Drop expression into a slot (Desktop)
function dropExpression(event, slot) {
    event.preventDefault();
    let imageSrc = event.dataTransfer.getData("text");

    let dropZone = document.getElementById(`drop-zone-${slot}`);
    let img = dropZone.querySelector("img");
    let placeholder = dropZone.querySelector("p");

    img.src = imageSrc;
    img.style.display = "block";
    placeholder.style.display = "none"; // Hide placeholder text

    updateComparisonText();
}

// Tap to select expressions (Mobile-Friendly)
let selectedSlot = null;

function selectExpression(slot) {
    selectedSlot = slot;
}

document.querySelectorAll(".expression img").forEach(img => {
    img.addEventListener("click", function () {
        if (selectedSlot !== null) {
            let dropZone = document.getElementById(`drop-zone-${selectedSlot}`);
            let imgElement = dropZone.querySelector("img");
            let placeholder = dropZone.querySelector("p");

            imgElement.src = this.src;
            imgElement.style.display = "block";
            placeholder.style.display = "none";

            updateComparisonText();
            selectedSlot = null;
        }
    });
});

// Generates a description when two expressions are placed
function updateComparisonText() {
    let img1 = document.getElementById("comp-image-1").src;
    let img2 = document.getElementById("comp-image-2").src;

    if (img1 && img2) {
        document.getElementById("comp-description").innerText = "Notice the differences in facial structure, emotion, and intensity.";
    }
}
