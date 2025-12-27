function showChat() {
  document.getElementById("chat-view").classList.remove("d-none");
  document.getElementById("history-view").classList.add("d-none");
  document.getElementById("chatInput").classList.remove("d-none");
  document.getElementById("tab-chat").classList.add("active");
  document.getElementById("tab-history").classList.remove("active");
}

function showHistory() {
  document.getElementById("chat-view").classList.add("d-none");
  document.getElementById("history-view").classList.remove("d-none");
  document.getElementById("chatInput").classList.add("d-none");
  document.getElementById("tab-chat").classList.remove("active");
  document.getElementById("tab-history").classList.add("active");
}

const customerLogs = {
  "ICA Nära": [
    {
      name: "Per Svensson",
      time: "2024-10-15 08:30",
      comment: "Installerade utebelysning och säkerhetsbelysning i entré.",
      workType: "Installation",
      products: "LED-belysning, kabel 2G1.5, kabelkanal",
    },
    {
      name: "Anna Karlsson",
      time: "2024-11-02 09:15",
      comment: "Byte av elcentral, nya automatsäkringar monterade.",
      workType: "Service / Byte",
      products: "Automatsäkringar, elcentral",
    },
  ],
  "Privat – Johansson": [
    {
      name: "Johan Johansson",
      time: "2024-09-20 14:00",
      comment: "Installerade dimmer för köksbelysning och bytte proppskåp.",
      workType: "Installation",
      products: "Dimmer, proppskåp, skruvdragare",
    },
  ],
  "Företag AB": [
    {
      name: "Sara Lind",
      time: "2024-12-01 10:30",
      comment: "Nytt eluttag installerat i kontorslandskap.",
      workType: "Installation",
      products: "Eluttag, kabel 3G1.5, kabelklammer",
    },
  ],
};

function sendLog() {
  const input = document.getElementById("logInput");
  const text = input.value.trim();
  if (!text) return;

  // Skapa användarbubbla
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";
  bubble.innerHTML = `${text}<span class="timestamp">${new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}</span>`;
  document.getElementById("chatLog").appendChild(bubble);

  // Skapa AI-bubbla
  const aiBubble = document.createElement("div");
  aiBubble.className = "chat-bubble ai";

  const match = text.match(/kund\s(.+)/i);
  if (match && customerLogs[match[1]]) {
    let historyHtml = `<strong>Historik ${match[1]}:</strong>`;
    customerLogs[match[1]].forEach((log) => {
      historyHtml += `
      <div class="history-row">
        <strong>${log.name}</strong> <span class="history-badge">${log.workType}</span><br>
        ${log.comment}<br>
        <span class="history-products">Produkter: ${log.products}</span> <span class="history-time">${log.time}</span>
      </div>`;
    });
    aiBubble.innerHTML = `${historyHtml}<span class="timestamp">${new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}</span>`;
  } else {
    aiBubble.innerHTML = `Loggen är nu bearbetad och finns under historik.<span class="timestamp">${new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}</span>`;
  }

  document.getElementById("chatLog").appendChild(aiBubble);

  input.value = "";
}

function loadCustomerLogs() {
  const select = document.getElementById("customerSelect");
  const logsDiv = document.getElementById("historyLogs");
  logsDiv.innerHTML = "";
  const customer = select.value;
  if (!customerLogs[customer]) return;

  const customerHeader = document.createElement("div");
  customerHeader.className = "customer-card";
  customerHeader.textContent = customer;
  logsDiv.appendChild(customerHeader);

  customerLogs[customer].forEach((log) => {
    const card = document.createElement("div");
    card.className = "history-card";
    card.innerHTML = `
    <div class="d-flex justify-content-between align-items-start">
      <div>
        <strong>${log.name}</strong> <small class="text-muted">(${log.time})</small>
        <div><span class="badge bg-info">${log.workType}</span></div>
      </div>
    </div>
    <div class="mt-1" style="font-size:14px;">${log.comment}</div>
    <div class="mt-1 text-muted" style="font-size:13px;">Produkter: ${log.products}</div>
  `;
    logsDiv.appendChild(card);
  });
}

// Skicka logg när Enter trycks
document.getElementById("logInput").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendLog();
  }
});

// ================================
// MutationObserver för automatisk scroll
// ================================
const chatLog = document.getElementById("chatLog");

const observer = new MutationObserver(() => {
  // Vänta tills bubblan har renderats
  setTimeout(() => {
    chatLog.scrollTop = chatLog.scrollHeight;
  }, 10); // 10–50ms räcker oftast
});

observer.observe(chatLog, { childList: true });;
