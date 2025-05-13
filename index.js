const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.get('/chem-gpt', async (req, res) => {
  const { ask } = req.query;

  if (!ask) {
    return res.status(400).json({ error: 'Missing "ask" query parameter' });
  }

  const url = 'https://math-gpt.org/api/v2/chat/completions';

  const headers = {
    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36',
    'origin': 'https://math-gpt.org',
    'referer': 'https://math-gpt.org/',
    'x-topic': 'chemistry',
    'content-type': 'application/json',
    'accept': '*/*',
    'cookie': [
      '_gcl_au=1.1.385827166.1746956806',
      '__client_uat=1747037452',
      '__refresh_Do4ajzMV=t8sN2nUJcVd2lLiebleI',
      '__client_uat_Do4ajzMV=1747037452',
      '__session=eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yVmNjV0NSeW5uYjNlMHhCQnZLdW1WbTIzNXciLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwczovL21hdGgtZ3B0Lm9yZyIsImV4cCI6MTc0NzExMzAxNSwiZnZhIjpbMTI1OCwtMV0sImlhdCI6MTc0NzExMjk1NSwiaXNzIjoiaHR0cHM6Ly9jbGVyay5tYXRoLWdwdC5vcmciLCJqdGkiOiIyYTZjM2IzY2Q5MTdmZWQ4NGIwNyIsIm5iZiI6MTc0NzExMjk0NSwicHVibGljTWV0YWRhdGEiOnsic3RyaXBlQ3VzdG9tZXJJZCI6ImN1c19TSTZndGluekJrczFxZSJ9LCJzaWQiOiJzZXNzXzJ3ekhPb1dBQ1FORElzM3N3OGlYTnJMWFZJUiIsInN1YiI6InVzZXJfMnd3ZHhxU2dheEZVVXh4Q3IyMHBuNklRSkY2In0.iME5...',
      '__session_Do4ajzMV=eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yVmNjV0NSeW5uYjNlMHhCQnZLdW1WbTIzNXciLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwczovL21hdGgtZ3B0Lm9yZyIsImV4cCI6MTc0NzExMzAxNSwiZnZhIjpbMTI1OCwtMV0sImlhdCI6MTc0NzExMjk1NSwiaXNzIjoiaHR0cHM6Ly9jbGVyay5tYXRoLWdwdC5vcmciLCJqdGkiOiIyYTZjM2IzY2Q5MTdmZWQ4NGIwNyIsIm5iZiI6MTc0NzExMjk0NSwicHVibGljTWV0YWRhdGEiOnsic3RyaXBlQ3VzdG9tZXJJZCI6ImN1c19TSTZndGluekJrczFxZSJ9LCJzaWQiOiJzZXNzXzJ3ekhPb1dBQ1FORElzM3N3OGlYTnJMWFZJUiIsInN1YiI6InVzZXJfMnd3ZHhxU2dheEZVVXh4Q3IyMHBuNklRSkY2In0.iME5...',
      'ph_phc_mD5jgxfqkIw6GkIfwSV3JQqLQQWzLcQZU3Fia8PxANQ_posthog=%7B%22distinct_id%22%3A%22user_2wwdxqSgaxFUUxxCr20pn6IQJF6%22%2C%22%24sesid%22%3A%5B1747112962511%2C%220196c80b-f9b0-7b6d-bc58-401ed6c0f8ad%22%2C1747112950192%5D%2C%22%24epp%22%3Atrue%7D'
    ].join('; ')
  };

  const body = {
    messages: [
      {
        role: 'user',
        content: [{ type: 'text', text: ask }]
      }
    ],
    reasoningEnabled: false
  };

  try {
    const response = await axios.post(url, body, { headers });

    // Assuming JSON response
    return res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
