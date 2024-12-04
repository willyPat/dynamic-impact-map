export const fetchEngagementData = async (page = 1, limit = 50) => {
  try {
    const response = await fetch(`/api/pastors/123/interactions?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch engagement data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching engagement data:', error);
    return { data: [], total: 0, page: 1, limit };
  }
};
