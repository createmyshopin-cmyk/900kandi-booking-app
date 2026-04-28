/**
 * Analytics Page Controller
 */
const Analytics = {
  data: [],
  lineChartInstance: null,
  doughnutChartInstance: null,

  async init() {
    this.bindEvents();
    await this.loadData();
  },

  bindEvents() {
    document.getElementById('analytics-timeframe')?.addEventListener('change', (e) => {
      this.updateCharts(parseInt(e.target.value));
    });
  },

  async loadData() {
    try {
      this.data = await API.getBookings();
      this.updateCharts(30); // Default to 30 days
      this.calculateStats();
    } catch (e) {
      UI.showToast('Failed to load analytics data', 'error');
    } finally {
      document.getElementById('loading-line-chart')?.classList.add('hidden');
      document.getElementById('loading-doughnut-chart')?.classList.add('hidden');
    }
  },

  calculateStats() {
    if (this.data.length === 0) return;

    // Average Length of Stay
    let totalDays = 0;
    let validBookings = 0;

    this.data.forEach(b => {
      if (b.status !== 'cancelled') {
        const checkin = new Date(b.checkin_date);
        const checkout = new Date(b.checkout_date);
        const diffTime = Math.abs(checkout - checkin);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
          totalDays += diffDays;
          validBookings++;
        }
      }
    });

    const avgStay = validBookings > 0 ? (totalDays / validBookings).toFixed(1) : 0;
    document.getElementById('stat-avg-stay').textContent = `${avgStay} Days`;

    // Confirmation Rate
    const confirmedCount = this.data.filter(b => b.status === 'confirmed').length;
    const confirmRate = ((confirmedCount / this.data.length) * 100).toFixed(0);
    document.getElementById('stat-confirm-rate').textContent = `${confirmRate}%`;

    // Avg Guests per Booking
    const totalGuests = this.data.reduce((sum, b) => sum + parseInt(b.guests || 0), 0);
    const avgGuests = (totalGuests / this.data.length).toFixed(1);
    document.getElementById('stat-avg-guests').textContent = avgGuests;
  },

  updateCharts(days) {
    if (!window.Chart) {
      setTimeout(() => this.updateCharts(days), 100); // Wait for Chart.js to load
      return;
    }

    const today = new Date();
    const cutoffDate = new Date();
    cutoffDate.setDate(today.getDate() - days);

    // Filter data by timeframe
    const filteredData = this.data.filter(b => new Date(b.created_at) >= cutoffDate);

    this.renderLineChart(filteredData, days);
    this.renderDoughnutChart(filteredData);
  },

  renderLineChart(filteredData, days) {
    const ctx = document.getElementById('bookingsLineChart');
    if (!ctx) return;

    // Aggregate data by date
    const dateCounts = {};
    
    // Initialize empty dates
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      dateCounts[dateString] = 0;
    }

    filteredData.forEach(b => {
      const dateString = b.created_at.split('T')[0];
      if (dateCounts[dateString] !== undefined) {
        dateCounts[dateString]++;
      }
    });

    const labels = Object.keys(dateCounts).map(d => {
      return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    const dataPoints = Object.values(dateCounts);

    if (this.lineChartInstance) {
      this.lineChartInstance.destroy();
    }

    this.lineChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'New Bookings',
          data: dataPoints,
          borderColor: '#1f7a5a',
          backgroundColor: 'rgba(31, 122, 90, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#1f7a5a',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#000000',
            padding: 12,
            titleFont: { size: 13, family: 'Inter' },
            bodyFont: { size: 14, family: 'Inter', weight: 'bold' },
            displayColors: false,
            callbacks: {
              label: function(context) { return context.parsed.y + ' Bookings'; }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0, font: { family: 'Inter' } },
            grid: { borderDash: [4, 4], color: '#f1f5f9', drawBorder: false }
          },
          x: {
            grid: { display: false, drawBorder: false },
            ticks: { maxTicksLimit: 7, font: { family: 'Inter' } }
          }
        }
      }
    });
  },

  renderDoughnutChart(filteredData) {
    const ctx = document.getElementById('statusDoughnutChart');
    if (!ctx) return;

    let pending = 0, confirmed = 0, cancelled = 0;

    filteredData.forEach(b => {
      if (b.status === 'pending') pending++;
      else if (b.status === 'confirmed') confirmed++;
      else if (b.status === 'cancelled') cancelled++;
    });

    // Handle empty state beautifully
    const total = pending + confirmed + cancelled;
    const hasData = total > 0;

    if (this.doughnutChartInstance) {
      this.doughnutChartInstance.destroy();
    }

    this.doughnutChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Confirmed', 'Pending', 'Cancelled'],
        datasets: [{
          data: hasData ? [confirmed, pending, cancelled] : [1],
          backgroundColor: hasData ? ['#22c55e', '#eab308', '#ef4444'] : ['#f1f5f9'],
          borderWidth: 0,
          hoverOffset: hasData ? 4 : 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: { family: 'Inter', size: 13, weight: '500' },
              filter: function(item, chart) {
                return hasData; // Hide legend if no data
              }
            }
          },
          tooltip: {
            enabled: hasData,
            backgroundColor: '#000000',
            padding: 12,
            titleFont: { size: 13, family: 'Inter' },
            bodyFont: { size: 14, family: 'Inter', weight: 'bold' }
          }
        }
      }
    });
  }
};
