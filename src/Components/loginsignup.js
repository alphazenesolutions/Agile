import { useState } from 'react';

function loginsignup() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [signupbtn, setsignupbtn] = useState(false);
    const changeoption = () => {
        if (signupbtn === true) {
            setsignupbtn(false)
        } else {
            setsignupbtn(true)
        }
    }
    return (
        <div>
            {signupbtn === true ? <button onClick={changeoption}>Signup</button> : <button onClick={changeoption}>Login</button>}


        </div>
    )
}

export default loginsignup