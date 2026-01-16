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
  }
  
  async init() {
    // Load cached data
    const cached = localStorage.getItem('incomeos-earnings');
    if (cached) {
      const data = JSON.parse(cached);
      this.earnings = data.earnings || this.earnings;
      this.platformEarnings = data.platformEarnings || this.platformEarnings;
      
      // Calculate missing weekly/total if they weren't saved correctly
      const totalFromPlatforms = Object.values(this.platformEarnings).reduce((a, b) => a + b, 0);
      if (this.earnings.total === 0) this.earnings.total = totalFromPlatforms;
      if (this.earnings.week === 0) this.earnings.week = this.earnings.today;
    }
    this.updateUI();
    
    // Auto-sync every 5 seconds for real-time feel in demo
    setInterval(() => this.syncEarnings(), 5000);
  }
  
  async syncEarnings() {
    console.log('📊 Syncing earnings...');
    
    // Simulate real-time generation from different platforms
    const platforms = ['honeygain', 'sahara', 'synesis', 'pawnos', 'grass', 'swagbucks', 'surveyjunkie', 'brandaid', 'opinioninn'];
    const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
    const increment = Math.random() * 0.05;
    
    this.platformEarnings[randomPlatform] += increment;
    
    // Recalculate totals from individual platform earnings to ensure accuracy
    const totalFromPlatforms = Object.values(this.platformEarnings).reduce((a, b) => a + b, 0);
    
    // Update daily/weekly logic
    // We update all trackers based on the increment
    this.earnings.today += increment;
    this.earnings.week += increment;
    
    // Total balance should always match the sum of platform earnings
    this.earnings.total = totalFromPlatforms;
    
    // Ensure "This Week" and "Total Balance" reflect the sum of individual day's earnings (simulated here)
    this.earnings.week = totalFromPlatforms;
    this.earnings.total = totalFromPlatforms;
    
    // Ensure all balances are synced correctly
    this.earnings.week = Math.max(this.earnings.week, this.earnings.today);
    this.earnings.total = Math.max(this.earnings.total, this.earnings.week);
    
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
