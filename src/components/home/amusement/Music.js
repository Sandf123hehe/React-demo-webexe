import React, { useState, useRef, useEffect } from 'react';
import './Music.css'; // 引入 CSS 文件

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const audioRef = useRef(new Audio());
  const [hoverTime, setHoverTime] = useState('00:00');
  const [hoverWidth, setHoverWidth] = useState(0);
  const [isRotating, setIsRotating] = useState(false); // 新增旋转状态

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('http://111.231.79.183:5201/api/getMusicData');
        const data = await response.json();
        setSongs(data.music); // 确保 data.music 是数组
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };

    fetchSongs();
  }, []);

  useEffect(() => {
    if (songs.length > 0) {
      audioRef.current.src = `${process.env.PUBLIC_URL}/musics/${songs[currentSongIndex].src}`;
      audioRef.current.load();
      audioRef.current.addEventListener('timeupdate', updateCurrentTime);
      return () => {
        audioRef.current.removeEventListener('timeupdate', updateCurrentTime);
      };
    }
  }, [currentSongIndex, songs]);

  const updateCurrentTime = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsRotating(false); // 停止旋转
    } else {
      audioRef.current.play();
      setIsRotating(true); // 开始旋转
    }
    setIsPlaying(!isPlaying);
  };

  const selectTrack = (direction) => {
    setCurrentSongIndex((prevIndex) => {
      const newIndex = prevIndex + direction;
      return newIndex < 0 ? 0 : newIndex >= songs.length ? songs.length - 1 : newIndex;
    });
    setIsPlaying(true); // 设置为播放状态
    audioRef.current.play(); // 直接开始播放新曲目
    setIsRotating(true); // 开始旋转
  };

  const handleProgressChange = (event) => {
    const newProgress = event.target.value;
    setProgress(newProgress);
    audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
  };

  const showHover = (e) => {
    const progressBox = e.target.getBoundingClientRect();
    const progressLoc = (e.clientX - progressBox.left) / progressBox.width * duration;
    const minutes = Math.floor(progressLoc / 60);
    const seconds = Math.floor(progressLoc % 60);
    setHoverTime(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    setHoverWidth(e.clientX - progressBox.left);
  };

  const hideHover = () => {
    setHoverWidth(0);
  };

  const playFromClickedPos = (e) => {
    const progressBox = e.target.getBoundingClientRect();
    const progressLoc = (e.clientX - progressBox.left) / progressBox.width * duration;
    if (isFinite(duration) && duration > 0) {
      audioRef.current.currentTime = Math.min(Math.max(progressLoc, 0), duration);
    } else {
      console.error("Invalid duration:", duration);
    }
  };

  const filteredSongs = songs.filter(song => {
    const title = song.title || ''; // 如果 title 为 null，使用空字符串
    const artist = song.artist || ''; // 如果 artist 为 null，使用空字符串
    return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // 生成专辑封面的路径
  const currentSong = songs[currentSongIndex];
  const imagePath = currentSong ? `${process.env.PUBLIC_URL}/musics/${currentSong.src.replace('.mp3', '.jpg')}` : '';

  return (
    <div className="Music-App" style={{
      background: `url(${imagePath}) no-repeat`,
      backgroundSize: 'contain',  // 背景图保持完整显示，不裁剪
      height: '100vh',  // 高度为屏幕的高度
      width: '100%',    // 宽度为屏幕的宽度
    }}>
      <div className="Music-App-Search">
        <h1 className="music-app-title">Baby Chen Music Player</h1>
        <input
          type="text"
          placeholder="Search by title or artist"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>

      <div className="playlist">
        <h2 className="music-app-subtitle">Song List</h2>
        <ul className="song-list">
          {filteredSongs.map((song, index) => (
            <li
              key={index}
              onClick={() => {
                setCurrentSongIndex(index);
                audioRef.current.src = `${process.env.PUBLIC_URL}/musics/${song.src}`;
                audioRef.current.play();
                setIsPlaying(true);
                setIsRotating(true);
              }}
              className={currentSongIndex === index ? 'active' : ''}
            >
              <div className="song-info">
                <span className="title">{song.title || "Unknown Title"}</span>
                <span className="artist">{song.artist || "Unknown Artist"}</span>
              </div>
            </li>
          ))}
        </ul>

      </div>

      <div className="player">
        <div className="play-music">
          <div className="play-music-container">
            <div className="bg" style={{
              background: `url(${imagePath}) no-repeat`,
              backgroundSize: 'cover'
            }}></div>
            <div className="bg-mask"></div>
            <div className="play-music-player">
              <div className={`player-track ${isPlaying ? 'active' : ''}`}>
                <div className="album-name">{currentSong?.title}</div>
                <div className="track-name">{currentSong?.artist}</div>
                <div className="track-time">
                  <div className="current-time">{Math.floor(currentTime / 60)}:{('0' + Math.floor(currentTime % 60)).slice(-2)}</div>
                  <div className="total-time">{Math.floor(duration / 60)}:{('0' + Math.floor(duration % 60)).slice(-2)}</div>
                </div>
                <div className="progress-box" onMouseMove={showHover} onMouseLeave={hideHover} onClick={playFromClickedPos}>
                  <div className="hover-time" style={{ left: hoverWidth, display: hoverWidth ? 'block' : 'none' }}>{hoverTime}</div>
                  <div className="hover-bar" style={{ width: hoverWidth }}></div>
                  <div className="progress-bar" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                </div>
              </div>
              <div className="player-content">
                <div className="album-cover">
                  <img
                    src={imagePath}
                    alt=""
                    className={`active ${isRotating ? 'rotating' : ''}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `${process.env.PUBLIC_URL}/default.jpg`; // 默认图片
                    }}
                  />
                </div>
                <div className="play-controls">
                  <div className="control">
                    <div className="button play-prev" onClick={() => selectTrack(-1)}>
                      <svg className="icon fa fa-step-backward" aria-hidden="true">
                        <use xlinkHref="#icon-arrow-left-filling"></use>
                      </svg>
                    </div>
                  </div>
                  <div className="control">
                    <div className="button play-pause" onClick={togglePlayPause}>
                      {isPlaying ? (
                        <svg className="icon" aria-hidden="true">
                          <use xlinkHref="#icon-zanting"></use>
                        </svg>
                      ) : (
                        <svg className="icon" aria-hidden="true">
                          <use xlinkHref="#icon-playfill"></use>
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="control">
                    <div className="button play-next" onClick={() => selectTrack(1)}>
                      <svg className="icon fa fa-step-forward" aria-hidden="true">
                        <use xlinkHref="#icon-arrow-right-filling"></use>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
