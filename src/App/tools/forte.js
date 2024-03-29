/*
* SimpleKeys
* forte.js
* 26/ago/2022
*/

const passwordInput = document.getElementById("inpPassword");
const passTestInput = document.getElementById("inpTestPassword");
const passwordStrength = document.getElementById("password-strength");
const feedback = document.getElementById("feedback");
const feedbackTest = document.getElementById("feedbackTest");

const eye = document.getElementById("eye");
const eyeShown = document.getElementById("eyeShown");
let pwShown = false;
const eye1 = document.getElementById("eye1");
const eye1Shown = document.getElementById("eye1Shown");
let pw1Shown = false;

passwordInput.addEventListener("input", function(){
    const val = passwordInput.value;
    const valT = passTestInput.value;
    let result = zxcvbn(val);
    passwordStrength.className = "strength-" + result.score;

    if (val === valT) {
        feedback.style.display = "none";
        feedbackTest.style.display = "block";
    } else {
        feedback.style.display = "block";
        feedbackTest.style.display = "none";
    }
});

passTestInput.addEventListener("input", function(){
    const val = passwordInput.value;
    const valT = passTestInput.value;

    if (val === valT) {
        feedback.style.display = "none";
        feedbackTest.style.display = "block";
    } else {
        feedback.style.display = "block";
        feedbackTest.style.display = "none";
    }
})

eye.addEventListener("click", () => {
    if (pwShown == false) {
        eye.style.display = "none";
        eyeShown.style.display = "block";
        passwordInput.setAttribute("type", "text");

        pwShown = true;
    } else {
        eye.style.display = "block";
        eyeShown.style.display = "none";
        passwordInput.setAttribute("type", "password");

        pwShown = false;
    }
});

eyeShown.addEventListener("click", () => {
    if (pwShown == false) {
        eye.style.display = "none";
        eyeShown.style.display = "block";
        passwordInput.setAttribute("type", "text");

        pwShown = true;
    } else {
        eye.style.display = "block";
        eyeShown.style.display = "none";
        passwordInput.setAttribute("type", "password");

        pwShown = false;
    }
});

eye1.addEventListener("click", () => {
    if (pw1Shown == false) {
        eye1.style.display = "none";
        eye1Shown.style.display = "block";
        passTestInput.setAttribute("type", "text");

        pw1Shown = true;
    } else {
        eye1.style.display = "block";
        eye1Shown.style.display = "none";
        passTestInput.setAttribute("type", "password");

        pw1Shown = false;
    }
});

eye1Shown.addEventListener("click", () => {
    if (pw1Shown == false) {
        eye1.style.display = "none";
        eye1Shown.style.display = "block";
        passTestInput.setAttribute("type", "text");

        pw1Shown = true;
    } else {
        eye1.style.display = "block";
        eye1Shown.style.display = "none";
        passTestInput.setAttribute("type", "password");

        pw1Shown = false;
    }
});