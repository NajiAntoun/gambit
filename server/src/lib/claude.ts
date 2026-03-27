import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface AskGambitParams {
  fen: string;
  opening: string;
  move: string;
  moveNumber: number;
  context: 'learn' | 'quiz-wrong';
  explanation?: string;
}

export async function askGambit(params: AskGambitParams): Promise<string> {
  const { fen, opening, move, moveNumber, context, explanation } = params;

  const systemPrompt = `You are Gambit, an expert chess coach specializing in opening theory.
You give concise, insightful explanations of chess moves in plain language that any player can understand.
Focus on strategic ideas, not just tactics. Be encouraging and educational. Keep responses to 2-4 sentences.`;

  let userPrompt: string;

  if (context === 'learn') {
    userPrompt = `In the ${opening}, move ${moveNumber} is ${move}.
Current position (FEN): ${fen}
${explanation ? `Basic explanation: ${explanation}` : ''}

Give a deeper, insightful explanation of why this move is played and what strategic ideas it serves.`;
  } else {
    userPrompt = `In the ${opening}, the correct move ${moveNumber} is ${move}, but the student played a different move.
Current position (FEN): ${fen}
${explanation ? `Why ${move} is correct: ${explanation}` : ''}

Explain why ${move} is the right move here, and what the student should understand about this position. Be encouraging.`;
  }

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt,
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');
  return content.text;
}
