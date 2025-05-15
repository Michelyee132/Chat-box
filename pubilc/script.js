async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value;
  if (!message.trim()) return;

  const chatDiv = document.getElementById("chat");
  chatDiv.innerHTML += `<p><b>You:</b> ${message}</p>`;
  input.value = "";

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  chatDiv.innerHTML += `<p><b>Gemini:</b> ${data.reply || "❌ Error"}</p>`;
}
