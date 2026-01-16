class IncomeOS {
  constructor() {
    this.earnings = {
      today: 0,
      week: 0,
      total: 0
    };
  }
  
  async init() {
    // Load cached data
    const cached = localStorage.getItem('incomeos-earnings');
    if (cached) this.earnings = JSON.parse(cached);
    this.updateUI();
    
    // Auto-sync every 30 seconds
    setInterval(() => this.syncEarnings(), 30000);
  }
  
  async syncEarnings() {
    console.log('📊 Syncing earnings...');
    // Mock earnings for demo (replace with real API calls)
    this.earnings.today += Math.random() * 0.5;
    this.earnings.week += this.earnings.today;
    this.earnings.total += this.earnings.today;
    
    localStorage.setItem('incomeos-earnings', JSON.stringify(this.earnings));
    this.updateUI();
  }
  
  updateUI() {
    document.getElementById('todayEarnings').textContent = `$${this.earnings.today.toFixed(2)}`;
    document.getElementById('weekEarnings').textContent = `$${this.earnings.week.toFixed(2)}`;
    document.getElementById('totalBalance').textContent = `$${(this.earnings.total).toFixed(2)}`;
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
