// Popup script for Highlight Memo extension

document.addEventListener('DOMContentLoaded', loadMemos)

async function loadMemos() {
  const { memos = [] } = await chrome.storage.local.get('memos')
  const memoList = document.getElementById('memoList')

  if (memos.length === 0) {
    memoList.innerHTML = '<p class="empty-message">No memos saved yet.</p>'
    return
  }

  memoList.innerHTML = memos
    .map(
      (memo) => `
      <div class="memo-item" data-id="${memo.id}">
        <p class="memo-content">${escapeHtml(memo.content)}</p>
        <div class="memo-meta">
          <a href="${memo.url}" target="_blank" class="memo-url">Source</a>
          <span class="memo-date">${formatDate(memo.timestamp)}</span>
        </div>
      </div>
    `
    )
    .join('')
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
