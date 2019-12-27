import React from 'react';

const Navigation = ({onRouteChange, isSignedIn}) => {

    let returningElement = null;

    if(isSignedIn) {
        returningElement =  <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <p onClick={() => onRouteChange('signout')} className='f3 link dim black underline pa3 pointer'>Sign Out</p>
                            </nav>
    } else {
        returningElement =  <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <p onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer'>Sign In</p>
                                <p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'>Register</p>
                            </nav>
    }

    return returningElement;
}

export default Navigation;