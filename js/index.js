$(function () {
    //入口函数
    //初始化自定义滚动条
    $(".music_list").mCustomScrollbar();
    //
    var $audio = $("audio");
    var player = new Player($audio);
    //1.初始化曲库
    getPlayerList();

    function getPlayerList() {
        $.ajax({
            //路径不一样
            url: "./source/musiclist.json",
            dataType: "json",
            success: function (data) {
                player.musicList = data;
                var $musicList = $(".music_list .appends");
                //ecch的参数：数组，函数():参数一：索引，参数二：遍历到的元素
                $.each(data, function (index, ele) {
                    var $item = crateMusicItem(index, ele);

                    $musicList.append($item);
                });
                //初始化第一条歌曲，角标0开始
                initMusicInfo(data[0]);
            },
            error: function (e) {
                console.log(e);
            }
        });
    }

    //2.初始化歌曲信息
    function initMusicInfo(music) {//music参数什么意思
        //获取对面的元素对象
        var $musicImage = $(".music_photo_top img");
        var $musicName = $(".music_name a");
        var $singerName = $(".singer_Name a");
        var $album = $(".album—Name a");
        var $left = $(".space_top .space_top_left");
        var $right = $(".space_top .space_top_right");
        var $background = $(".background");
        //给对应的信息初始化
        $musicImage.attr("src", music.cover);
        $musicName.text(music.name);
        $singerName.text(music.singer);
        $album.text(music.album);
        $left.text(music.name + " / " + music.singer);
        $right.text("00:00" + " / " + music.time);
        $background.css("background", "url('" + music.cover + "')");
    }

    //3.初始化事件监听
    initEvents();

    function initEvents() {
        /*
    因为该js在index.css的后面，所以只对js中append的元素生效
     */
        //使用事件委托处理鼠标移入后产生的变化
        $(".music_list").delegate(".appends .music_list_select", "mouseenter", function () {
            //显示每条音乐隐藏的操作框
            $(this).find(".music_list_select_musicName—menu").fadeIn(100);
            //隐藏歌曲时间
            $(this).find(".music_list_select_musicTime>span").fadeOut(100);
            $(this).find(".music_list_select_musicTime>a").fadeIn(100);
        });
        $(".music_list").delegate(".appends .music_list_select", "mouseleave", function () {
            //取消每条音乐隐藏的操作框的显示
            $(this).find(".music_list_select_musicName—menu").fadeOut(100);
            $(this).find(".music_list_select_musicTime>span").fadeIn(100);
            $(this).find(".music_list_select_musicTime>a").fadeOut(100);
        });
        //监听点击播放之后的图标识转换
        //有点难理解
        //定义一个变量接收播放和暂停的元素对象

        $(".music_list").delegate(".player1", "click", function () {
                //此$item是下面player方法的$item，用于获取原生的对象的序列号和歌曲名字
                var $item = $(this).parents(".music_list_select");
                $(this).toggleClass("player");
                //切换播放时当前点击的暂停图片切换为播放,而且刚刚显示为播放的图标切换为暂停
                $(this).parents(".music_list_select").siblings().find(".player1").removeClass("player");
                //底部的播放按钮同步实现播放暂停
                //player1暂停  player:播放
                //attr().index()!=-1的方法实现不了
                var $musicPlay = $(".music_play");
                if ($(this).hasClass("player")) {
                    $musicPlay.addClass("music_pause");
                } else {
                    $musicPlay.removeClass("music_pause");
                }
                // 点击歌曲之后歌曲序号消失，播放小图标出现
                //点击播放之后，出现播放小图片
                $(this).parents(".music_list_select").find(".music_list_select_number").toggleClass("music_list_select_number2");
                $(this).parents(".music_list_select").siblings().find(".music_list_select_number").removeClass("music_list_select_number2");
                //播放音乐
                player.playMusic($item.get(0).index, $item.get(0).music);
                //切换音乐时切换背景图片
                initMusicInfo($item.get(0).music);
            }
        );
    }

    //底部按钮播放音乐操作
    //上一首
    $(".music_pre").click(function () {
        if (player.currentIndex == -1) {
            $(".music_list_select").eq(1).find(".player1").trigger("click");
        } else if (player.currentIndex < 1) {
            player.currentIndex = $(".music_list_select").eq();
        }
        $(".music_list_select").eq(player.currentIndex).find(".player1").trigger("click");
    });
    //播放
    $(".music_play").click(function () {
        if (player.currentIndex == -1) {
            //歌曲条目从1开始
            $(".music_list_select").eq(1).find(".player1").trigger("click");
        } else {
            $(".music_list_select").eq(player.currentIndex + 1).find(".player1").trigger("click");
        }
    });
    //下一首
    $(".music_next").click(function () {
        $(".music_list_select").eq(player.currentIndex + 2).find(".player1").trigger("click");
    });
    // 删除音乐
    $(".music_list").delegate(".music_del", "click", function () {
        $(this).parents(".music_list_select").remove();
        player.delMusicList($(this).parents(".music_list_select").get(0).index);
        /*
        该功能没有实现
         */
        //删除之后重新排序序号
        $(".music_list_select").each(function (index, value) {
            if (index >= 1) {
                value.index = index;
                value.find(".music_list_select_number").text(index + 1);
            }

        });
    });


    //创建一条歌曲列表的方法
    function crateMusicItem(index, music) {
        var $item = $("<div class=\"music_list_select\">\n" +
            "                    <ul class=\"music_list_select_ul\">\n" +
            "                        <!--i是选择框的操作-->\n" +
            "                        <li class=\"music_list_select_check\"><span><i></i></span></li>\n" +
            "                        <!--歌曲序号-->\n" +
            "                        <li class=\"music_list_select_number\">" + (index + 1) + "</li>\n" +
            "                        <li class=\"music_list_select_musicName\">\n" +
            "                            <div class=\"music_list_select_musicName—menu\">\n" +
            "                                <a href=\"javaScript:;\" title=\"播放\" class='player1' </a>\n" +
            "                                <a href=\"javaScript:;\" title=\"添加\"></a>\n" +
            "                                <a href=\"javaScript:;\" title=\"下载\"></a>\n" +
            "                                <a href=\"javaScript:;\" title=\"分享\"></a>\n" +
            "                            </div>" + music.name + "</li>\n" +
            "                        <li class=\"music_list_select_singer\">" + music.singer + "</li>\n" +
            "                        <li class=\"music_list_select_musicTime\">\n" +
            "                            <span>" + music.time + "</span>\n" +
            "                            <a href=\"javaScript:;\" title=\"删除\" class='music_del'></a>\n" +
            "                        </li>\n" +
            "                    </ul>\n" +
            "                </div>");
        $item.get(0).index = index;
        $item.get(0).music = music;
        return $item;
    }
})
;