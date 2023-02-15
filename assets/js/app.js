const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const playToggle = $(".btn-toggle-play");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const progressContainer = $(".progress-container");
const progressBar = $(".progress-bar");
const progress = $(".progress-bar .progress");
const progessStart = $(".progress-start");
const progessEnd = $(".progress-end");
const btnRepeat = $(".btn-toggle-repeat");
const btnShuffle = $(".btn-shuffle");
const volumeContainer = $(".volume-container")
const volumeBar = $(".volume-bar");
const volume = $(".volume-bar .volume");
const highVolume = $(".volume-area .icon-high");
const offVolume = $(".volume-area .icon-off");
const pendingPlaylist = $(".playlist-pending");
const playlistBtn = $(".btn-playlist");
const body = document.body;


const app = {
    currentIndex: 0,
    selectedRepeat: 0,
    isPlaying: false,
    isMuted: false,
    playerFlow: { repeat: false, repeatOne: false, shuffle: false },
    isHoldingProgress: false,
    isShownPlaylist: false,
    songs: [
        {
            id: 1,
            name: "Never Gonna Give You Up",
            singer: "Rick Astley",
            path: "./assets/music/Never Gonna Give You Up - Rick Astley.mp3",
            img: "./assets/imgs/Never Gonna Give You Up - Rick Astley.png"
        },
        {
            id: 2,
            name: "Best Day Of My Life",
            singer: "American Authors",
            path: "./assets/music/Best Day Of My Life - American Authors.mp3",
            img: "./assets/imgs/Best Day Of My Life - American Authors.png"
        },
        {
            id: 3,
            name: "Carry You Home",
            singer: "Tiesto, Stargate, Aloe Blacc",
            path: "./assets/music/Carry You Home - Tiesto, Stargate, Aloe Blacc.mp3",
            img: "./assets/imgs/Carry You Home - Tiesto, Stargate, Aloe Blacc.png"
        },
        {
            id: 4,
            name: "No Sleep",
            singer: "Martin Garrix, Bonn",
            path: "./assets/music/No Sleep - Martin Garrix, Bonn.mp3",
            img: "./assets/imgs/No Sleep - Martin Garrix, Bonn.png"
        },
        {
            id: 5,
            name: "Payphone",
            singer: "Maroon 5, Wiz Khalifa",
            path: "./assets/music/Payphone - Maroon 5, Wiz Khalifa.mp3",
            img: "./assets/imgs/Payphone - Maroon 5, Wiz Khalifa.png"
        },
        {
            id: 6,
            name: "Sakura",
            singer: "Ikimono Gakari",
            path: "./assets/music/Sakura - Ikimono Gakari.mp3",
            img: "./assets/imgs/Sakura - Ikimono Gakari.png"
        },
        {
            id: 7,
            name: "Stay",
            singer: "The Kid LAROI, Justin Bieber",
            path: "./assets/music/Stay - The Kid LAROI, Justin Bieber.mp3",
            img: "./assets/imgs/Stay - The Kid LAROI, Justin Bieber.png"
        },
        {
            id: 8,
            name: "Symphony",
            singer: "Clean Bandit, Zara Larsson",
            path: "./assets/music/Symphony – Clean Bandit, Zara Larsson.mp3",
            img: "./assets/imgs/Symphony – Clean Bandit, Zara Larsson.png"
        },
        {
            id: 9,
            name: "Talking To The Moon",
            singer: "Bruno Mars",
            path: "./assets/music/Talking To The Moon - Bruno Mars.mp3",
            img: "./assets/imgs/Talking To The Moon - Bruno Mars.png"
        },
        {
            id: 10,
            name: "What Makes You Beautiful",
            singer: "One Direction",
            path: "./assets/music/What Makes You Beautiful – One Direction.mp3",
            img: "./assets/imgs/What Makes You Beautiful – One Direction.png"
        },
    ],
    randomSongs: [],
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get() {
                if (this.playerFlow.shuffle)
                    return this.randomSongs[this.currentIndex];
                else
                    return this.songs[this.currentIndex];
            }
        });
        Object.defineProperty(this, "previousSongElement", {
            get() {
                let prevIndex = this.currentIndex - 1 < 0 ? 0 : this.currentIndex - 1;
                var previousSong;
                if (this.playerFlow.shuffle)
                    previousSong = this.randomSongs[prevIndex];
                else
                    previousSong = this.songs[prevIndex];

                return $(`.playlist-item[id="${previousSong.id}"]`);
            }
        });
    },

    handleEvent() {
        _this = this;
        let minute = 0;
        let second = 0;
        const audio = $("audio");
        const playingThumb = $(".playlist-playing .playlist-item__thumb");
        let playingThumbRotate = playingThumb.animate([
            {
                transform: "rotate(360deg)"
            }], {
            duration: 15000,
            iterations: Infinity
        });
        playingThumbRotate.cancel();

        body.onresize = function () {
            const playlist = $(".playlist");
            if (_this.isShownPlaylist) {
                if (body.clientWidth > 640) {
                    playlist.style.height = "100%";
                    playlist.style.width = `var(--player-height)`;
                } else {
                    const playlistHeight = body.clientHeight * 0.5;
                    playlist.style.width = "100%";
                    playlist.style.height = `${playlistHeight}px`;
                }
            } else {
                if (body.clientWidth > 640) {
                    playlist.style.height = "100%";
                    playlist.style.width = 0;
                } else {
                    playlist.style.width = "100%";
                    playlist.style.height = 0;
                }
            }
        };

        // Xử lý khi click play
        playToggle.addEventListener("click", function () {
            if (!_this.isPlaying) {
                audio.play();
            } else {
                audio.pause();
            }
        });

        // Xử lý khi nhấn bàn phím
        window.addEventListener("keydown", function (event) {
            if (event.code === "Space" || event.key === "MediaPlayPause") {
                if (!_this.isPlaying) {
                    audio.play();
                } else {
                    audio.pause();
                }
            }
            switch (event.key) {
                case "MediaTrackNext":
                    second = 0;
                    minute = 0;
                    _this.loadNextSong();
                    audio.play();
                    break;
                case "MediaTrackPrevious":
                    second = 0;
                    minute = 0;
                    _this.loadPreviousSong();
                    audio.play();
                    break;
            }
        });

        // Xử lý khi play bài hát
        audio.addEventListener("play", function () {
            player.classList.add("playing");
            _this.isPlaying = true;
            playingThumbRotate.play();
        });

        // Xử lý khi pause bài hát
        audio.addEventListener("pause", function () {
            player.classList.remove("playing");
            _this.isPlaying = false;
            playingThumbRotate.pause();
        });

        // Xứ lý khi nhấn nút Next 
        nextBtn.addEventListener("click", function () {
            second = 0;
            minute = 0;
            _this.loadNextSong();
            audio.play();
            playingThumbRotate.cancel();
            playingThumbRotate.play();
        });

        // Xứ lý khi nhấn nút Previous
        prevBtn.addEventListener("click", function () {
            second = 0;
            minute = 0;
            _this.loadPreviousSong();
            audio.play();
            playingThumbRotate.cancel();
            playingThumbRotate.play();
        });

        // Xử lý khi kết thúc bài hát 
        audio.addEventListener("ended", function () {
            second = 0;
            minute = 0;
            if (_this.playerFlow.repeatOne) {
                audio.play();
            } else if (_this.playerFlow.repeat) {
                _this.loadNextSong();
                audio.play();
            } else {
                if (_this.currentIndex < _this.songs.length - 1) {
                    _this.loadNextSong();
                    audio.play();
                } else {
                    audio.currentTime = 0;
                }
            }
            playingThumbRotate.cancel();
        });

        // Xử lý thay đổi tiến độ bài hát
        audio.addEventListener("timeupdate", function () {
            let progressPercent = audio.currentTime / audio.duration * 100;
            progress.style.width = `${progressPercent}%`;

            second = Math.floor(audio.currentTime % 60);
            second = second === NaN ? 0 : second;
            minute = Math.floor(audio.currentTime / 60) === NaN ? 0 : Math.floor(audio.currentTime / 60);
            minute = minute === NaN ? 0 : minute;
            if (second < 10) {
                progessStart.textContent = `${minute}:0${second}`;
            } else {
                progessStart.textContent = `${minute}:${second}`;
            }

        });

        // Xử lý lấy tổng thời gian bài hát
        audio.addEventListener("loadedmetadata", function () {
            let time = audio.duration;
            let endMinute = Math.floor(time / 60);
            let endSecond = Math.floor(time % 60);
            progessEnd.textContent = `${endMinute}:${endSecond}`
        });

        // Xử lý tua bài hát khi nhấn vào Progress Bar
        progressBar.addEventListener("mousedown", function (event) {
            _this.isHoldingProgress = true;
            let progressWidth = event.target.offsetWidth;
            audio.currentTime = (event.offsetX / progressWidth) * audio.duration;
        });

        // Xử lý tua bài hát khi kéo chuột trên Progress Bar
        progressContainer.addEventListener("mousemove", function (event) {
            if (_this.isHoldingProgress) {
                let progressWidth = event.target.offsetWidth;
                audio.currentTime = (event.offsetX / progressWidth) * audio.duration;
            }
        });

        // Xử lý bỏ sự kiện giữ chuột
        window.addEventListener("mouseup", function () {
            _this.isHoldingProgress = false;
        });

        // Xử lý khi nhấn nút Shuffle
        btnShuffle.addEventListener("click", function () {
            _this.playerFlow.shuffle = !_this.playerFlow.shuffle;
            this.classList.toggle("btn-shuffle--active", _this.playerFlow.shuffle);
            if (_this.playerFlow.shuffle) {
                _this.generateRandomSongList();
                _this.currentIndex = 0;
            } else {
                var songId = Number(audio.dataset.songId);
                _this.currentIndex = _this.songs.findIndex(function (song) {
                    return song.id === songId;
                });
            }
            _this.renderPlaylist();
            const pendingSongs = $$(".playlist-pending .playlist-item");
            pendingSongs.forEach(function (song) {
                let songIndex = Number(song.dataset.index);
                if (songIndex <= _this.currentIndex)
                    song.remove();
            });
        });

        // Xử lý khi nhấn nút Repeat
        btnRepeat.addEventListener("click", function () {
            _this.selectedRepeat++;
            switch (_this.selectedRepeat) {
                case 1:
                    _this.playerFlow.repeat = true;
                    this.classList.add("btn-toggle-repeat--active");
                    break;
                case 2:
                    _this.playerFlow.repeat = false;
                    _this.playerFlow.repeatOne = true;
                    this.classList.remove("btn-toggle-repeat--active");
                    this.classList.add("btn-toggle-repeat-1--active");
                    break;
                default:
                    _this.selectedRepeat = 0;
                    _this.playerFlow.repeat = false;
                    _this.playerFlow.repeatOne = false;
                    this.classList.remove("btn-toggle-repeat-1--active");
                    break;
            }
        });

        // Xử lý khi nhấn thay đổi âm lượng 
        volumeBar.addEventListener("mousedown", function (event) {
            _this.isHoldingProgress = true;
            let volumePercent = event.offsetX / event.target.offsetWidth;
            audio.volume = volumePercent;
            volume.style.width = `${volumePercent * 100}%`;
            _this.changeVolumeState(volumePercent);
        });

        // Xử lý khi kéo thay đổi âm lượng 
        volumeContainer.addEventListener("mousemove", function (event) {
            if (_this.isHoldingProgress) {
                let volumePercent = event.offsetX / event.target.offsetWidth;
                audio.volume = volumePercent >= 0 ? volumePercent : 0;
                volume.style.width = `${volumePercent * 100}%`;
                _this.changeVolumeState(volumePercent);
            }
        });

        // Xử lý mở tối đa âm lượng
        highVolume.addEventListener("click", function (event) {
            let volumePercent = 1;
            audio.volume = 1.0;
            _this.changeVolumeState(volumePercent);
        });

        // Xử lý tắt âm lượng
        offVolume.addEventListener("click", function (event) {
            let volumePercent = 0;
            audio.volume = 0;
            _this.changeVolumeState(volumePercent);
        });

        // Xử lý khi hiện playlist
        playlistBtn.addEventListener("click", function () {
            const playlist = $(".playlist");
            const playerThumbnail = $(".player-thumbnail");

            _this.isShownPlaylist = !_this.isShownPlaylist;
            playlist.classList.toggle("playlist--active", _this.isShownPlaylist);
            playerThumbnail.classList.toggle("player-thumbnail--unactive", _this.isShownPlaylist);

            if (document.body.clientWidth > 640) {
                playlist.style.width = _this.isShownPlaylist === true ?
                    `${playerThumbnail.clientHeight}px` : 0;
            } else {
                playlist.style.width = "100%";
                playlist.style.height = _this.isShownPlaylist === true ?
                    `${playerThumbnail.clientHeight}px` : 0;
            }
        });

        // Xử lý khi chọn bài hát trong playlist
        pendingPlaylist.addEventListener("click", function (event) {
            const targetSong = event.target.closest(".playlist-item");
            if (targetSong) {
                const songId = Number(targetSong.getAttribute("id"));
                let indexOfClickedSong = -1;
                if (!_this.playerFlow.shuffle) {
                    indexOfClickedSong = _this.songs.findIndex(song => song.id === songId);
                } else {
                    indexOfClickedSong = _this.randomSongs.findIndex(song => song.id === songId);
                }
                _this.currentIndex = indexOfClickedSong;
                _this.loadCurrentSong();
                audio.play();

                const pendingSongs = $$(".playlist-pending .playlist-item");
                pendingSongs.forEach(function (song) {
                    let songIndex = Number(song.dataset.index);
                    if (songIndex <= _this.currentIndex)
                        song.remove();
                });
            }
        })
    },

    changeVolumeState: function (volumePercent) {
        volume.style.width = `${volumePercent * 100}%`;
    },

    loadCurrentSong: function () {
        const playerImgae = $(".player-thumbnail__img");
        const playerMobileImage = $(".player-thumbnail-mobile__img");
        const songName = $(".song-heading__name");
        const performer = $(".song-heading__performer");
        // Tải bài hát trên player
        playerImgae.style.backgroundImage = `url('${this.currentSong.img}')`;
        playerMobileImage.src = this.currentSong.img;
        songName.textContent = this.currentSong.name;
        performer.textContent = this.currentSong.singer;
        progress.style.width = 0;
        progessStart.textContent = "0:00";
        const audio = $("audio");
        if (!audio) {
            let newAudio = document.createElement("audio");
            newAudio.src = `${this.currentSong.path}`;
            newAudio.id = "audio";
            newAudio.volume = 0.6;
            newAudio.setAttribute("data-song-id", this.currentSong.id);
            player.appendChild(newAudio);
            this.changeVolumeState(newAudio.volume);
        }
        else {
            audio.src = `${this.currentSong.path}`;
            audio.setAttribute("data-song-id", this.currentSong.id);
            this.changeVolumeState(audio.volume);
        }
        // Tải bài hát trên playlist
        const playingSong = $(".playlist-playing .playlist-item");
        const playingSongImage = $(".playlist-playing .playlist-thumbnail__img");
        const playingSongName = $(".playlist-playing .playlist-item__song-name");
        const playingPerformer = $(".playlist-playing .playlist-item__performer");

        playingSong.id = this.currentSong.id;
        playingSong.dataset.index = this.currentIndex;
        playingSongImage.style.backgroundImage = `url('${this.currentSong.img}')`;
        playingSongName.textContent = this.currentSong.name;
        playingPerformer.textContent = this.currentSong.singer;
    },

    renderPlaylist: function () {
        _this = this;
        var playlistHTML;
        if (!this.playerFlow.shuffle) {
            playlistHTML = this.songs.map(function (song, index) {
                if (song.id !== _this.currentSong.id)
                    return `
                <div class="playlist-item"
                        id="${song.id}" data-index="${index}">
                    <div class="playlist-item__thumb">
                        <div class="playlist-thumbnail__img"
                                style="background-image: url('${song.img}')">
                        </div>
                    </div>
                    <div class="playlist-item__info">
                        <h2 class="playlist-item__song-name">${song.name}</h2>
                        <p class="playlist-item__performer">${song.singer}</p>
                    </div>
                </div>`;
            });
        }
        else {
            playlistHTML = this.randomSongs.map(function (song, index) {
                if (song.id !== _this.currentSong.id)
                    return `
                <div class="playlist-item ${_this.currentIndex === index ? 'playing' : ''}"
                        id="${song.id}" data-index="${index}">
                    <div class="playlist-item__thumb">
                        <div class="playlist-thumbnail__img"
                                style="background-image: url('${song.img}')">
                        </div>
                    </div>
                    <div class="playlist-item__info">
                        <h2 class="playlist-item__song-name">${song.name}</h2>
                        <p class="playlist-item__performer">${song.singer}</p>
                    </div>
                </div>`;
            });
        }
        pendingPlaylist.innerHTML = playlistHTML.join("");
    },

    generateRandomSongList: function () {
        this.randomSongs = [this.songs[this.currentIndex]];
        let songTotal = this.songs.length;
        while (this.randomSongs.length < songTotal) {
            var randomIndex = Math.round(Math.random() * (songTotal - 1));
            var randomSong = this.songs[randomIndex];

            var isExistingSong = this.randomSongs.some(function (song) {
                return song.id === randomSong.id;
            });

            if (!isExistingSong) {
                this.randomSongs.push(randomSong);
            }
        }
    },

    loadNextSong: function () {
        _this = this;
        let numberOfSongs = this.songs.length;
        this.currentIndex += 1;
        if (this.currentIndex >= numberOfSongs)
            this.currentIndex = 0;


        const pendingSongs = $$(".playlist-pending .playlist-item");
        pendingSongs.forEach(function (song) {
            let songId = Number(song.id);
            if (songId === _this.currentSong.id)
                song.remove();
        });
        this.loadCurrentSong();
        if (this.currentIndex === 0)
            this.renderPlaylist();
    },

    loadPreviousSong: function () {
        const currentSongElement = $(".playlist-playing .playlist-item");
        const firstSongInPlaylist = $(".playlist-pending .playlist-item:first-child");
        let numberOfSongs = this.songs.length;
        this.currentIndex -= 1;
        if (this.currentIndex < 0)
            this.currentIndex = numberOfSongs - 1;

        const currentSongElementClone = currentSongElement.cloneNode(true);
        if (firstSongInPlaylist) {
            pendingPlaylist.insertBefore(currentSongElementClone, firstSongInPlaylist)
        } else {
            pendingPlaylist.appendChild(currentSongElementClone);
        }

        if (this.currentIndex === numberOfSongs - 1)
            this.clearPendingPlaylist();

        this.loadCurrentSong();
    },

    clearPendingPlaylist: function () {
        pendingPlaylist.innerHTML = "";
    },

    start: function () {
        // Định nghĩa các Property
        this.defineProperties();

        // Tải bài hát hiện tại
        this.loadCurrentSong();

        // Tải danh sách bài hát
        this.renderPlaylist();

        // Xử lý các sự kiện 
        this.handleEvent();
    },
}

app.start();