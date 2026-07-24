import axios from 'axios';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNGY0MDM3ZjE2Nzk2ODllOWIwMTczNyIsImlhdCI6MTc4MzU5NDc5MCwiZXhwIjoxNzg2MTg2NzkwfQ.FZ56-PVSjN0fsDHpxAmjwzv_2lTUE_Ur01H84Q7EXuM';
axios.get('http://localhost:5000/api/notifications', { headers: { Authorization: `Bearer ${token}` }})
  .then(res => console.log(JSON.stringify(res.data, null, 2)))
  .catch(err => console.error(err.response ? err.response.data : err.message));
