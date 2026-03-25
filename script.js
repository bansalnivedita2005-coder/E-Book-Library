const chatBox = document.getElementById("chatBox");
const inputField = document.getElementById("userInput");

// ENTER KEY SUPPORT
inputField.addEventListener("keypress", function (event) {
  if (event.key === "Enter" && inputField.value.trim() !== "") {
    sendMessage();
  }
});

function sendMessage() {
  const userText = inputField.value.trim();

  if (userText === "") return;

  addMessage(userText, "user");

  fetchBooks(userText);

  inputField.value = "";
}

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function fetchBooks(query) {
  try {
    showTyping();

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}`
    );

    const data = await response.json();

    removeTyping();

    if (!data.items) {
      addMessage("❌ No books found. Try another keyword!", "bot");
      return;
    }

    data.items.slice(0, 5).forEach(book => {
      const info = book.volumeInfo;

      const title = info.title || "No Title";
      const author = info.authors ? info.authors.join(", ") : "Unknown";
      const thumbnail = info.imageLinks?.thumbnail || "";

      const card = document.createElement("div");
      card.classList.add("message", "bot");

      card.innerHTML = `
        <div class="book-card">
          <img src="${thumbnail}" />
          <div class="book-info">
            <p><b>${title}</b></p>
            <p>${author}</p>
          </div>
        </div>
      `;

      chatBox.appendChild(card);
    });

    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (error) {
    removeTyping();
    addMessage("⚠️ Error fetching books.", "bot");
  }
}

// Typing animation
function showTyping() {
  const typing = document.createElement("div");
  typing.classList.add("message", "bot");
  typing.id = "typing";
  typing.innerText = "🤖 Typing...";
  chatBox.appendChild(typing);
}

function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}