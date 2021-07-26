
export default function (state = { noteplaylist : [] , step : "initial", colplay : -1 }, action) {

    let tempstate = Object.assign({},state)
    let column = action.column
    let keys = action.keys
    let key = action.key

    switch (action.type) {
      case 'SETBLANKBOXCOL':
            let arr = Array.from(Array(column),e=>{})
            arr.forEach((e,col)=>{
                tempstate.noteplaylist.push({})
            })
            tempstate.step = "setblank"
            state = Object.assign({},state,tempstate)
            return state
      case 'SETBLANKBOXKEY':
            let blankboxkeys = tempstate.noteplaylist.map(e=>{
                let tempnoteplay = keys.reduce((acc,val) => {
                    acc[val] = { toplay : false , isplay : false }
                    return acc
                },{})
                return tempnoteplay
                // tempstate.noteplaylist.push(tempnoteplay)
            })
            tempstate.noteplaylist = blankboxkeys
            tempstate.noteplaylistbyno = {}
            tempstate.step = "setkey"
            state = Object.assign({},state,tempstate)
            return state
      case 'SETNOTETOPLAY':
            tempstate.noteplaylist[column][key]["toplay"] = !tempstate.noteplaylist[column][key]["toplay"]
            
            //30-6-2021
            if(Array.isArray(tempstate.noteplaylistbyno[column])){
                  if(tempstate.noteplaylistbyno[column].indexOf(key) != -1){
                        tempstate.noteplaylistbyno[column] = tempstate.noteplaylistbyno[column].filter(e=> e != key )
                  }else{
                        tempstate.noteplaylistbyno[column].push(key)
                  }
                  if(tempstate.noteplaylistbyno[column].length == 0){
                        delete tempstate.noteplaylistbyno[column]
                  }
            }else{
                  tempstate.noteplaylistbyno[column] = []
                  tempstate.noteplaylistbyno[column].push(key)
            }
            
            state = Object.assign({},state,tempstate)
            return state
      case 'SETNOTEPLAYING':
            tempstate.noteplaylist[column][key]["isplay"] = true
            tempstate.colplay = column
            state = Object.assign({},state,tempstate)
            return state
      case 'SETNOTESTOPPLAYING':
            tempstate.noteplaylist[column][key]["isplay"] = false
            state = Object.assign({},state,tempstate)
            return state
      case 'SETSTOPPLAYING':
            let playstatuschange = { playstatus : false, colplay : -1 }
            state = Object.assign({},state,playstatuschange)
      default:
            return state
    }
}