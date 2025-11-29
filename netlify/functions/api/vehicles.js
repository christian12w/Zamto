// Netlify Function for vehicle management
const { Octokit } = require('@octokit/rest');

// Initialize GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// GitHub repository configuration
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'your-username';
const GITHUB_REPO = process.env.GITHUB_REPO || 'zamto-vehicles-data';

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };

  try {
    const { httpMethod, path, body } = event;
    const pathParts = path.split('/').filter(Boolean);
    const resource = pathParts[0];

    if (httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers, body: '' };
    }

    switch (resource) {
      case 'vehicles':
        return await handleVehicles(httpMethod, body, pathParts.slice(1));
      case 'auth':
        return await handleAuth(httpMethod, body);
      default:
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
    }
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }

  async function handleVehicles(method, body, pathParts) {
    const vehicleId = pathParts[0];

    switch (method) {
      case 'GET':
        return await getVehicles();
      case 'POST':
        return await createVehicle(JSON.parse(body));
      case 'PUT':
        return await updateVehicle(vehicleId, JSON.parse(body));
      case 'DELETE':
        return await deleteVehicle(vehicleId);
      default:
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }
  }

  async function getVehicles() {
    try {
      // Get vehicles from GitHub issues
      const issues = await octokit.rest.issues.listForRepo({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        labels: ['vehicle'],
        state: 'all'
      });

      const vehicles = issues.data.map(issue => {
        const vehicleData = JSON.parse(issue.body);
        return {
          id: vehicleData.id || issue.id.toString(),
          ...vehicleData,
          githubIssueId: issue.id,
          createdAt: issue.created_at,
          updatedAt: issue.updated_at
        };
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ vehicles })
      };
    } catch (error) {
      // If repo doesn't exist, return empty array
      if (error.status === 404) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ vehicles: [] })
        };
      }
      throw error;
    }
  }

  async function createVehicle(vehicleData) {
    try {
      const vehicleWithId = {
        ...vehicleData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      const issue = await octokit.rest.issues.create({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        title: `Vehicle: ${vehicleData.name}`,
        body: JSON.stringify(vehicleWithId),
        labels: ['vehicle', vehicleData.type || 'sale']
      });

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          vehicle: {
            ...vehicleWithId,
            githubIssueId: issue.data.id
          }
        })
      };
    } catch (error) {
      console.error('Create vehicle error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to create vehicle' })
      };
    }
  }

  async function updateVehicle(vehicleId, vehicleData) {
    try {
      // Find the issue by searching for the vehicle ID in the body
      const issues = await octokit.rest.issues.listForRepo({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        labels: ['vehicle'],
        state: 'all'
      });

      const targetIssue = issues.data.find(issue => {
        try {
          const data = JSON.parse(issue.body);
          return data.id === vehicleId;
        } catch {
          return false;
        }
      });

      if (!targetIssue) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Vehicle not found' })
        };
      }

      const updatedVehicle = {
        ...vehicleData,
        updatedAt: new Date().toISOString()
      };

      await octokit.rest.issues.update({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        issue_number: targetIssue.number,
        body: JSON.stringify(updatedVehicle)
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          vehicle: updatedVehicle
        })
      };
    } catch (error) {
      console.error('Update vehicle error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to update vehicle' })
      };
    }
  }

  async function deleteVehicle(vehicleId) {
    try {
      // Find the issue by searching for the vehicle ID
      const issues = await octokit.rest.issues.listForRepo({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        labels: ['vehicle'],
        state: 'all'
      });

      const targetIssue = issues.data.find(issue => {
        try {
          const data = JSON.parse(issue.body);
          return data.id === vehicleId;
        } catch {
          return false;
        }
      });

      if (!targetIssue) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Vehicle not found' })
        };
      }

      await octokit.rest.issues.update({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        issue_number: targetIssue.number,
        state: 'closed'
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Vehicle deleted successfully'
        })
      };
    } catch (error) {
      console.error('Delete vehicle error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to delete vehicle' })
      };
    }
  }

  async function handleAuth(method, body) {
    // Static authentication for demo
    if (method === 'POST') {
      const { username, password } = JSON.parse(body);
      
      if (username === 'admin' && password === 'admin123') {
        const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            user: {
              id: 'admin-1',
              username: 'admin',
              email: 'admin@zamtoafrica.com',
              role: 'admin'
            },
            token
          })
        };
      }
      
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Invalid credentials'
        })
      };
    }
    
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
};
