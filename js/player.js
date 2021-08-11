//原型这部分看不懂
(function (window) {
    function Player($audio) {
        return new Player.prototype.init($audio);
    }

    Player.prototype = {
        constructor: Player,
        musicList: [],
        init: function ($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        currentIndex: -1,
        playMusic: function (index, music) {
            if (this.currentIndex == index) {
                if (this.audio.paused) {
                    this.audio.play();
                } else {
                    this.audio.pause();
                }
            } else {
                this.$audio.attr("src", music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        //后台删除音乐
        delMusicList: function (index) {
            this.musicList.splice(index, 1);
        }
    };
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window);