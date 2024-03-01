import { redirect } from "react-router-dom";

const action = () => {
    localStorage.removeItem('token')
    return redirect('/');
}

export {action};