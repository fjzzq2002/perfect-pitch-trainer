import Typography from '@mui/material/Typography';
import HelpIcon from '@mui/icons-material/Help';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import React, { useState, useEffect } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
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
      <p>本工具目前有三个模块，连续音高识别，音程识别，和弦识别，其中第一个假设你具有绝对音感，如果你没有可以关掉该模块。本工具与已有的工具（如 <a href="https://www.tonegym.co/">ToneGym</a>）主要区别在于音高是连续的（即不局限于十二平均律，可以为任意频率）</p>
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
    <div>
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
  const [phase, setPhase] = React.useState(2);
  const [exercises, setExercises] = React.useState(() => ['pitch','interval','chord']);
  const [timelimit, setTimelimit] = React.useState("");
  const [octaves, setOctaves] = React.useState(()=>['3','4','5','6']);
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


  const playSound = () => {
		const synth = gimmeSynth();
    synth.triggerAttackRelease("C4", "8n");
  };

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
      <ToggleButton value="interval">
        音程
      </ToggleButton>
      <ToggleButton value="chord">
        和弦
      </ToggleButton>
    </ToggleButtonGroup>
    </div>
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
    </div>
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
      onClick={()=>{window.stopGiveup=1;setPhase(2);}} variant="outlined" size="large">差不多得了</Button>
    </div>
  );

  const semitone=(2**(1/12));
  const C3=220/semitone**9;
  const octMin=Math.min(...octaves);
  const octMax=Math.max(...octaves);
  const pitchMin=C3*(2**(octMin-3));
  const pitchMax=C3*(2**(octMax-2));
  const randomPitch=()=>Math.exp(Math.random()*(Math.log(pitchMax)-Math.log(pitchMin))+Math.log(pitchMin));
  console.log(pitchMin,pitchMax,randomPitch());
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

  const getNextExercise=(prevId)=>{
    const testPitch=randomPitch();
    const [index,cent]=pitchToIndexCent(testPitch);
    const start=index-Math.floor(Math.random()*3);
    return {
      id: prevId+1, type: 0, pitch: testPitch, start: start, synth: gimmeSynthParam()
    };
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
  console.log(testId,curExercise);
  if(testId!=curExercise.id)
    setTestId(curExercise.id);
  let h = localStorage.getItem('history_pitch');
  if(h===null) h=[];
  else h=JSON.parse(h);

  let curTest = <></>;
  let curTestStat = <></>;

  if(curExercise.type==0) {
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
    const playSound=(pitch)=>{
      let synth = gimmeSynth(curExercise.synth);
      synth.triggerAttackRelease(pitch, "8n");
      setTimeout(()=>{synth.dispose();},500);
    };
    const playTestSound=()=>{
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
    


    //[index,index+3]
    curTest=(
      <div>
        <Typography variant="h6">音高识别</Typography>
        <br/>
        <p>估计给出音的音高</p>
        <Button variant="outlined" size="medium" onClick={playTestSound}>播放</Button>
        <div style={{paddingTop:"30px",width:"300px",margin:"0 auto"}}>
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
