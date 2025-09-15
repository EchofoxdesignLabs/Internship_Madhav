const button = document.getElementById("explore");
const box = document.getElementById("box");

function show(msg: string) {
  box!.textContent = msg;
  box!.classList.add("show");

  setTimeout(function() {
    box!.classList.remove("show");
   }, 3000);
}

button!.addEventListener("click", function() {
  show("Further Informations coming soon!");
});
