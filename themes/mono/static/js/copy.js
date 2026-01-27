// Wrap code blocks and add copy buttons
document.addEventListener('DOMContentLoaded', function() {
  // Feature detection - skip if clipboard API unavailable
  if (!navigator.clipboard) return;

  document.querySelectorAll('pre').forEach(function(pre) {
    // Skip if already wrapped
    if (pre.parentElement.classList.contains('code-block')) return;

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    // Create copy button
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'copy';
    btn.setAttribute('aria-label', 'Copy code to clipboard');

    btn.addEventListener('click', function() {
      const code = pre.querySelector('code') || pre;
      navigator.clipboard.writeText(code.textContent).then(function() {
        btn.textContent = 'copied!';
        btn.classList.add('copied');
        setTimeout(function() {
          btn.textContent = 'copy';
          btn.classList.remove('copied');
        }, 2000);
      }).catch(function(err) {
        btn.textContent = 'failed';
        setTimeout(function() {
          btn.textContent = 'copy';
        }, 2000);
        console.error('Copy failed:', err);
      });
    });
    wrapper.appendChild(btn);
  });
});
