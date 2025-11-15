import React from 'react';
 
function Greeting({ name }) {
    return <h1>Hello, {name ? name : "welcome to the app"}!</h1>;
}

export default Greeting;