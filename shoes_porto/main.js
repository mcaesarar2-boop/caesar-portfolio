/**
 * WAYAG ARCHIPELAGO - BRAND GUIDELINE & DESIGN SYSTEM
 * Tab Switching & Interactive Navigation Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach((tab) => {
    tab.addEventListener('click', function () {
      const target = this.getAttribute('data-tab');

      // Remove active state from all tabs and tab contents
      tabs.forEach((t) => t.classList.remove('active'));
      contents.forEach((c) => c.classList.remove('active'));

      // Activate clicked tab
      this.classList.add('active');

      // Display corresponding tab panel
      const targetContent = document.getElementById('tab-' + target);
      if (targetContent) {
        targetContent.classList.add('active');
      }

      // Smooth scroll adjustment for user experience
      window.scrollTo({
        top: window.scrollY - 1,
        behavior: 'smooth'
      });
    });
  });
});

