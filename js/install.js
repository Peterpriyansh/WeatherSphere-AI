let deferredPrompt;

window.addEventListener(
"beforeinstallprompt",
(e)=>{

e.preventDefault();

deferredPrompt = e;

const btn =
document.getElementById("installBtn");

if(btn){
btn.style.display="block";
}

});

document
.getElementById("installBtn")
?.addEventListener("click",
async()=>{

if(!deferredPrompt) return;

deferredPrompt.prompt();

await deferredPrompt.userChoice;

deferredPrompt = null;

});
