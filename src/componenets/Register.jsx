import { useEffect, useRef, useState } from "react";
import "./Register.css";
import { useNavigate} from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();
  const axiosPrivate = useAxiosPrivate();

  const [user, setUser] = useState('');
  const [validname, setvalidname] = useState(false);
  const [userfocus, setuserfocus] = useState(false);

  const [pwd, setpwd] = useState('');
  const [validpwd, setvalidpwd] = useState(false);
  const [pwdfocus, setpwdfocus] = useState(false);

  const [matchpwd, setmatchpwd] = useState('');
  const [validmatch, setvalidmatch] = useState(false);
  const [matchfocus, setmatchfocus] = useState(false);

  const [errmsg, seterrmsg] = useState('');
  const [setsuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    // console.log(result);
    // console.log(user);
    setvalidname(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setvalidpwd(PWD_REGEX.test(pwd));
    setvalidmatch(pwd === matchpwd);
  }, [pwd, matchpwd]);

  useEffect(() => {
    seterrmsg("");
  }, [user, pwd, matchpwd]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if(!v1 || !v2){
        seterrmsg("Invalid Entry");
        return;
    }
    try{
        const response = await axiosPrivate.post("http://localhost:3001/auth/register",
            JSON.stringify({user, pwd}),
            {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            }
        );
        console.log(response?.data);
        setsuccess(true);
        setUser('');
        setpwd('');
        setmatchpwd('');
        navigate('/');
    }catch (err){
        if(!err?.response) {
            seterrmsg('No server response');
        }
        seterrmsg('Registration failed');
        console.log(err);
        //navigate("/auth");
        errRef.current.focus();
    }
  };

  return (
    <section className="inp">
      <p
        ref={errRef}
        className={errmsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errmsg}
      </p>

      {/* Can use icons to suggest if email is valid  */}
      <label htmlFor="signup-username">Username:</label>
      <input
        type="text"
        ref={userRef}
        id="signup-username"
        name="username"
        onChange={(e) => setUser(e.target.value)}
        required
        onFocus={() => setuserfocus(true)}
        onBlur={() => setuserfocus(false)}
        aria-invalid={validname? "false" : "true"}
        aria-describedby="uidnote"
      />
      {/* Can use icons to suggest invalid */}
      <p
        id="uidnote"
        className={
          userfocus && user && !validname ? "instructions" : "offscreen"
        }
      >
        4 to 24 characters.
        <br />
        Must begin with a letter.
        <br />
        Letters, numbers, underscores, hyphens allowed.
      </p>

      <label htmlFor="signup-password">Password:</label>

      <input
        type="password"
        id="signup-password"
        name="password"
        onChange={(e) => setpwd(e.target.value)}
        required
        onFocus={() => setpwdfocus(true)}
        onBlur={() => setpwdfocus(false)}
        aria-invalid={validpwd? "false" : "true"}
        aria-describedby="pwdnote"
      />
      {/* Can use icons to suggest invalid */}
      <p
        id="pwdnote"
        className={pwdfocus && pwd && !validpwd ? "instructions" : "offscreen"}
      >
        8 to 24 characters.
        <br />
        Must include uppercase and lowercase letters, numbers and a special
        character.
      </p>

      <label htmlFor="match-password">Confirm Password:</label>
      <input
        type="password"
        id="match-password"
        name="password"
        onChange={(e) => setmatchpwd(e.target.value)}
        required
        onFocus={() => setmatchfocus(true)}
        onBlur={() => setmatchfocus(false)}
        aria-invalid={validmatch ? "false" : "true"}
        aria-describedby="confirmnote"
      />
      {/* Can use icons to suggest invalid */}
      <p
        id="confirmnote"
        className={matchfocus && !validmatch ? "instructions" : "offscreen"}
      >
        Must match the first password input field.
      </p>

      <button
        disabled={!validname || !validpwd || !validmatch ? true : false}
        type="submit"
        className="submit"
        onClick={handleLogin}
      >
        Sign Up
      </button>
      <br />
    </section>
  );
};

export default Register;
