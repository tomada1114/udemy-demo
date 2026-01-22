// Service Worker for Highlight Memo extension

chrome.runtime.onInstalled.addListener(() => {
  // Create context menu for saving selected text
  chrome.contextMenus.create({
    id: 'saveHighlight',
    title: 'Save as Memo',
    contexts: ['selection'],
  })
})

chrome.contextMenus.onClicked.addListener((info, _tab) => {
  if (info.menuItemId === 'saveHighlight' && info.selectionText) {
    saveMemo({
      type: 'text',
      content: info.selectionText,
      url: info.pageUrl,
      timestamp: Date.now(),
    })
  }
})

async function saveMemo(memo) {
  const { memos = [] } = await chrome.storage.local.get('memos')
  const updatedMemos = [...memos, { ...memo, id: crypto.randomUUID() }]
  await chrome.storage.local.set({ memos: updatedMemos })
}
