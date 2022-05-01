import { CognitoUserAttribute } from 'amazon-cognito-identity-js'
import UserPool from '../UserPool'
import React, { useState, useReducer, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      width: 400,
      margin: `${theme.spacing(0)} auto`
    },
    loginBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1
    },
    header: {
      textAlign: 'center',
      background: '#212121',
      color: '#fff'
    },
    card: {
      marginTop: theme.spacing(10)
    }
  })
);

//state type

type State = {
  username: string
  password:  string
  isButtonDisabled: boolean
  helperText: string
  isError: boolean
};

const initialState:State = {
  username: '',
  password: '',
  isButtonDisabled: true,
  helperText: '',
  isError: false
};

type Action = { type: 'setUsername', payload: string }
  | { type: 'setPassword', payload: string }
  | { type: 'setIsButtonDisabled', payload: boolean }
  | { type: 'loginSuccess', payload: string }
  | { type: 'loginFailed', payload: string }
  | { type: 'setIsError', payload: boolean };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setUsername': 
      return {
        ...state,
        username: action.payload
      };
    case 'setPassword': 
      return {
        ...state,
        password: action.payload
      };
    case 'setIsButtonDisabled': 
      return {
        ...state,
        isButtonDisabled: action.payload
      };
    case 'loginSuccess': 
      return {
        ...state,
        helperText: action.payload,
        isError: false
      };
    case 'loginFailed': 
      return {
        ...state,
        helperText: action.payload,
        isError: true
      };
    case 'setIsError': 
      return {
        ...state,
        isError: action.payload
      };
  }
}

export const Signup = () => {
    
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    let attributeList = [
        new CognitoUserAttribute({
            Name: 'email',
            Value: email
        })
    ]
    
    const onSubmit = (event: any) => {
        event.preventDefault();

        UserPool.signUp(email, password, [], attributeList, (err, data) => {
            if (err) {
                console.log(err)
            } else {
                console.log(data)
            }
        })
    };

    return (
      <div>
          <form onSubmit={onSubmit} className={classes.container} noValidate autoComplete="off">
              <Card className={classes.card}>
                  <CardHeader className={classes.header} title="Secure Chat" />
                  <CardContent>
                      <div>
                          <TextField
                          error={state.isError}
                          fullWidth
                          id="username"
                          type="email"
                          value={email}
                          label="Username"
                          placeholder="Username"
                          margin="normal"
                          onChange={(event) => setEmail(event.target.value)}
                          />
                          <TextField
                          error={state.isError}
                          fullWidth
                          id="password"
                          type="password"
                          value={password}
                          label="Password"
                          placeholder="Password"
                          margin="normal"
                          helperText={state.helperText}
                          onChange={(event) => setPassword(event.target.value)}
                          />
                      </div>
                  </CardContent>
                  <CardActions>
                      <Button
                          variant="contained"
                          size="large"
                          color="secondary"
                          className={classes.loginBtn}
                          type="submit"
                          >
                          Signup
                      </Button>
                  </CardActions>
              </Card>
          </form>
      </div>
  )


}

