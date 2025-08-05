const axios = require('axios');
const { BadRequestError } = require('../../../errors')

const validateSession = async token => {
  const url = 'http://localhost:3000/validate-session';
  const headers = {
    Authorization: `Bearer ${token}`
  };

  try {
    const response = await axios.get(url, { headers });
    if (response.status === 200) {
      return response.data;
    }

    throw new BadRequestError(response.data.message || "Invalid session.");
  } catch (error) {
    throw new BadRequestError(error.response.data.message || "Invalid session.");
  }
}

module.exports = validateSession;