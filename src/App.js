import { gql } from "apollo-boost"
import { useQuery, useMutation } from "@apollo/react-hooks"

const NEW_VARIABLES = {
  variables: {
    id: 4,
    title: "New Post",
    postid: 4,
    author: "New",
  },
}

const UPDATE_VARIABLES = {
  variables: {
    id: 4,
    title: "Updated Post",
  },
}

const DELETE_VARIABLES = {
  variables: {
    id: 1,
  },
}

const ALL_POSTS = gql`
  {
    allPosts {
      id
      postid
      title
      author
    }
  }
`

const ADD_POST = gql`
  mutation($id: ID!, $postid: Int!, $title: String!, $author: String!) {
    createPost(id: $id, postid: $postid, title: $title, author: $author) {
      id
      postid
      title
      author
    }
  }
`

const UPDATE_POST = gql`
  mutation($id: ID!, $title: String!) {
    updatePost(id: $id, title: $title) {
      id
      postid
      title
      author
    }
  }
`

const DELETE_POST = gql`
  mutation($id: ID!) {
    removePost(id: $id)
  }
`

function App() {
  const { loading, error, data } = useQuery(ALL_POSTS)

  const [addPost] = useMutation(ADD_POST, {
    update(cache, { data: { createPost } }) {
      const { allPosts } = cache.readQuery({ query: ALL_POSTS })
      cache.writeQuery({
        query: ALL_POSTS,
        data: { allPosts: allPosts.concat([createPost]) },
      })
    },
  })

  const [updatePost] = useMutation(UPDATE_POST)

  const [deletePost] = useMutation(DELETE_POST, {
    update(cache) {
      const { allPosts } = cache.readQuery({ query: ALL_POSTS })
      const {
        variables: { id },
      } = DELETE_VARIABLES
      allPosts.splice(id - 1, 1)
      cache.writeQuery({
        query: ALL_POSTS,
        data: { allPosts },
      })
    },
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>`Error! ${error.message}`</p>

  return (
    <div className="container mx-auto p-4 m-4 border-solid border-2 border-gray-600 bg-gray-200">
      <h1 className="text-4xl text-gray-800 py-2 text-center">
        React GraphQL Example
      </h1>
      <ul className="flex flex-wrap py-4">
        <li className="mr-3">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-gray-800 font-bold m-1 py-2 px-4 rounded h-10 mr-3"
            onClick={() => addPost(NEW_VARIABLES)}
          >
            Add Post
          </button>
        </li>
        <li className="mr-3">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-gray-800 font-bold m-1 py-2 px-4 rounded
    h-10 mr-3"
            onClick={() => updatePost(UPDATE_VARIABLES)}
          >
            Update Post
          </button>
        </li>
        <li className="mr-3">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-gray-800 font-bold m-1 py-2 px-4 rounded h-10 mr-3"
            onClick={() => deletePost(DELETE_VARIABLES)}
          >
            Delete Post
          </button>
        </li>
      </ul>
      <table className="table-auto py-4 border-gray-500">
        <thead>
          <tr className="bg-gray-500">
            <th className="px-4 py-2 border-gray-600">Id</th>
            <th className="px-4 py-2 border-gray-600">Title</th>
            <th className="px-4 py-2 border-gray-600">Author</th>
          </tr>
        </thead>
        <tbody>
          {data.allPosts.map((post) => (
            <tr key={post.id}>
              <td className="border px-4 py-2 border-gray-600">{post.id}</td>
              <td className="border px-4 py-2 border-gray-600">{post.title}</td>
              <td className="border px-4 py-2 border-gray-600">
                {post.author}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
