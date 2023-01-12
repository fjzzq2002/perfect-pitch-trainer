import Typography from '@mui/material/Typography';
import HelpIcon from '@mui/icons-material/Help';
import Link from '@mui/material/Link';
import React, { useState, useEffect } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import * as Tone from 'tone'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function Header() {
  const [expandHelp, setExpandHelp] = useState(false);

  const intro=(
    <div style={{textAlign:"left",margin:"20px",borderBottom:"1px solid black"}}>
      <p>这是一个给有绝对音感的人设计的视唱练耳工具！</p>
      <p>部分绝对音感的人无法分辨10-40cent的偏差（<a href="https://music.stackexchange.com/q/108045/83035">一些讨论</a>），对于音程和和弦的直观识别也更为困难（更倾向于直接分辨出各个音高）。绝对音感和相对音感并不一定相关（虽然都与音乐训练正相关）。</p>
      <p>本工具目前有四个模块，音高识别、音距识别（即连续音程识别）、音程识别、和弦识别，其中第一个假设你具有绝对音感，如果你没有可以关掉该模块。本工具与已有的工具（如 <a href="https://www.tonegym.co/">ToneGym</a>）主要区别在于音高是连续的（即不局限于十二平均律，可以为任意频率）</p>
      <ul>
      <li>如果你正在进行与绝对音感有关的训练，不建议使用本工具，可能会导致标准音偏差。</li>
      <li>如果你并没有绝对音感，已有的工具可能更适合你。</li>
      <li>这一工具主要是为笔者本人自己使用设计的，如有需求可以提issue，但不保证解决（</li>
      </ul>
    </div>
  );
  const helpButton=(
    <Typography component="h6">
    <Link style={{
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    cursor: 'pointer'
  }} underline="none" color="inherit"
  onClick={()=>setExpandHelp(!expandHelp)}>
      <HelpIcon style={{
        marginRight: 3,
        paddingBottom: 1
      }}/>
      这是什么？
    </Link>
    </Typography>
  );
  return (
  <div>
  <Typography variant="h5">
  <div className="header">
    <div style={{visibility:"hidden"}}>{helpButton}</div>
    <div className="thetitle"
    onClick={
      ()=>{
        // refresh current page
        window.location.reload();
      }
    }>
    视唱练耳小练习</div>
    {helpButton}
  </div>
  </Typography>
  {expandHelp && intro}
  </div>
  )
}

const gimmeSynthParam = () => {
  const synthType = () => {
    const base = ['sine','square','triangle','sawtooth'];
    let comp = Math.floor(Math.random()*10)*2+4;
    if(Math.random()<1/3.) comp='';
    return base[Math.floor(Math.random()*base.length)]+comp;
  };
  return {
    modulationIndex: 10,
    harmonicity: Math.floor(Math.random()*4+1),
    envelope: {
      attack: 0.01,
      decay: 0.4,
      release: 0.3,
      sustain: 0
    },
    modulation: {
      type: synthType()
    },
    oscillator: {
      type: synthType()
    },
    modulationEnvelope: {
      attack: 0.2,
      decay: 0.01
    }
  };
}

const gimmeSynth = (param=undefined) => {
  if(param==undefined) param=gimmeSynthParam();
  return new Tone.FMSynth(param).toDestination();
}

//[12316006500000001231500540320000]
function giveYouUp(idx,oct=4,dir=-1) {
  if(window.stopGiveup==1) return;
  window.stopGiveup=-1;
  const synth=gimmeSynth();
  const notes = '123454321';
  //const notes = '1231600650000000123150054032000023424005302100000001500400000000';
  const note = notes[idx%notes.length];
  if(idx%3==0) {
    if(oct==3||oct==6) dir=-dir;
    oct+=dir;
  }
  if(note*1) {
    let p=(note-1)*2;
    if(note>=4) --p;
    const freq = 261.63*Math.pow(2,p/12+oct-4);
    synth.triggerAttackRelease(freq, "16n");
  }
  setTimeout(()=>{giveYouUp(idx+1,oct,dir)}, 80);
  setTimeout(()=>{synth.dispose();}, 500);
}
window.giveYouUp=giveYouUp;
window.stopGiveup=0;

function Exercise() {
  const [phase, setPhase] = React.useState(0);
  const [exercises, setExercises] = React.useState(() => ['pitch','intervalc','intervald','chord']);
  const [timelimit, setTimelimit] = React.useState("");
  const [replay, setReplay] = React.useState("");
  const [octaves, setOctaves] = React.useState(()=>['3','4','5','6']);
  // console.log(octaves,exercises);
  const handleExercises = (
    event, newFormats
  ) => {
    setExercises(newFormats);
  };

  const handleOctaves = (
    event, newFormats
  ) => {
    const cv=event.target.value;
    const curOctaves = octaves;
    let min = Math.min(...curOctaves);
    let max = Math.max(...curOctaves);
    if(cv<min) min=cv;
    else if(cv>max) max=cv;
    else {
      min=cv; max=cv;
    }
    min*=1.; max*=1.;
    let min_to_max=[];
    for(let i=min;i<=max;i++) min_to_max.push(i+'');
    setOctaves(min_to_max);
  };

  const handleTimelimit = (
    event, newLimit
  ) => {
    if (newLimit === null) return;
    setTimelimit(newLimit);
  };

  const handleReplay = (
    event, newReplay
  ) => {
    if (newReplay === null) return;
    setReplay(newReplay);
  }

  const config=(
    <>
    <div className="config">
    <div className="configcol">
      <Typography variant="subtitle1">练习模块</Typography>
    <ToggleButtonGroup
      color="primary"
      value={exercises}
      onChange={handleExercises}
    >
      <ToggleButton value="pitch">
        音高
      </ToggleButton>
      <ToggleButton value="intervalc">
        音距
      </ToggleButton>
      <ToggleButton value="intervald">
        音程
      </ToggleButton>
      <ToggleButton value="chord">
        和弦
      </ToggleButton>
    </ToggleButtonGroup>
    </div>
    <div className="configcol">
      <Typography variant="subtitle1">重新播放</Typography>
    <ToggleButtonGroup
      color="primary"
      value={replay}
      onChange={handleReplay}
      exclusive
    >
      <ToggleButton value="">禁止</ToggleButton>
      <ToggleButton value="1">允许</ToggleButton>
    </ToggleButtonGroup>
    </div>
    {
    (0)?(
    <div className="configcol">
      <Typography variant="subtitle1">时间限制</Typography>
    <ToggleButtonGroup
      color="primary"
      value={timelimit}
      onChange={handleTimelimit}
      exclusive
    >
      <ToggleButton value="">无</ToggleButton>
      <ToggleButton value="5">5</ToggleButton>
      <ToggleButton value="10">10</ToggleButton>
      <ToggleButton value="15">15</ToggleButton>
      <ToggleButton value="30">30</ToggleButton>
    </ToggleButtonGroup>
    </div>)
    :<></>
    }
    <div className="configcol">
      <Typography variant="subtitle1">音区</Typography>
    <ToggleButtonGroup
      color="primary"
      value={octaves}
      onChange={handleOctaves}
    >
      <ToggleButton value="3">3</ToggleButton>
      <ToggleButton value="4">4</ToggleButton>
      <ToggleButton value="5">5</ToggleButton>
      <ToggleButton value="6">6</ToggleButton>
    </ToggleButtonGroup>
    </div>
    </div>
    <div>
      <Button variant="outlined" size="large"
      disabled={exercises.length === 0}
      onClick={()=>{setPhase(1);}}>
        开冲！
      </Button>
    </div>
    </>
  )
  if(phase==1) {
    window.stopGiveup=0; if(window.stopGiveup!=-1) giveYouUp(0);
  }
  const testSound=(
    <div>
      接下来你应该听到一段声音，你可以依此调节你的音量。<br/><br/>
      <Button onLoad={()=>{}}
      onClick={()=>{window.stopGiveup=1;
        let nextExercise=getNextExercise(curExercise.id);
        localStorage.setItem('cur_exercise',JSON.stringify(nextExercise));
      setPhase(2);}} variant="outlined" size="large">差不多得了</Button>
    </div>
  );

  const semitone=(2**(1/12));
  const C3=220/semitone**9;
  const octMin=Math.min(...octaves);
  const octMax=Math.max(...octaves);
  const pitchMin=C3*(2**(octMin-3));
  const pitchMax=C3*(2**(octMax-2));
  const randomPitch=()=>Math.exp(Math.random()*(Math.log(pitchMax)-Math.log(pitchMin))+Math.log(pitchMin));
  // console.log(pitchMin,pitchMax,randomPitch());
  const indexToName=(index)=>{
    let h=index%12;
    const g=Math.floor(index/12);
    if(h<0) h+=12;
    const names=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    return names[h]+(g+3);
  };
  const indexToPitch=(index)=>{
    return C3*semitone**index;
  };
  const pitchToIndexCent=(pitch)=>{
    pitch/=C3;
    let index=0;
    while(pitch<1) {
      pitch*=semitone;
      index--;
    }
    while(pitch>=semitone) {
      pitch/=semitone;
      index++;
    }
    //console.log(pitch,semitone);
    return [index,Math.round(Math.log(pitch)*100/Math.log(semitone))];
  };
  const pitchToDesc=(pitch)=>{
    const [index,cent]=pitchToIndexCent(pitch);
    return indexToName(index)+" +"+cent.toFixed(0)+" / "+indexToName(index+1)+" -"+(100-cent).toFixed(0);
  };
  const [testId,setTestId]=React.useState(1);
  
  const chordTypesNoInv=[
    ['M',[0,4,7]],
    ['m',[0,3,7]],
    ['aug',[0,4,8]],
    ['dim',[0,3,6]],
    ['7',[0,4,7,10]],
    ['aug7',[0,4,8,11]],
    ['M7',[0,4,7,11]],
    ['m7',[0,3,7,10]],
    ['ø7',[0,3,6,10]],
    ['dim7',[0,3,6,9]],
    ['sus',[0,2,7]],
    // ['sus4',[0,5,7]],
  ];
  let chordTypes=[];
  let found={};
  for(const [symbol,pit] of chordTypesNoInv) {
    // console.log(symbol,pit);
    for(let i=0;i<pit.length;++i) {
      const pits=[];
      for(let j=0;j<pit.length;++j) pits.push((pit[(i+j)%pit.length]-pit[i]+12)%12);
      if(i!=0&&(symbol.indexOf('7')!=-1))
         continue;
      if(i==1&&(symbol.indexOf('sus')!=-1))
        continue;
      const pitseq=pits.join(',');
      const symbol2=symbol+"-"+i;
      if(found[pitseq]!==undefined) {
        console.log(symbol2,found[pitseq]);
        continue;
      }
      found[pitseq]=symbol2;
      chordTypes.push([symbol2,pits]);
    }
  }

  const getNextExercise=(prevId)=>{
    const type = exercises[Math.floor(Math.random()*exercises.length)];
    console.log('exercise type',type);
    if(type=='pitch') {
      const testPitch=randomPitch();
      const [index,cent]=pitchToIndexCent(testPitch);
      const start=index-Math.floor(Math.random()*3);
      return {
        id: prevId+1, type: 'pitch', pitch: testPitch, start: start, synth: gimmeSynthParam()
      };
    }
    if(type=='intervalc') {
      // +-2 semitones
      const basePitch=randomPitch();
      const nextPitch=basePitch*(semitone**(Math.random()*4-2));
      return {
        id: prevId+1, type: 'intervalc', pitch: [basePitch, nextPitch], synth: gimmeSynthParam()
      };
    }
    if(type=='intervald') {
      // +-1 oct
      let basePitch,diff,nextPitch;
      while(1) {
        basePitch=randomPitch();
        diff=Math.floor(Math.random()*25)-12;
        nextPitch=basePitch*(semitone**diff);
        if(nextPitch<pitchMin||nextPitch>pitchMax||diff==0) continue;
        break;
      }
      return {
        id: prevId+1, type: 'intervald', pitch: [basePitch, nextPitch], diff: diff, synth: gimmeSynthParam()
      };
    }
    if(type=='chord') {
      // let octMin1=Math.max(octMin,4);
      // let octMax1=Math.min(octMax,5);
      // if(octMin1>octMax1) {
      //   if(octMax<4) {
      //     octMin1=octMax1=4;
      //   }
      //   else {
      //     octMin1=octMax1=5;
      //   }
      // }
      // const pitchMin1=C3*(2**(octMin1-3));
      // const pitchMax1=C3*(2**(octMax1-2));
      // limited to 4th and 5th octave, otherwise too hard
      let chosenType=chordTypes[Math.floor(Math.random()*chordTypes.length)];
      let pitches,bassPitch;
      while(1) {
        bassPitch=randomPitch();
        pitches=chosenType[1].map(x=>(bassPitch*(semitone**x)));
        if(Math.min(...pitches)<pitchMin||Math.max(...pitches)>pitchMax) continue;
        break;
      }
      let synthParam;
      while(1) {
        synthParam=gimmeSynthParam();
        // if(synthParam.oscillator.type!='square')
        break;
      }
      // console.log(synthParam.oscillator.type,synthParam.modulation.type);
      return {
        id: prevId+1, type: 'chord', pitch: pitches, bass: bassPitch, chord: chosenType, synth: synthParam
      };
    }
  };
  let g = localStorage.getItem('cur_exercise');
  let curExercise;
  if(g===null) {
    curExercise=getNextExercise(0);
    localStorage.setItem('cur_exercise',JSON.stringify(curExercise));
  }
  else {
    curExercise=JSON.parse(g);
  }
  if(curExercise.type==0) curExercise.type='pitch'; // backward compatibility
  // console.log(testId,curExercise);
  if(testId!=curExercise.id)
    setTestId(curExercise.id);

  let curTest = <></>;
  let curTestStat = <></>;
  const playSound=(pitch)=>{
    let synth = gimmeSynth(curExercise.synth);
    synth.triggerAttackRelease(pitch, "8n");
    setTimeout(()=>{synth.dispose();},500);
  };

  // the code is literally so bad, refactor todo

  if(curExercise.type=='pitch') {
    let h = localStorage.getItem('history_pitch');
    if(h===null) h=[];
    else h=JSON.parse(h);
    const testPitch=curExercise.pitch;
    const [index,cent]=pitchToIndexCent(testPitch);
    const start=curExercise.start;
    console.log(start,curExercise,testPitch,index,cent);

    let answer=undefined;
    let answerX=undefined;


    const pitchTestInit=(e)=>{
      if(answer!==undefined) return;
      let ele = e.target;
      var ctx = ele.getContext('2d');
      ctx.clearRect(0,0,ele.width,ele.height);
      ctx.strokeStyle = '#2D728F';
      // make the stroke dashed
      ctx.lineWidth = 1;
      ctx.moveTo(105,0);
      ctx.lineTo(105,500);
      ctx.moveTo(205,0);
      ctx.lineTo(205,500);
      ctx.stroke();
      ele=ele.parentElement;
      //console.log(ele);
      ele=ele.getElementsByClassName("centss")[0];
      ele.innerHTML='&nbsp';
    }

    const pitchTestMove=(e)=>{
      if(answer!==undefined) return;
      let ele = e.target;
      let curX=e.clientX-ele.offsetLeft;
      curX-=5;
      if(curX<0) curX=0;
      if(curX>300) curX=300;
      if(answer!==undefined) curX=answerX;
      var ctx = ele.getContext('2d');
      ctx.clearRect(0,0,ele.width,ele.height);
      ctx.strokeStyle = '#2D728F';
      ctx.lineWidth = 1;
      ctx.moveTo(105,0);
      ctx.lineTo(105,500);
      ctx.moveTo(205,0);
      ctx.lineTo(205,500);
      ctx.stroke();
      ctx.strokeStyle = '#2C6777';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(curX+5,0);
      ctx.lineTo(curX+5,500);
      ctx.stroke();
      ctx.beginPath();
      //console.log(ele);
      ele=ele.parentElement;
      //console.log(ele);
      ele=ele.getElementsByClassName("centss")[0];
      let g=indexToPitch(start)*semitone**(curX/100);
      ele.innerText=pitchToDesc(g);
  //    console.log(ele);
    };
    let played=false;

    const playTestSound=(e)=>{
      if(played&&answer===undefined) {
        alert('重播已被禁用');
        return;
      }
      if(replay=="") played=true;
      playSound(testPitch);
    };

    const pitchTestSubmit=(e)=>{
      let ele = e.target;
      let curX=e.clientX-ele.offsetLeft;
      curX-=5;
      if(curX<0) curX=0;
      if(curX>300) curX=300;
      const ths=indexToPitch(start)*semitone**(curX/100);
      playSound(ths);
      if(answer!==undefined) return;
      answerX=curX;
      answer=ths;
      const [index2,cent2]=pitchToIndexCent(answer);
      const delta=(index2*100+cent2)-(index*100+cent);
      const dx=index*100+cent-start*100;
      var ctx = ele.getContext('2d');
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 1;
      ctx.moveTo(dx+5,0);
      ctx.lineTo(dx+5,500);
      ctx.stroke();
      ele=ele.parentElement.parentElement.getElementsByClassName('disppr')[0];
      let report=`答案是 ${pitchToDesc(testPitch)}，你的回答`;
      if(delta===0) report+='完美无缺！';
      else if(delta>0) report+=`高了 ${delta} 音分。`;
      else report+=`低了 ${-delta} 音分。`;
      ele.getElementsByTagName('div')[0].innerText=report;
      ele.style.display='block';
      let nextExercise=getNextExercise(curExercise.id);
      localStorage.setItem('cur_exercise',JSON.stringify(nextExercise));
      h.push(delta);
      localStorage.setItem('history_pitch',JSON.stringify(h));
    };
    

    curTest=(
      <div>
        <Typography variant="h6">音高识别</Typography>
        <br/>
        <p>估计给出音的音高</p>
        <Button variant="outlined" size="medium" onClick={playTestSound}>播放</Button>
        <div style={{paddingTop:"30px",width:"310px",margin:"0 auto"}}>
        <div style={{display:"flex", justifyContent:"space-between",paddingBottom:"5px"}}>
        <div>下方音条范围：{indexToName(start)}~{indexToName(start+3)}</div>
        </div>
        <canvas width="310" height="50" style={{border:"1px solid black"}}
        onMouseOut={pitchTestInit}
        onMouseUp={pitchTestSubmit}
        onMouseMove={pitchTestMove}></canvas>
        <Typography variant="body1">
        <div style={{paddingBottom:"5px"}} className="centss">&nbsp;</div>
        </Typography>
        </div>
        <div className="disppr" style={{paddingTop:"20px",display:"none"}}>
        <div style={{paddingBottom:"10px"}}>123</div>
        <Button variant="outlined" size="medium" onClick={()=>playSound(testPitch)}>播放正确答案</Button>
        <Button variant="outlined" size="medium" onClick={()=>playSound(answer)}>播放你选择的音</Button>
        <Button variant="outlined" color="success" disableElevation size="medium" onClick={(e)=>{
          setTestId(curExercise.id+1);
          const par=e.target.parentElement;
          par.style.display='none';
          const cv = par.parentElement.getElementsByTagName('canvas')[0];
          const ctx=cv.getContext('2d');
          ctx.clearRect(0,0,310,50);
          const cs = par.parentElement.getElementsByClassName('centss')[0];
          cs.innerHTML='&nbsp';
        }}>→下一题</Button>
        </div>
      </div>
    );
    curTestStat=(
      <div>
        该练习平均误差：{(h.length)?(
          (h.map(x=>Math.abs(x)).reduce((a,b)=>a+b,0)/h.length).toFixed(2)
        +' 音分 ('+h.length+')'):'无历史记录'}&nbsp;&nbsp;
        <Link underline="none" style={{cursor:"pointer"}}
        onClick={()=>{
          if(!window.confirm("确认重置"+h.length+"条该练习历史记录？")) return;
          localStorage.setItem('history_pitch',JSON.stringify([]));
        }}
        >重置</Link>
      </div>
    );
  }
  

  if(curExercise.type=='intervalc') {
    let h = localStorage.getItem('history_intervalc');
    if(h===null) h=[];
    else h=JSON.parse(h);
    const [basePitch,nextPitch]=curExercise.pitch;

    let answer=undefined;
    let answerX=undefined;


    const pitchTestInit=(e)=>{
      if(answer!==undefined) return;
      let ele = e.target;
      var ctx = ele.getContext('2d');
      ctx.clearRect(0,0,ele.width,ele.height);
      ctx.strokeStyle = '#2D728F';
      // make the stroke dashed
      ctx.lineWidth = 1;
      ctx.moveTo(105,0);
      ctx.lineTo(105,500);
      ctx.moveTo(205,0);
      ctx.lineTo(205,500);
      ctx.moveTo(305,0);
      ctx.lineTo(305,500);
      ctx.stroke();
      ele=ele.parentElement;
      //console.log(ele);
      ele=ele.getElementsByClassName("centss")[0];
      ele.innerHTML='&nbsp';
    }

    const pitchTestMove=(e)=>{
      if(answer!==undefined) return;
      let ele = e.target;
      let curX=e.clientX-ele.offsetLeft;
      curX-=5;
      if(curX<0) curX=0;
      if(curX>400) curX=400;
      if(answer!==undefined) curX=answerX;
      var ctx = ele.getContext('2d');
      ctx.clearRect(0,0,ele.width,ele.height);
      ctx.strokeStyle = '#2D728F';
      ctx.lineWidth = 1;
      ctx.moveTo(105,0);
      ctx.lineTo(105,500);
      ctx.moveTo(205,0);
      ctx.lineTo(205,500);
      ctx.moveTo(305,0);
      ctx.lineTo(305,500);
      ctx.stroke();
      ctx.strokeStyle = '#2C6777';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(curX+5,0);
      ctx.lineTo(curX+5,500);
      ctx.stroke();
      ctx.beginPath();
      //console.log(ele);
      ele=ele.parentElement;
      //console.log(ele);
      ele=ele.getElementsByClassName("centss")[0];
      let desc;
      curX=curX*1-200;
      if(curX===0) desc='第二个音与第一个相同';
      else if(curX>0) desc=`第二个音比第一个高 ${curX} 音分`
      else desc=`第二个音比第一个低 ${-curX} 音分`
      ele.innerText=desc;
  //    console.log(ele);
    };
    let played=false;

    const playTestSound=()=>{
      if(played&&answer===undefined) {
        alert('重播已被禁用');
        return;
      }
      if(replay=="") played=true;
      let synth = gimmeSynth(curExercise.synth);
      synth.triggerAttackRelease(basePitch, "8n");
      setTimeout(()=>{
        synth.triggerAttackRelease(nextPitch, "8n");
        setTimeout(()=>{synth.dispose();},500);
      },600);
    };

    const pitchTestSubmit=(e)=>{
      let ele = e.target;
      let curX=e.clientX-ele.offsetLeft;
      curX-=5;
      if(curX<0) curX=0;
      if(curX>400) curX=400;
      const ths=basePitch*semitone**((curX-200)/100);
      playSound(ths);
      if(answer!==undefined) return;
      answerX=curX;
      answer=ths;
      const dx=Math.round(Math.log(nextPitch/basePitch)/Math.log(semitone)*100);
      const delta=curX-(dx+200);
      var ctx = ele.getContext('2d');
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 1;
      ctx.moveTo(dx+205,0);
      ctx.lineTo(dx+205,500);
      ctx.stroke();
      ele=ele.parentElement.parentElement.getElementsByClassName('disppr')[0];
      let report=`第一个音是 ${pitchToDesc(basePitch)}，第二个音是 ${pitchToDesc(nextPitch)}。\n`;
      report+=`第二个音实际`;
      if(dx===0) report+='和第一个音相同';
      else if(dx>0) report+='比第一个高'+dx+'音分';
      else report+='比第一个低'+(-dx)+'音分';
      report+=`，你的估计`;
      if(delta===0) report+='完美无缺！';
      else if(delta>0) report+=`高了 ${delta} 音分。`;
      else report+=`低了 ${-delta} 音分。`;
      ele.getElementsByTagName('div')[0].innerText=report;
      ele.style.display='block';
      let nextExercise=getNextExercise(curExercise.id);
      localStorage.setItem('cur_exercise',JSON.stringify(nextExercise));
      h.push(delta);
      localStorage.setItem('history_intervalc',JSON.stringify(h));
    };

    //[index,index+3]
    curTest=(
      <div>
        <Typography variant="h6">音距识别</Typography>
        <br/>
        <p>估计第二个音相比第一个音的差别</p>
        <Button variant="outlined" size="medium" onClick={playTestSound}>播放</Button>
        <div style={{paddingTop:"30px",width:"410px",margin:"0 auto"}}>
        <div style={{display:"flex", justifyContent:"space-between",paddingBottom:"5px"}}>
        <div>下方音条范围：±200 音分</div>
        </div>
        <canvas width="410" height="50" style={{border:"1px solid black"}}
        onMouseOut={pitchTestInit}
        onMouseUp={pitchTestSubmit}
        onMouseMove={pitchTestMove}></canvas>
        <Typography variant="body1">
        <div style={{paddingBottom:"5px"}} className="centss">&nbsp;</div>
        </Typography>
        </div>
        <div className="disppr" style={{paddingTop:"20px",display:"none"}}>
        <div style={{paddingBottom:"10px"}}>123</div>
        <Button variant="outlined" size="medium" onClick={()=>playSound(basePitch)}>播放第一个音</Button>
        <Button variant="outlined" size="medium" onClick={()=>playSound(nextPitch)}>播放第二个音</Button>
        <Button variant="outlined" size="medium" onClick={()=>playSound(answer)}>播放你选择的音</Button>
        <Button variant="outlined" color="success" disableElevation size="medium" onClick={(e)=>{
          setTestId(curExercise.id+1);
          const par=e.target.parentElement;
          par.style.display='none';
          const cv = par.parentElement.getElementsByTagName('canvas')[0];
          const ctx=cv.getContext('2d');
          ctx.clearRect(0,0,310,50);
          const cs = par.parentElement.getElementsByClassName('centss')[0];
          cs.innerHTML='&nbsp';
        }}>→下一题</Button>
        </div>
      </div>
    );
    curTestStat=(
      <div>
        该练习平均误差：{(h.length)?(
          (h.map(x=>Math.abs(x)).reduce((a,b)=>a+b,0)/h.length).toFixed(2)
        +' 音分 ('+h.length+')'):'无历史记录'}&nbsp;&nbsp;
        <Link underline="none" style={{cursor:"pointer"}}
        onClick={()=>{
          if(!window.confirm("确认重置"+h.length+"条该练习历史记录？")) return;
          localStorage.setItem('history_intervalc',JSON.stringify([]));
        }}
        >重置</Link>
      </div>
    );
  }

  
  if(curExercise.type=='intervald') {
    let h = localStorage.getItem('history_intervald');
    if(h===null) h=[];
    else h=JSON.parse(h);
    const [basePitch,nextPitch]=curExercise.pitch;
    const diff=curExercise.diff;
    let played=false;
    let answerX=undefined;
    let answer=undefined;

    const playTestSound=()=>{
      if(played&&answer===undefined) {
        alert('重播已被禁用');
        return;
      }
      if(replay=="") played=true;
      let synth = gimmeSynth(curExercise.synth);
      // const synthp = new Tone.PolySynth(Tone.FMSynth,curExercise.synth).toDestination();
      synth.triggerAttackRelease(basePitch, "8n");
      setTimeout(()=>{
        synth.triggerAttackRelease(nextPitch, "8n");
        setTimeout(()=>{synth.dispose();},500);
      },600);
    };


    const submitIntervalD=(t)=>{
      let ths=t.getAttribute('val')*1.;
      console.log(ths,t);
      playSound(basePitch*semitone**ths);
      if(answerX!==undefined) return;
      answerX=ths;
      if(answerX==diff) {
        t.classList.add('button_green');
      }
      else {
        t.classList.add('button_brown');
      }
      answer=basePitch*semitone**ths;
      let diffDesc=null;
      for(const but of t.parentElement.parentElement.parentElement.getElementsByTagName('button')) {
        if(but.getAttribute('val')*1.==diff) {
          diffDesc='第二个音比第一个音'+((diff>0)?'高':'低')+but.innerText+'度（'+Math.abs(diff)+'个半音）';
          break;
        }
      }
      let report=`第一个音是 ${pitchToDesc(basePitch)}，第二个音是 ${pitchToDesc(nextPitch)}。\n`;
      report+=diffDesc;
      if(answerX==diff) report+='，正确。';
      else report+='，错误。';
      console.log(answer,report);
      let ele=t.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('disppr')[0];
      console.log(ele,t,t.parentElement.parentElement.parentElement);
      ele.getElementsByTagName('div')[0].innerText=report;
      ele.style.display='block';
      let nextExercise=getNextExercise(curExercise.id);
      localStorage.setItem('cur_exercise',JSON.stringify(nextExercise));
      h.push([answerX,diff]);
      localStorage.setItem('history_intervald',JSON.stringify(h));
    };


    //[index,index+3]
    curTest=(
      <div>
        <Typography variant="h6">音程识别</Typography>
        <br/>
        <p>给出第二个音与第一个音相差的半音数</p>
        <Button variant="outlined" size="medium" onClick={playTestSound}>播放</Button>
        <div style={{paddingTop:"30px",margin:"auto",width:"max-content",textAlign:"left",lineHeight:"30px"}} className="itvdiv">
        <div>第二个音比第一个音...</div>
        <div>高&nbsp;&nbsp;
          <ButtonGroup color="primary" size="small" onClick={(e)=>{submitIntervalD(e.target);}}>
            <Button val="+1">小二</Button>
            <Button val="+2">大二</Button>
            <Button val="+3">小三</Button>
            <Button val="+4">大三</Button>
            <Button val="+5">纯四</Button>
            <Button val="+6">增四</Button>
            <Button val="+7">纯五</Button>
            <Button val="+8">小六</Button>
            <Button val="+9">大六</Button>
            <Button val="+10">小七</Button>
            <Button val="+11">大七</Button>
            <Button val="+12">纯八</Button>
          </ButtonGroup>
        </div>
        <div>低&nbsp;&nbsp;
          <ButtonGroup color="primary" size="small" onClick={(e)=>{submitIntervalD(e.target);}}>
            <Button val="-1">小二</Button>
            <Button val="-2">大二</Button>
            <Button val="-3">小三</Button>
            <Button val="-4">大三</Button>
            <Button val="-5">纯四</Button>
            <Button val="-6">增四</Button>
            <Button val="-7">纯五</Button>
            <Button val="-8">小六</Button>
            <Button val="-9">大六</Button>
            <Button val="-10">小七</Button>
            <Button val="-11">大七</Button>
            <Button val="-12">纯八</Button>
          </ButtonGroup>
        </div>
        </div>
        <div className="disppr" style={{paddingTop:"20px",display:"none"}}>
        <div style={{paddingBottom:"10px"}}>123</div>
        <Button variant="outlined" size="medium" onClick={()=>playSound(basePitch)}>播放第一个音</Button>
        <Button variant="outlined" size="medium" onClick={()=>playSound(nextPitch)}>播放第二个音</Button>
        <Button variant="outlined" size="medium" onClick={()=>playSound(answer)}>播放你选择的音</Button>
        <Button variant="outlined" color="success" disableElevation size="medium" onClick={(e)=>{
          setTestId(curExercise.id+1);
          const par=e.target.parentElement;
          par.style.display='none';
          for(const col of ['button_green','button_brown'])
            for(const but of document.getElementsByClassName(col)) {
              console.log(but);
              but.classList.remove(col);
            }
          
          /*
          const cv = par.parentElement.getElementsByTagName('canvas')[0];
          const ctx=cv.getContext('2d');
          ctx.clearRect(0,0,310,50);
          const cs = par.parentElement.getElementsByClassName('centss')[0];
          cs.innerHTML='&nbsp';*/

        }}>→下一题</Button>
        </div>
      </div>
    );
    curTestStat=(
      <div>
        该练习正确率：{(h.length)?(
          (h.map(x=>(x[0]==x[1])).reduce((a,b)=>a+b,0)/h.length*100).toFixed(2)
        +'% ('+h.length+')'):'无历史记录'}&nbsp;&nbsp;
        <Link underline="none" style={{cursor:"pointer"}}
        onClick={()=>{
          if(!window.confirm("确认重置"+h.length+"条该练习历史记录？")) return;
          localStorage.setItem('history_intervald',JSON.stringify([]));
        }}
        >重置</Link>
      </div>
    );
  }
  
  if(curExercise.type=='chord') {
    let h = localStorage.getItem('history_chord');
    if(h===null) h=[];
    else h=JSON.parse(h);
    const pitches=curExercise.pitch;
    const bass=curExercise.bass;
    const chord=curExercise.chord;
    const invId=chord[0].substring(chord[0].indexOf('-')+1)*1;
    const root=bass*semitone**chord[1][(chord[1].length-invId)%chord[1].length];
    const getChordSemitones=(symbol,noTrans=true)=>{
      const cands=[];
      for(const [name, semi] of chordTypes) {
        if(name.substring(0,name.indexOf('-'))==symbol) cands.push(semi);
      }
      if(noTrans) return cands[0];
      return cands[Math.floor(Math.random()*cands.length)];
    };
    const playChord=(bass, chordSemitones)=>{
      const synth = new Tone.PolySynth(Tone.FMSynth,curExercise.synth).toDestination();
      synth.triggerAttackRelease(chordSemitones.map(x=>bass*(semitone**x)), "8n");
      setTimeout(()=>{synth.dispose();},1000);
    };

    let played=false;
    let answerX=undefined;
    let answer=undefined;
    let clks=new Map();

    const playTestSound=()=>{
      if(played&&answer===undefined) {
        alert('重播已被禁用');
        return;
      }
      if(replay=="") played=true;
      playChord(bass,chord[1]);
    };


    const extractType=(t)=>{
      let u=t.innerText;
      u=u.substr(u.indexOf('/')+2);
      return u;
    };

    const submitChord=(t)=>{
      let ths=extractType(t);
      const semi=getChordSemitones(ths);
      console.log(ths,semi);
      if(!clks.has(ths)) clks.set(ths,-1);
      let curTr=(clks.get(ths)+1)%semi.length;
      clks.set(ths,curTr);
      if(curTr==0) curTr+=semi.length;
      const trSemi=[];
      for(let i=curTr;i<semi.length;i++) trSemi.push(semi[i]-12);
      for(let i=0;i<curTr;i++) trSemi.push(semi[i]);
      console.log(ths,semi,trSemi);
      playChord(root,trSemi);
      //playSound(basePitch*semitone**ths);
      if(answerX!==undefined) return;
      answerX=ths; answer=ths;
      const [actual,trans]=chord[0].split('-');
      if(answerX==actual) {
        t.classList.add('button_green');
        // console.log('GG');
      }
      else {
        t.classList.add('button_brown');
        // console.log('BAD');
      }
      let diffDesc=null;
      for(const but of t.parentElement.parentElement.parentElement.getElementsByTagName('button')) {
        if(extractType(but)==actual) {
          diffDesc=but.innerText;
          break;
        }
      }
      let report=`根音为 ${pitchToDesc(root)}，给定的和弦是`;
      if(actual=='sus') {
        report=`根音为 ${pitchToDesc(bass)}，给定的和弦是`;
        if(trans!=0) report+='挂四和弦';
        else report+='挂二和弦';
      }
      else {
        report+=diffDesc.substring(0,diffDesc.indexOf(' '));
        if(trans!=0) report+='（第'+('一二三四'[trans-1])+'转位）';
      }
      if(answerX==actual) report+='，正确。';
      else report+='，错误。';
      let ele=t.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('disppr')[0];
      console.log(ele,t,t.parentElement.parentElement.parentElement);
      ele.getElementsByTagName('div')[0].innerText=report;
      ele.style.display='block';
      let nextExercise=getNextExercise(curExercise.id);
      localStorage.setItem('cur_exercise',JSON.stringify(nextExercise));
      h.push([answerX,actual,chord]);
      localStorage.setItem('history_chord',JSON.stringify(h));
    };

    console.log(chordTypes);


    //[index,index+3]
    curTest=(
      <div>
        <Typography variant="h6">和弦识别</Typography>
        <br/>
        <p>给出给定的和弦类型</p>
        <Button variant="outlined" size="medium" onClick={playTestSound}>播放</Button>
        <div style={{paddingTop:"30px",margin:"auto",width:"max-content",textAlign:"left",lineHeight:"30px"}} className="itvdiv">
        <div style={{margin:"0 auto",display:(chord[0].indexOf('7')==-1)?'block':'none'}}>
          <ButtonGroup color="primary" size="medium" onClick={(e)=>{submitChord(e.target);}} className="chordbut">
            <Button>减三和弦 / dim</Button>
            <Button>小三和弦 / m</Button>
            <Button>大三和弦 / M</Button>
            <Button>增三和弦 / aug</Button>
            <Button>挂留和弦 / sus</Button>
          </ButtonGroup>
        </div>
        <div style={{margin:"0 auto",display:(chord[0].indexOf('7')!=-1)?'block':'none'}}>
          <ButtonGroup color="primary" size="medium" onClick={(e)=>{submitChord(e.target);}} className="chordbut">
            <Button>减七和弦 / dim7</Button>
            <Button>半减七和弦 / ø7</Button>
            <Button>小七和弦 / m7</Button>
            <Button>属七和弦 / 7</Button>
            <Button>大七和弦 / M7</Button>
            <Button>增七和弦 / aug7</Button>
          </ButtonGroup>
        </div>
        </div>
        <div className="disppr" style={{paddingTop:"20px",display:"none"}}>
        <div style={{paddingBottom:"10px"}}>123</div>
        <Button variant="outlined" color="success" disableElevation size="medium" onClick={(e)=>{
          setTestId(curExercise.id+1);
          const par=e.target.parentElement;
          par.style.display='none';
          for(const col of ['button_green','button_brown'])
            for(const but of document.getElementsByClassName(col)) {
              console.log(but);
              but.classList.remove(col);
            }
          
          /*
          const cv = par.parentElement.getElementsByTagName('canvas')[0];
          const ctx=cv.getContext('2d');
          ctx.clearRect(0,0,310,50);
          const cs = par.parentElement.getElementsByClassName('centss')[0];
          cs.innerHTML='&nbsp';*/

        }}>→下一题</Button>
        </div>
      </div>
    );
    curTestStat=(
      <div>
        该练习正确率：{(h.length)?(
          (h.map(x=>(x[0]==x[1])).reduce((a,b)=>a+b,0)/h.length*100).toFixed(2)
        +'% ('+h.length+')'):'无历史记录'}&nbsp;&nbsp;
        <Link underline="none" style={{cursor:"pointer"}}
        onClick={()=>{
          if(!window.confirm("确认重置"+h.length+"条该练习历史记录？")) return;
          localStorage.setItem('history_chord',JSON.stringify([]));
        }}
        >重置</Link>
      </div>
    );
  }

  const actualTest=(
    <>
    <div style={{display:"flex",justifyContent:"space-between"}}>
      <div style={{paddingBottom:"5px"}}>
    #{testId}</div>
    <div>
      {curTestStat}
    </div>
    </div>
    {curTest}
    </>
  );
  if(phase==0) return config;
  if(phase==1) return testSound;
  if(phase==2) return actualTest;
}

function App() {
  return (
    <div className="App">
      <div className="container">
      <div style={{margin:"0px 15px"}}>
        <Header />
        <Exercise />
      </div>
      </div>
    </div>
  );
}

export default App;
