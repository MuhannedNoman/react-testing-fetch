import React, { useEffect, useState } from 'react';

const App = () => {
  const [posts, setPosts] = useState([]);

  const API_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts';

  useEffect(() => {
    const fetchData = async () => {
      const promise = await fetch(API_ENDPOINT);
      const result = await promise.json();
      console.log(result);
      setPosts(result);
    };
    fetchData();
  }, []);

  const handleAdd = async () => {
    const obj = { title: 'a', body: 'b' };
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(obj),
    });
    const result = await response.json();
    setPosts((prevState) => [result, ...prevState]);
  };

  const handleUpdate = async (post) => {
    post.title = 'Update';
    const response = await fetch(`${API_ENDPOINT}/${post.id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(post),
    });
    const result = await response.json();
    setPosts((prevState) =>
      prevState.map((p) => {
        if (p.id === post.id) p = result;
        return p;
      })
    );
  };

  const handleDelete = async (post) => {
    const originalState = posts;
    setPosts((prevState) => prevState.filter((p) => p.id !== post.id));

    try {
      const response = await fetch(`${API_ENDPOINT}/${post.id}`, {
        method: 'DELETE',
      });
      await response.json();
    } catch (ex) {
      alert('Something failed while deleting');
      setPosts(originalState);
    }
  };

  return (
    <div>
      <button onClick={handleAdd}>Add</button>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>
                <button onClick={() => handleUpdate(post)}>Update</button>
              </td>
              <td>
                <button onClick={() => handleDelete(post)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
