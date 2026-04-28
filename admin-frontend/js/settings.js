/**
 * Settings Page Controller
 */
const Settings = {
  
  init() {
    // Settings logic initialization (e.g., fetch current settings if API existed)
  },

  switchTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.settings-tab').forEach(tab => {
      tab.classList.remove('block');
      tab.classList.add('hidden');
    });

    // Reset button styles
    document.querySelectorAll('[id^="tab-btn-"]').forEach(btn => {
      btn.classList.remove('bg-accent', 'text-white');
      btn.classList.add('text-gray-600', 'hover:bg-gray-50');
    });

    // Show target tab
    document.getElementById(`tab-${tabId}`)?.classList.remove('hidden');
    document.getElementById(`tab-${tabId}`)?.classList.add('block');

    // Highlight target button
    const activeBtn = document.getElementById(`tab-btn-${tabId}`);
    if (activeBtn) {
      activeBtn.classList.remove('text-gray-600', 'hover:bg-gray-50');
      activeBtn.classList.add('bg-accent', 'text-white');
    }
  },

  async saveAll() {
    // In a real scenario, you'd gather data and POST to /admin/settings
    const saveBtn = document.querySelector('button[onclick="Settings.saveAll()"]');
    const originalText = saveBtn.innerHTML;
    
    // Loading state
    saveBtn.innerHTML = `<i class='bx bx-loader-alt animate-spin text-lg'></i> Saving...`;
    saveBtn.disabled = true;

    try {
      await API.delay(800); // Simulate network request
      
      const whatsapp = document.getElementById('setting-whatsapp').value;
      const bName = document.getElementById('setting-business-name').value;
      
      console.log('Saved settings:', { businessName: bName, whatsapp: whatsapp });
      
      UI.showToast('Settings saved successfully!', 'success');
    } catch (e) {
      UI.showToast('Failed to save settings', 'error');
    } finally {
      // Restore button
      saveBtn.innerHTML = originalText;
      saveBtn.disabled = false;
    }
  }

};
