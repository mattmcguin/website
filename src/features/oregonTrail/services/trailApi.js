function parseEventBlock(block) {
  let event = 'message';
  const dataLines = [];

  const lines = block.split('\n');
  for (const line of lines) {
    if (!line) continue;
    if (line.startsWith(':')) continue;

    if (line.startsWith('event:')) {
      event = line.slice(6).trim() || 'message';
      continue;
    }

    if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trim());
    }
  }

  if (!dataLines.length) return null;

  const raw = dataLines.join('\n');
  let data = raw;
  try {
    data = JSON.parse(raw);
  } catch {
    // Keep raw text when event payload is not JSON.
  }

  return { event, data };
}

function flushSseBuffer(rawBuffer, onEvent) {
  let buffer = rawBuffer;
  buffer = buffer.replace(/\r/g, '');

  let boundaryIndex = buffer.indexOf('\n\n');
  while (boundaryIndex !== -1) {
    const block = buffer.slice(0, boundaryIndex).trim();
    buffer = buffer.slice(boundaryIndex + 2);

    if (block) {
      const parsed = parseEventBlock(block);
      if (parsed) onEvent(parsed);
    }

    boundaryIndex = buffer.indexOf('\n\n');
  }

  return buffer;
}

export async function streamTrailTurn(payload, { onEvent, signal } = {}) {
  const response = await fetch('/api/oregon-trail/turn', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    let message = `Trail API request failed (${response.status})`;
    try {
      const errorJson = await response.json();
      if (errorJson?.error) message = errorJson.error;
    } catch {
      // Keep fallback message.
    }
    throw new Error(message);
  }

  if (!response.body) {
    throw new Error('Streaming is unavailable in this browser.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let sawDone = false;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    buffer = flushSseBuffer(buffer, (eventPayload) => {
      if (typeof onEvent === 'function') onEvent(eventPayload);
      if (eventPayload.event === 'done') {
        sawDone = true;
      }
    });

    if (sawDone) {
      await reader.cancel();
      break;
    }
  }

  buffer += decoder.decode();
  const trailing = buffer.trim();
  if (trailing) {
    const parsed = parseEventBlock(trailing);
    if (parsed && typeof onEvent === 'function') onEvent(parsed);
  }
}
