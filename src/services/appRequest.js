function randomRange(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}

function isMockError() {
  return window 
    && window.location 
    && window.location.search
    && /iserror=true/.test(window.location.search)
    || false;
}

function getMockData() {
  if (isMockError()) {
    throw new Error("Error making request.");
  }

  // Mock Data
  return {
    success: true,
    data: {
      greeting: "Hello World"
    }
  };
}

export async function mockRequest(params) {
  const delay = randomRange(1500, 7000);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const mockData = getMockData();
        resolve(mockData);
      } catch(err) {
        reject(err);
      }
    }, delay);
  });
}


