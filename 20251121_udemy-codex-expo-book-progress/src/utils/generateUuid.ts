const TEMPLATE = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

export function generateUuid(): string {
  let timestamp = Date.now();

  return TEMPLATE.replace(/[xy]/g, (char) => {
    const random = (timestamp + Math.random() * 16) % 16 | 0;
    timestamp = Math.floor(timestamp / 16);
    if (char === 'x') {
      return random.toString(16);
    }
    return ((random & 0x3) | 0x8).toString(16);
  });
}
