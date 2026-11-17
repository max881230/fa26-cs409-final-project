(function () {
  // Apply the saved preference before styles and React can paint.
  var theme = 'system';
  try { theme = localStorage.getItem('cs409-job-helper:theme:v1') || 'system'; } catch (_) {}
  if (theme !== 'light' && theme !== 'dark') theme = 'system';
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === 'system' ? 'light dark' : theme;
}());
