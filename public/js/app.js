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
      grass: 0
    };
  }
  
  async init() {
    // Load cached data
    const cached = localStorage.getItem('incomeos-earnings');
    if (cached) {
      const data = JSON.parse(cached);
      this.earnings = data.earnings || this.earnings;
      this.platformEarnings = data.platformEarnings || this.platformEarnings;
    }
    this.updateUI();
    
    // Auto-sync every 5 seconds for real-time feel in demo
    setInterval(() => this.syncEarnings(), 5000);
  }
  
  async syncEarnings() {
    console.log('📊 Syncing earnings...');
    
    // Simulate real-time generation from different platforms
    const platforms = ['honeygain', 'sahara', 'synesis', 'pawnos', 'grass'];
    const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
    const increment = Math.random() * 0.05;
    
    this.platformEarnings[randomPlatform] += increment;
    this.earnings.today += increment;
    this.earnings.week += increment;
    this.earnings.total += increment;
    
    localStorage.setItem('incomeos-earnings', JSON.stringify({
      earnings: this.earnings,
      platformEarnings: this.platformEarnings
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
  alert('🚀 Auto-tasks would start here. Connect platforms in settings first!');
}

function initiatePayout() {
  alert('💰 Payout initiated! This would process to your selected method.');
}
