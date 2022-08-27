/*
* SimpleKeys
* strength.js
* 26/ago/2022
*/

const { ipcRenderer } = require("electron");

const passwordInput = document.getElementById("inpPassword");
const passTestInput = document.getElementById("inpTestPassword");
const passwordStrength = document.getElementById("password-strength");

passwordInput.addEventListener("input", function(){
    const val = passwordInput.value;
    let result = zxcvbn(val);
    passwordStrength.className = "strength-" + result.score;
});

passTestInput.addEventListener("input", function(){
    const val = passwordInput.value;
    const valT = passTestInput.value;

    if (val === valT) {
        document.getElementById("feedback").style.display = "none";
        document.getElementById("feedback1").style.display = "block";
    } else {
        document.getElementById("feedback").style.display = "block";
        document.getElementById("feedback1").style.display = "none";
    }
})

export function download(data = "", type = ".db"){
    let nomeArquivo = document.getElementById("inputNomeArq").value;
    let s = document.getElementById("s");
    let toDownload = nomeArquivo + type;
    let file = new Blob([data], {type: type});
    s.href = URL.createObjectURL(file);
    s.download = toDownload;

    ipcRenderer.send("arquivo:novo:path");
}