// Lägg in detta i script.js (ersätt/lägg till)
document.addEventListener('DOMContentLoaded', () => {
  const chatLog = document.getElementById('chatLog');
  const input = document.getElementById('logInput');

  if (!chatLog) return;

  // Bestämmer om användaren redan är nära botten (px-tolerans)
  const isNearBottom = (threshold = 150) => {
    return chatLog.scrollTop + chatLog.clientHeight >= chatLog.scrollHeight - threshold;
  };

  // Scrollar till botten (smooth eller instant)
  const scrollToBottom = (smooth = true) => {
    if (smooth && 'scrollTo' in chatLog) {
      chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: 'smooth' });
    } else {
      chatLog.scrollTop = chatLog.scrollHeight;
    }
  };

  // Starta längst ned när sidan laddas
  scrollToBottom(false);

  // MutationObserver: reagera när nya bubblor läggs till
  const mo = new MutationObserver((mutationsList) => {
    let added = false;
    for (const m of mutationsList) {
      if (m.addedNodes && m.addedNodes.length) {
        added = true;
        break;
      }
    }
    if (!added) return;

    // Om användaren är nära botten -> scrolla, annars visa indikator (valfritt)
    if (isNearBottom()) {
      scrollToBottom(true);
    } else {
      // Om du vill: visa en knapp/indikator som användaren kan klicka för att hoppa ner.
      const indicator = document.querySelector('.new-messages-indicator');
      if (indicator) indicator.style.display = 'block';
    }
  });

  mo.observe(chatLog, { childList: true, subtree: false });

  // Exempel: knapp för att hoppa till nya meddelanden (om du lägger in indikatoren i HTML)
  const indicator = document.querySelector('.new-messages-indicator');
  if (indicator) {
    indicator.addEventListener('click', () => {
      scrollToBottom(true);
      indicator.style.display = 'none';
    });
  }

  // Hjälpfunktion för att lägga till en bubblan programatiskt
  window.appendChatBubble = function(text, isAI = false) {
    const div = document.createElement('div');
    div.className = 'chat-bubble' + (isAI ? ' ai' : '');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    div.innerHTML = `${escapeHtml(text)} <span class="timestamp">${time}</span>`;
    chatLog.appendChild(div);
    // Om du vill säkerställa placeringen direkt (utan observer), kan du avkommentera:
    // if (isNearBottom()) scrollToBottom(true);
  };

  // Skicka med Enter (exempel)
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const val = input.value.trim();
        if (!val) return;
        appendChatBubble(val, false);
        input.value = '';
        // Simulera AI-svar efter kort stund
        setTimeout(() => appendChatBubble('Loggen är nu bearbetad och finns under historik.', true), 300);
      }
    });
  }

  // Enkel HTML-escaping för textinnehåll
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
});
