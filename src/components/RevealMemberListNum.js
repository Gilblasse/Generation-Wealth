import React from 'react';
import { Redirect } from 'react-router-dom';

function RevealMemberListNum(props) {
    return (
        <div>
            {
                !props.history.location.state ?  <Redirect to='/signup'/> : (
                    

                    <div>
                        'Show My Number'
                    </div>

                    
                )
            }
        </div>
    );
}

export default RevealMemberListNum;