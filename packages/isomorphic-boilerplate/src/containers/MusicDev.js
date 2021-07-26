import React, { Component, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import { makeStyles } from '@material-ui/core/styles';
import { Icon, Grid, GridList, Paper, TextField } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SaveAlt from '@material-ui/icons/SaveAlt';
import GetApp from '@material-ui/icons/GetApp';
import * as Tone from 'tone';

import { getSong } from '../redux/Musicplay/action';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  keycontainer: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
    padding: '5px 5px 5px 5px'
  },
  keydisplay: {
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    textAlign: 'center',
    width: '20px',
    height: '9px',
    fontSize : '0.5rem',
  },
  keypad: {
    padding: theme.spacing(1),
    color: 'rgba(0,0,0,0)',
    textAlign: 'center',
    width: '20px',
    height: '9px',
    cursor: 'pointer',
    "&:hover": {
      backgroundColor : "rgba(0,0,0,0.2)"
    },
    backgroundColor: props => props.isplayingnote ? "rgba(100,50,100,1)" : (props.tapstatus ? "rgba(0,0,0,0.2)" : "white")
  },
  playbtn:{
    marginBottom: '1rem', 
    width: "40px", 
    textAlign : "center",
    cursor: 'pointer'
  },
  savebtn:{
    height:"80px !important",
    marginBottom: '1rem',
    marginTop: '15px', 
    width: "40px", 
    textAlign : "center",
    cursor: 'pointer'
  },
  loadbtn:{
    height:"80px !important",
    marginBottom: '1rem', 
    marginTop: '15px',
    width: "40px", 
    textAlign : "center",
    cursor: 'pointer'
  },
  textfield:{
    height:"80px !important",
    width:"200px !important",
    marginRight:"10px"
  }
}));

const keylist = ["E6","D6","C6","B5","A#5","A5","G#5","G5","F#5","F5","E5"]

function KeyListComponent(props) {

  const classes = useStyles();

  const keys = props.keys;
  const listItems = keys.map((key) =>
    <Grid item xs={1} sm={1} key={"KeyList_"+key}>
      <Paper className={classes.keydisplay} key={"Paper_"+key}>{key}</Paper>
    </Grid>
  );

  return (
    <ul>{listItems}</ul>
  );

}

function BlockRecordComponent(props) {

  const keys = props.keys;
  const column = props.column;

  return (
    <ul>{  
      keys.map((key) =>
         <BlockRecordPad key={"PAD_"+key} keypad={key} column={column} />
      )
    }</ul>
  );

}

function BlockRecordPad(props){

  //Redux Store
  const dispatch = useDispatch()
  const noteplaylist = useSelector(state=>state.MusicPlay.noteplaylist)
  const stepstatus = useSelector(state=>state.MusicPlay.step)
  const colplay = useSelector(state=>state.MusicPlay.colplay)
  const column = props.column

  //Local State
  const [tap,settap] = useState(false)

  const classes = useStyles({ 
    tapstatus : tap, 
    isplayingnote : stepstatus == "setkey" && colplay == props.column ? noteplaylist[props.column][props.keypad].isplay : false
  })

  function padClick(keyclick){

    const synth = new Tone.Synth().toDestination();
    const now = Tone.now()

    synth.triggerAttack(keyclick, now)
    synth.triggerRelease(now + 0.1)

    settap(!tap)
    dispatch({ type: 'SETNOTETOPLAY', key : keyclick, column : props.column })

  }

  return (
      <Grid item xs={1} sm={1} onClick={()=>{ padClick(props.keypad) }}>
        <Paper className={classes.keypad} key={props.column + props.keypad}>{props.column + props.keypad}</Paper>
      </Grid>
  )

}

export default function MusicDev(props) {

  const dispatch = useDispatch()

  const classes = useStyles();

  //REDUX STORE
  const noteplaylist = useSelector(state=>state.MusicPlay.noteplaylist)
  const noteplaylistbyno = useSelector(state=>state.MusicPlay.noteplaylistbyno)
  const stepstatus = useSelector(state=>state.MusicPlay.step)

  useEffect(()=>{
    dispatch({ type : 'SETBLANKBOXCOL', keys : keylist, column : 40 })
  },[])

  useEffect(()=>{
    if(stepstatus == 'setblank'){
      dispatch({ type : 'SETBLANKBOXKEY', keys : keylist })
    }
  },[stepstatus])

  function playRecord(){

    const now = Tone.now()

    // noteplaylist.forEach((e,i)=>{
    //   let keysplay = Object.keys(e)
    //   keysplay.forEach((keyplay,ip)=>{
    //       if(e[keyplay].toplay){
    //           const synth = new Tone.Synth().toDestination();
    //           synth.triggerAttack(keyplay, now + ((i+1)*0.5))
    //           synth.triggerRelease(now + ((i+1)*0.5) + 0.1)
    //           setTimeout(()=>{
    //             dispatch({ type : 'SETNOTEPLAYING', key : keyplay, column : i })
    //           },i*550)
    //           // setTimeout(()=>{
    //           //   dispatch({ type : 'SETNOTESTOPPLAYING', key : keyplay, column : i })
    //           // },i*1500)
    //       }
    //   })
    // })

    //Set Time Stop Play
    let columnplay = Object.keys(noteplaylistbyno).length > 0 ? Object.keys(noteplaylistbyno) : []
    if(columnplay.length > 0){
      columnplay = columnplay.sort((a,b)=> a-b)
      setTimeout(()=>{
        dispatch({ type : 'SETSTOPPLAYING' })
      },800*parseInt(columnplay[columnplay.length - 1]))
    }

    //Playing Note
    for (const [column, keys] of Object.entries(noteplaylistbyno)) {
      keys.forEach(key => {
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttack(key, now + ((column)*0.5))
        synth.triggerRelease(now + ((column)*0.5) + 0.1)
        setTimeout(()=>{
            dispatch({ type : 'SETNOTEPLAYING', key : key, column : column })
        },column*550)
      })
    }

  }

  function saveRecord(){
      
  }

  function loadRecord(){
      dispatch(getSong("","","1"))
  }

  return (
    <LayoutContentWrapper style={{ height: '100vh' }}>
      <LayoutContent>
        <h1 style={{ marginBottom: '1rem' }} >Music Box</h1>
        <GridList col={2}>
          <TextField id="musician" label="Musician" className={classes.textfield}/>
          <TextField id="song" label="Song" className={classes.textfield}/>
          <Grid item xs={1} sm={1} className={classes.savebtn} onClick={ ()=>{ saveRecord() }}>
          <Paper style={{ paddingTop: "2px" }}><SaveAlt/></Paper>
          </Grid>
          <Grid item xs={1} sm={1} className={classes.loadbtn} onClick={ ()=>{ loadRecord() }}>
            <Paper style={{ paddingTop: "2px" }}><GetApp/></Paper>
          </Grid>
        </GridList>
        <Grid item xs={1} sm={1} className={classes.playbtn} onClick={ ()=>{ playRecord() }}>
            <Paper style={{ paddingTop: "2px" }}><PlayArrowIcon/></Paper>
        </Grid>
        <GridList className={classes.keycontainer}>
              <KeyListComponent keys={keylist} />
              {Array.from(Array(40),(e,i)=>{
                  return  <BlockRecordComponent column={i+1} key={"Record_"+(i+1)} keys={keylist} />
              })}
        </GridList>
      </LayoutContent>
    </LayoutContentWrapper>
  );

}
