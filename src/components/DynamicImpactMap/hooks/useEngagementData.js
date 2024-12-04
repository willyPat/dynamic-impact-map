import { useState, useEffect } from 'react';
import { fetchEngagementData } from '../../services/api';

const useEngagementData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchEngagementData();
      setData(result);
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Fetch every minute
    return () => clearInterval(interval);
  }, []);

  return data;
};

export default useEngagementData;
