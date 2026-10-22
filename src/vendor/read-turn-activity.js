export function readTurnActivity(snapshot, turn) {
  const step = turn.steps.at(-1);
  const assistant = step?.data.get('assistant-step');
  if (assistant?.status === 'running') {
    return { kind: 'assistant', assistant, newest: assistant.blocks.at(-1)?.kind ?? null };
  }
  let running;
  for (const call of snapshot.legacy?.runningCalls ?? []) {
    if (call.turn === turn.turn) running = call;
  }
  return running ? { kind: 'tools', call: running } : null;
}
