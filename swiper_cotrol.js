(function () {
  refreshEnd = false;
  tSpeed = 300 // 切换速度300ms
  var topBarHeight = $('.head').innerHeight(); // 展开来的头部高度
  var fixedBarHeight = $('.hd').innerHeight(); // 收起的头部高度
  var distance = topBarHeight - fixedBarHeight; // 头部高度差
  var refresh = $('.refresh'); // 下拉刷新
  var refreshPull = $('.refresh-pull'); // 下拉刷新初态
  var pullImg = $('.pull-img') // 下拉刷新初态图片
  var refreshHeight = topBarHeight + $('.refresh').innerHeight(); // 下拉刷新高度
  var mainScroll = $('.swiper-container-ve'); // 主滑动
  // 导航切换
  var swiperNav = new Swiper('.swiper-container-nav', {
    slidesPerView: 2,
    freeMode: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    on: {
      // 初始化需要操作的dom
      init: function () {
        topBar = this.$el.parents('body').find('.head') // 页头
        topBg = this.$el.parents('body').find('.head-bg') // 页头背景
        bar = this.$el.find('.bar') // 导航条
        refreshText = this.$el.parents('body').find('.refresh') // 刷新模块
        bar.transition(tSpeed)
      }
    }
  });
  // 主容器切换
  var swiperMain = new Swiper('.swiper-container', {
    thumbs: {
      swiper: swiperNav
    },
    scrollbar: {
      el: '.bar'
    },
    resistanceRatio: 0
  });
  // 内容切换
  var scrollSwiper = new Swiper('.swiper-container-ve', {
    slidesOffsetBefore: topBarHeight,
    slidesPerView: 'auto',
    freeMode: true,
    direction: 'vertical',
    on: {
      touchMove: function () {
        if (this.translate > fixedBarHeight && this.translate <= topBarHeight) {
          topBar.transform('translateY(' + (this.translate - topBarHeight) + 'px)');
          topBg.transform('translateY(' + (this.translate - topBarHeight * 2) + 'px)')
        }
        if (this.translate < topBarHeight) {
          mainScroll.addClass('bg-grey');
        } else {
          mainScroll.removeClass('bg-grey');
        }
        if (this.translate > topBarHeight && this.translate < refreshHeight) {
          var value = refreshHeight - topBarHeight
          var vLen = (this.translate - topBarHeight) / value
          if (vLen > 1) {
            vLen = 1
          }
          pullImg.css('transform', 'scale(' + vLen + ')')
        }
      },
      touchStart: function () {
        mainScroll.removeClass('bg-grey');
        startPosition = this.translate
        if (this.translate < topBarHeight) {
          mainScroll.addClass('bg-grey');
        } else {
          mainScroll.removeClass('bg-grey');
        }
      },
      touchEnd: function () {
        swiper = this
        if (this.translate > refreshHeight) {
          swiper.setTransition(tSpeed);
          topBar.transition(tSpeed)
          topBg.transition(tSpeed)
          topBar.transform('translateY(0px)');
          topBg.transform('translateY(0px)');
          for (i = 0; i < scrollSwiper.length; i++) {
            scrollSwiper[i].setTransition(tSpeed);
            scrollSwiper[i].setTranslate(topBarHeight)
          }
          swiper.setTranslate(refreshHeight);
          swiper.touchEventsData.isTouched = false;// 跳过touchEnd事件后面的跳转(4.0.5)
          refreshPull.addClass('ds-none')
          refresh.removeClass('ds-none');
          swiper.allowTouchMove = false;
          swiperMain.allowTouchMove = false;
          setTimeout(function () {// 模仿AJAX
            refreshEnd = true;
            swiper.allowTouchMove = true;
            swiperMain.allowTouchMove = true;
            swiper.setTranslate(topBarHeight);
            refresh.addClass('ds-none');
            refreshPull.removeClass('ds-none');
          }, 1000)
        }
      },

      transitionStart: function () {
        topBar.transition(tSpeed)
        topBg.transition(tSpeed)
        if (this.translate < fixedBarHeight) {
          topBar.transform('translateY(-' + distance + 'px)');
          topBg.transform('translateY(-' + topBarHeight + 'px)');
          if (scrollSwiper) {
            for (i = 0; i < scrollSwiper.length; i++) {
              if (scrollSwiper[i].translate > distance) {
                scrollSwiper[i].setTransition(tSpeed);
                scrollSwiper[i].setTranslate(distance)
              }
            }
          }

        } else {
          topBar.transform('translateY(0px)');
          topBg.transform('translateY(0px)');
          if (scrollSwiper) {
            for (i = 0; i < scrollSwiper.length; i++) {
              if (scrollSwiper[i].translate < topBarHeight && scrollSwiper[i].translate > 0) {
                scrollSwiper[i].setTransition(tSpeed);
                scrollSwiper[i].setTranslate(topBarHeight)
              }
            }
          }
        }
      },
    }
  });

  // 内部swiper滑动
  var swiperPart = new Swiper('.swiper-container1', {
    slidesPerView: 'auto',
    freeMode: true,
  });
}(window, document))