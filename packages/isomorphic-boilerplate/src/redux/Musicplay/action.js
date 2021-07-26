import axios from 'axios';

const SETBLANKBOXCOL = 'SETBLANKBOXCOL'
const SETBLANKBOXKEY = 'SETBLANKBOXKEY'
const SETNOTETOPLAY = 'SETNOTETOPLAY'

export const getSong = ({ musician, music, id }) => {

  return dispatch => {
    // dispatch(addTodoStarted());

    axios
      .post(`https://1qno1nvpi2.execute-api.ap-southeast-1.amazonaws.com/PostGetRecord`,{ "id" : "1" })
      .then(res => {
          if(res.statusCode == 200){
            let data = res.body?.Item ?? {}
          }
        // dispatch(addTodoSuccess(res.data));
      })
      .catch(err => {
        // dispatch(addTodoFailure(err.message));
      })

  }

}

export const saveSong = ({ musician, music, id, note }) => {

    return dispatch => {
        // dispatch(addTodoStarted());
    
        axios
          .post(`https://1qno1nvpi2.execute-api.ap-southeast-1.amazonaws.com/PostGetRecord`,{ "id" : "1" })
          .then(res => {
              if(res.statusCode == 200){
                let data = res.body?.Item ?? {}
              }
            // dispatch(addTodoSuccess(res.data));
          })
          .catch(err => {
            // dispatch(addTodoFailure(err.message));
          })
    
      }

}