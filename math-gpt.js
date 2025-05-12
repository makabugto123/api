const express = require('express');
const axios = require('axios');
const readline = require('readline');

const app = express();
const PORT = 3000;

app.get('/math-gpt', async (req, res) => {
  const { ask, imageUrl } = req.query;

  if (!ask) {
    return res.status(400).json({ error: 'Missing "ask" query parameter' });
  }

  const url = 'https://math-gpt.org/api/v2/chat/completions';

  const headers = {
    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36',
    'origin': 'https://math-gpt.org',
    'referer': 'https://math-gpt.org/',
    'x-topic': 'math',
    'accept': 'text/event-stream',
    'cookie': [
      '_gcl_au=1.1.385827166.1746956806',
      '__client_uat=1747037452',
      '__refresh_Do4ajzMV=t8sN2nUJcVd2lLiebleI',
      '__client_uat_Do4ajzMV=1747037452',
      '__session=eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6...',
      '__session_Do4ajzMV=eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6...',
      'ph_phc_mD5jgxfqkIw6GkIfwSV3JQqLQQWzLcQZU3Fia8PxANQ_posthog=%7B%22distinct_id%22%3A%22user_2wwdxqSgaxFUUxxCr20pn6IQJF6%22%2C...'
    ].join('; ')
  };

  const content = [];

  if (imageUrl) {
    content.push({
      type: 'image_url',
      image_url: {
        url: imageUrl,
        detail: 'low'
      }
    });
  }

  content.push({ type: 'text', text: ask });

  const body = {
    messages: [
      {
        role: 'user',
        content
      }
    ],
    reasoningEnabled: false
  };

  try {
    const response = await axios.post(url, body, {
      headers,
      responseType: 'stream'
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const rl = readline.createInterface({
      input: response.data,
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      if (line.startsWith('data:')) {
        const jsonStr = line.replace(/^data:\s*/, '');
        if (jsonStr === '[DONE]') {
          return res.end();
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const delta = parsed.choices?.[0]?.delta;
          if (delta?.content) {
            res.write(delta.content);
          }
        } catch (e) {}
      }
    });

    rl.on('close', () => {
      res.end();
    });
  } catch (error) {
    res.status(500).json({ error: 'Request to MathGPT failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
