'use strict';
const BUY_URL = 'https://app.uniswap.org/#/swap?inputCurrency=eth&outputCurrency=0x6597b04D1a24A68051Fc19002354457bea38D316';

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

const form = document.querySelector('#wallet-form');
const address = document.querySelector('#address');
const message = document.querySelector('#wallet-message');
const result = document.querySelector('#wallet-result');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = address.value.trim();
  result.hidden = true;
  if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
    message.textContent = 'Enter a valid wallet address: 0x followed by 40 hexadecimal characters.';
    address.setAttribute('aria-invalid', 'true');
    return;
  }
  address.removeAttribute('aria-invalid');
  result.replaceChildren();
  const note = document.createElement('p');
  note.textContent = 'Buy $DACITY on Ethereum with this wallet.';
  const link = document.createElement('a');
  link.href = BUY_URL;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Buy on Uniswap ↗';
  result.append(note, link);
  result.hidden = false;
  message.textContent = 'Ready to swap from ' + value + '.';
});
