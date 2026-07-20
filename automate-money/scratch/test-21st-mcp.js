

async function main() {
  const url = 'https://21st.dev/api/mcp';
  const apiKey = '21st_sk_60ef60ae80129797ab9fb28eea0e8d093d0ce3be19e7678af5c4970d1eb61af3';

  console.log('🔄 Querying 21st.dev MCP...');
  try {
    // Try listing tools via JSON-RPC POST
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/list',
        params: {},
        id: 1,
      }),
    });

    console.log('Response Status:', response.status);
    const data = await response.json();
    console.log('Available Tools:');
    if (data.result && data.result.tools) {
      data.result.tools.forEach(t => {
        console.log(`- Name: ${t.name}\n  Description: ${t.description.substring(0, 200)}...\n`);
      });
    } else {
      console.log('No tools returned:', data);
    }
  } catch (err) {
    console.error('Error querying 21st.dev MCP:', err);
  }
}

main();
