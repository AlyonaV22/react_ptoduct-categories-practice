import React, { useState } from 'react';

import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    categ => categ.id === product.categoryId,
  );

  const user =
    category && usersFromServer.find(item => item.id === category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [query, setQuery] = useState('');

  const userClick = userId => {
    if (userId === selectedUser) {
      setSelectedUser(null);
    } else {
      setSelectedUser(userId);
    }
  };

  const searchChange = event => {
    setQuery(event.target.value);
  };

  const clearSearch = () => {
    setQuery('');
  };

  const resetFilters = () => {
    setSelectedUser(null);
    setQuery('');
  };

  const filteredProducts = products.filter(product => {
    const matchesUser = selectedUser ? product.user.id === selectedUser : true;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(query.toLowerCase());

    return matchesUser && matchesSearch;
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterAllUsers"
                  href="#/"
                  className={selectedUser === user.id ? 'is-active' : ''}
                  onClick={() => userClick(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={searchChange}
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                <span className="icon is-right">
                  {query && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={clearSearch}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block">
              <a
                href="#/"
                data-cy="ResetAllButton"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetFilters}
              >
                Reset all filters
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>
              <a data-cy="Category" className="button mr-2 my-1" href="#/">
                Category 2
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a data-cy="Category" className="button mr-2 my-1" href="#/">
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Category</th>
                <th>User</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map(product => {
                const categoryIcon =
                  product.category && product.category.icon
                    ? product.category.icon
                    : '🛒';
                const categoryName = product.category
                  ? product.category.title
                  : 'Unknown Category';

                const userName = product.user
                  ? product.user.name
                  : 'Unknown User';
                const userClass =
                  product.user && product.user.sex === 'm'
                    ? 'has-text-link'
                    : 'has-text-danger';

                return (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>
                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {categoryIcon} - {categoryName}
                    </td>
                    <td data-cy="ProductUser" className={userClass}>
                      {userName}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
