import Typography from '@mui/material/Typography';
import HelpIcon from '@mui/icons-material/Help';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import React, { useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';

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
    相对音感训练器</div>
    {helpButton}
  </div>
  </Typography>
  {expandHelp && intro}
  </div>
  )
}

function Exercise() {
  const [exercises, setExercises] = React.useState(() => ['pitch','interval','chord']);
  const [timelimit, setTimelimit] = React.useState("");
  const [octaves, setOctaves] = React.useState(()=>['2','3','4','5','6','7']);
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
    if (newLimit === null) newLimit = "";
    setTimelimit(newLimit);
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
      <ToggleButton value="2">2</ToggleButton>
      <ToggleButton value="3">3</ToggleButton>
      <ToggleButton value="4">4</ToggleButton>
      <ToggleButton value="5">5</ToggleButton>
      <ToggleButton value="6">6</ToggleButton>
      <ToggleButton value="7">7</ToggleButton>
    </ToggleButtonGroup>
    </div>
    </div>
    <div>
      <Button variant="outlined" size="large"
      disabled={exercises.length === 0}>
        开冲！
      </Button>
    </div>
    </>
  )
  return config;
}

function App() {
  return (
    <div className="App">
      <div className="container">
        <Header />
        <Exercise />
      </div>
    </div>
  );
}

export default App;
