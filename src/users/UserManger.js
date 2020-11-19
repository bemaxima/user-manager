import React, { useState, useReducer } from 'react';
import styled from 'styled-components';
import SearchPanel from './SearchPanel';
import UserList from './UserList';
import { getUsers, deleteUser } from '../server'
import { Link } from 'react-router-dom';
import { reducer, ACTIONS } from './usersReducer';
import { loading as setLoading, searchUsers, userLoaded } from './actionCreator';

const Header = styled.h1`
`
const Button = styled.button`
`

function useMyReducer(reducer, initState) {

  const [state, dispatch] = useReducer(reducer, initState)

  return [
    state,
    action => {
      if (typeof action === 'function') {
        action(dispatch, () => state)
      }
      else {
        dispatch(action);
      }
    }
  ]
}

export default function UserManagerInHooks({ onEdit, onAdd }) {
  // const [keyword, setKeyword] = useState('');
  // const [users, setUsers] = useState([]);
  // const [loading, setLoading] = useState(false);

  const [{ keyword, users, loading }, dispatch] = useMyReducer(reducer, {
    keyword: '',
    users: [],
    loading: false
  })

  const handleSearch = async () => {

    dispatch(searchUsers())

    // dispatch(setLoading());
    // const users = await getUsers(keyword);
    // dispatch(userLoaded(users))
  }

  const handleDelete = async (id) => {
    await deleteUser(id);
    handleSearch();
  }

  const handleEdit = id => {
    onEdit(id);
  }

  return (
    <>
      <Header>Users!</Header>
      <SearchPanel
        keyword={keyword}
        onSearch={handleSearch}
        dispatch={dispatch}
      />
      {!loading && <UserList
        onDelete={handleDelete}
        onEdit={handleEdit}
        users={users}
      />}
      {loading && <div>Loading ....</div>}
      <Link to='/detail/'>
        <Button>Add</Button>
      </Link>
    </>
  )
}

class UserManager extends React.Component {

  constructor() {
    super();

    this.state = {
      users: [],
      keyword: ''
    }
  }

  handleKeywordChange = e => {
    this.setState({ keyword: e.target.value });
  }

  handleSearch = async () => {
    const users = await getUsers(this.state.keyword);
    this.setState({ users })
  }

  handleDelete = async (id) => {
    await deleteUser(id);
    this.handleSearch();
  }

  handleEdit = id => {
    this.props.onEdit(id);
  }

  render() {
    return (
      <>
        <Header>Users!</Header>
        <SearchPanel
          keyword={this.state.keyword}
          onSearch={this.handleSearch}
          onKeywordChange={this.handleKeywordChange}
        />
        <UserList
          onDelete={this.handleDelete}
          onEdit={this.handleEdit}
          users={this.state.users}
        />
        <Button onClick={this.props.onAdd}>Add</Button>
      </>
    )
  }
}