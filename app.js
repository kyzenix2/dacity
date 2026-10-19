'use strict';
const copyContract = document.querySelector('#copy-contract');
copyContract?.addEventListener('click', async () => {
  const status = document.querySelector('#contract-status');
  const contract = document.querySelector('#contract-address');
  const original = copyContract.textContent;
  try {
    await navigator.clipboard.writeText(contract.textContent.trim());
    copyContract.textContent = 'Copied!';
    status.textContent = 'Contract address copied.';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(contract);
    selection.removeAllRanges();
    selection.addRange(range);
    try {
      const ok = document.execCommand('copy');
      copyContract.textContent = ok ? 'Copied!' : 'Copy CA';
      status.textContent = ok ? 'Contract address copied.' : 'Select and copy the highlighted address.';
    } catch {
      status.textContent = 'Select and copy the highlighted address.';
    }
  }
  clearTimeout(copyContract._t);
  copyContract._t = setTimeout(() => { copyContract.textContent = original; }, 1600);
});
