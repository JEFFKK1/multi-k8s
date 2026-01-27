import React from "react";
import { Link } from 'react-router-dom'

// eslint-disable-next-line import/no-anonymous-default-export
const OtherPage = () => {
    return (
        <div>
         Im some other Page
          <Link to='/'>
            Go back home
          </Link>
        </div>
    )
}
export default OtherPage;