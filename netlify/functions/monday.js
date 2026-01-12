const https = require('https');

// Helper function to make Monday.com API request
function makeMonddayRequest(query, apiKey) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query });
    const options = {
      hostname: 'api.monday.com',
      path: '/v2',
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse response'));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(postData);
    req.end();
  });
}

exports.handler = async (event, context) => {
  const { itemIds } = event.queryStringParameters;
  if (!itemIds) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Missing itemIds parameter" })
    };
  }
  
  const apiKey = process.env.MONDAY_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Monday.com API key not configured" })
    };
  }
  
  // Parse the itemIds array from URL parameter
  let parsedItemIds;
  try {
    parsedItemIds = JSON.parse(decodeURIComponent(itemIds));
  } catch (e) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Invalid itemIds format" })
    };
  }
  
  // Separate numeric IDs from TBUS IDs
  const numericIds = parsedItemIds.filter(id => /^\d{10}$/.test(id));
  const tbusIds = parsedItemIds.filter(id => /^TBUS-\d+$/i.test(id));
  
  let allItems = [];
  
  try {
    // Fetch numeric IDs (old board structure)
    if (numericIds.length > 0) {
      const numericQuery = `
        query {
          items(ids: ${JSON.stringify(numericIds)}) {
            id
            name
            column_values(ids: ["numbers"]) {
              value
            }
          }
        }
      `;
      
      const numericData = await makeMonddayRequest(numericQuery, apiKey);
      if (numericData.data && numericData.data.items) {
        allItems = allItems.concat(numericData.data.items);
      }
    }
    
    // Fetch TBUS IDs (new board structure - board ID: 5088989923)
    if (tbusIds.length > 0) {
      for (const tbusId of tbusIds) {
        const tbusQuery = `
          query {
            items_page_by_column_values(
              limit: 1,
              board_id: 5088989923,
              columns: [{column_id: "item_id", column_values: ["${tbusId}"]}]
            ) {
              items {
                id
                name
                column_values(ids: ["task_estimation"]) {
                  id
                  text
                  column {
                    title
                  }
                }
              }
            }
          }
        `;
        
        const tbusData = await makeMonddayRequest(tbusQuery, apiKey);
        if (tbusData.data && tbusData.data.items_page_by_column_values && tbusData.data.items_page_by_column_values.items) {
          // Map TBUS items to same structure as numeric items
          const tbusItems = tbusData.data.items_page_by_column_values.items.map(item => ({
            id: tbusId,
            name: item.name,
            column_values: item.column_values.map(cv => ({
              value: cv.text ? `"${cv.text}"` : null
            }))
          }));
          allItems = allItems.concat(tbusItems);
        }
      }
    }
    
    // Return in the expected format
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        data: {
          items: allItems
        }
      })
    };
    
  } catch (error) {
    console.error('Monday.com API error:', error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Server error: " + error.message })
    };
  }
};
