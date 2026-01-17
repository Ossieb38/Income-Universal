class IncomeOS {
  constructor() {
    this.earnings = {
      today: 0,
      week: 0,
      total: 0
    };
    this.platformEarnings = {
      honeygain: 0,
      sahara: 0,
      synesis: 0,
      pawnos: 0,
      grass: 0,
      swagbucks: 0,
      surveyjunkie: 0,
      brandaid: 0,
      opinioninn: 0
    };
    this.totalAccumulated = 0;
    this.tasksRunning = false;
    this.apiKeys = {};
  }
  
  async init() {
    // Load cached data
    const cached = localStorage.getItem('incomeos-earnings');
    if (cached) {
      const data = JSON.parse(cached);
      this.earnings = data.earnings || this.earnings;
      this.platformEarnings = data.platformEarnings || this.platformEarnings;
      this.totalAccumulated = data.totalAccumulated || 0;
      this.apiKeys = data.apiKeys || {};
      
      // Load keys into form
      for (const [platform, key] of Object.entries(this.apiKeys)) {
        const input = document.getElementById(`key_${platform}`);
        if (input) input.value = key;
      }
    }
    this.updateUI();
    
    // Auto-sync every 5 seconds only if tasks are running
    setInterval(() => {
      if (this.tasksRunning) this.syncEarnings();
    }, 5000);

    this.setupAIChat();
  }

  saveAPIKeys() {
    const platforms = ['honeygain', 'sahara', 'synesis', 'pawnos', 'grass'];
    platforms.forEach(p => {
      const val = document.getElementById(`key_${p}`)?.value;
      if (val) this.apiKeys[p] = val;
    });
    
    localStorage.setItem('incomeos-earnings', JSON.stringify({
      earnings: this.earnings,
      platformEarnings: this.platformEarnings,
      totalAccumulated: this.totalAccumulated,
      apiKeys: this.apiKeys
    }));
    
    document.getElementById('settingsModal').style.display = 'none';
    alert('✅ API Keys saved successfully!');
  }

  toggleTasks() {
    if (!this.tasksRunning) {
      const hasKeys = Object.keys(this.apiKeys).length > 0;
      if (!hasKeys) {
        alert('⚠️ Please configure at least one API key in Platform Settings first!');
        return;
      }
      this.tasksRunning = true;
      document.getElementById('startTasks').textContent = 'Stop Auto Tasks';
      document.getElementById('startTasks').classList.replace('btn-primary', 'btn-secondary');
      alert('🚀 Auto-tasks started! Syncing with platforms...');
    } else {
      this.tasksRunning = false;
      document.getElementById('startTasks').textContent = 'Start Auto Tasks';
      document.getElementById('startTasks').classList.replace('btn-secondary', 'btn-primary');
      alert('⏹️ Auto-tasks stopped.');
    }
  }

  setupAIChat() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');

    const addMessage = (text, isUser = false) => {
      const msg = document.createElement('div');
      msg.className = `message ${isUser ? 'user' : 'ai'}`;
      msg.textContent = text;
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const sendMessage = async () => {
      const text = chatInput.value.trim();
      if (!text) return;

      addMessage(text, true);
      chatInput.value = '';

      try {
        const response = await fetch('/api/conversations/1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: text })
        });
        
        // Handle SSE response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiMsg = document.createElement('div');
        aiMsg.className = 'message ai';
        chatMessages.appendChild(aiMsg);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6));
              if (data.content) aiMsg.textContent += data.content;
            }
          }
        }
      } catch (err) {
        console.error('AI Error:', err);
        addMessage('Sorry, I encountered an error.');
      }
    };

    sendBtn?.addEventListener('click', sendMessage);
    chatInput?.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());
  }
  
  async syncEarnings() {
    console.log('📊 Syncing earnings...');
    
    // Simulate real-time generation from different platforms
    const platforms = ['honeygain', 'sahara', 'synesis', 'pawnos', 'grass', 'swagbucks', 'surveyjunkie', 'brandaid', 'opinioninn'];
    const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
    const increment = Math.random() * 0.05;
    
    this.platformEarnings[randomPlatform] += increment;
    this.totalAccumulated += increment;
    
    // Update daily/weekly logic
    this.earnings.today += increment;
    this.earnings.week += increment;
    
    // Total balance should always reflect the accumulated amount for each task
    this.earnings.total = this.totalAccumulated;
    
    // Ensure all balances are synced correctly
    this.earnings.week = Math.max(this.earnings.week, this.earnings.today);
    
    localStorage.setItem('incomeos-earnings', JSON.stringify({
      earnings: this.earnings,
      platformEarnings: this.platformEarnings,
      totalAccumulated: this.totalAccumulated
    }));
    
    this.updateUI(randomPlatform);
  }
  
  updateUI(updatedPlatform = null) {
    // Update main dashboard
    this.updateElement('todayEarnings', `$${this.earnings.today.toFixed(2)}`);
    this.updateElement('weekEarnings', `$${this.earnings.week.toFixed(2)}`);
    this.updateElement('totalBalance', `$${this.earnings.total.toFixed(2)}`);

    // Update individual platforms
    for (const [platform, amount] of Object.entries(this.platformEarnings)) {
      const card = document.querySelector(`.platform-card[data-platform="${platform}"]`);
      if (card) {
        const earningsEl = card.querySelector('.earnings');
        const statusEl = card.querySelector('.status');
        
        // Update status to online if generating
        statusEl.textContent = '🟢 Online';
        statusEl.style.color = '#28a745';

        let displayAmount;
        if (platform === 'grass') displayAmount = `${Math.floor(amount * 1000)} pts`;
        else if (platform === 'synesis') displayAmount = `${Math.floor(amount * 10)} SNS`;
        else if (platform === 'sahara') displayAmount = `${(amount * 1.2).toFixed(2)} USDC`;
        else displayAmount = `$${amount.toFixed(2)}`;

        earningsEl.textContent = displayAmount;

        // Add pulse animation to the updated platform
        if (platform === updatedPlatform) {
          card.classList.add('pulse');
          setTimeout(() => card.classList.remove('pulse'), 1000);
        }
      }
    }
  }

  updateElement(id, text) {
    const el = document.getElementById(id);
    if (el) {
      if (el.textContent !== text) {
        el.textContent = text;
        el.classList.add('value-update');
        setTimeout(() => el.classList.remove('value-update'), 500);
      }
    }
  }
}

// Initialize app
const app = new IncomeOS();
app.init();

function startAutoTasks() {
  app.toggleTasks();
}

function initiatePayout() {
  alert('💰 Payout initiated! This would process to your selected method.');
}
