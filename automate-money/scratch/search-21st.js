

async function main() {
  const query = process.argv[2] || 'dashboard';
  const url = 'https://21st.dev/api/mcp';
  const apiKey = '21st_sk_60ef60ae80129797ab9fb28eea0e8d093d0ce3be19e7678af5c4970d1eb61af3';

  console.log(`🔎 Searching 21st.dev for: "${query}"...`);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'search',
          arguments: {
            query: query,
            type: 'all',
          },
        },
        id: 1,
      }),
    });

    const data = await response.json();
    if (data.result && data.result.content) {
      const text = data.result.content[0].text;
      const parsed = JSON.parse(text);
      console.log(`Found ${parsed.length} results:`);
      parsed.slice(0, 10).forEach((item, i) => {
        console.log(`[${i + 1}] ID: ${item.id}\n    Name: ${item.name}\n    Type: ${item.type}\n    Description: ${item.description}\n    URL: ${item.url}\n`);
      });
    } else {
      console.log('Error or no content:', data);
    }
  } catch (err) {
    console.error('Failed to search:', err);
  }
}

main();
