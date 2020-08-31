import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="panel-wrap">
      <div className="panel-inner">
        <h1>Page not found</h1>
        <p>Oops!</p>
        <p>The board you are looking for does not exists</p>
        <Link to="/">Return to Boards</Link>
      </div>
    </div>
  );
}
