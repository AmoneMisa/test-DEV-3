let input = document.querySelector(".input");
let form = document.querySelector(".main");
let messageContainer = document.querySelector(".message");

function checkIntersects(a, b) {
    let maxLeft = Math.max(a.left, b.left);
    let minRight = Math.min(a.right, b.right);
    let maxTop = Math.max(a.top, b.top);
    let minBottom = Math.min(a.bottom, b.bottom);

    return maxLeft <= minRight && maxTop < minBottom;
}

form.addEventListener("submit", function (evt) {
    evt.preventDefault();

    messageContainer.innerText = "";
    let prevRight = null;

    for (let l of input.value) {
        let letterContainer = document.createElement("span");
        letterContainer.innerText = l;
        messageContainer.appendChild(letterContainer);
        letterContainer.style.position = "absolute";

        if (prevRight !== null) {
            letterContainer.style.left = `${prevRight}px`;
        }

        prevRight = letterContainer.getBoundingClientRect().right;
    }

    let currentLetter = null;
    let currentLetterStartCoords = null;
    let currentLetterOffset = null;

    for (let letter of messageContainer.children) {
        letter.addEventListener("click", function (e) {
            if (currentLetter !== null) {
                return;
            }

            e.stopPropagation();
            currentLetter = this;
            currentLetterStartCoords = this.getBoundingClientRect();
            currentLetterOffset = {
                x: e.offsetX,
                y: e.offsetY
            };
        });
    }

    document.addEventListener("mousemove", function (e) {
        if (currentLetter === null) {
            return;
        }

        currentLetter.style.left = `${e.pageX - currentLetterOffset.x}px`;
        currentLetter.style.top = `${e.pageY - currentLetterOffset.y}px`;
    });

    document.addEventListener("click", function (e) {
        if (currentLetter === null) {
            return;
        }

        for (let letter of messageContainer.children) {
            if (letter === currentLetter) {
                continue;
            }

            if (checkIntersects(letter.getBoundingClientRect(), currentLetter.getBoundingClientRect())) {
                letter.style.left = `${currentLetterStartCoords.left}px`;
                letter.style.top = `${currentLetterStartCoords.top}px`;
            }
        }

        currentLetter = null;
        currentLetterStartCoords = null;
        currentLetterOffset = null;
    });

});