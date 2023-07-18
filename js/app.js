const CONFIG = {"version":"0.2.10","hostname":"https://test19124.github.io","root":"/","statics":"/","favicon":{"normal":"assets/favicon.ico","hidden":"assets/failure.ico"},"darkmode":true,"auto_dark":{"enable":true,"start":20,"end":6},"auto_scroll":false,"js":{"chart":"npm/frappe-charts@1.5.0/dist/frappe-charts.min.iife.min.js","copy_tex":"npm/katex@0.12.0/dist/contrib/copy-tex.min.js","fancybox":"combine/npm/jquery@3.5.1/dist/jquery.min.js,npm/@fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js,npm/justifiedGallery@3.8.1/dist/js/jquery.justifiedGallery.min.js"},"css":{"valine":"css/comment.css","katex":"npm/katex@0.12.0/dist/katex.min.css","mermaid":"css/mermaid.css","fancybox":"combine/npm/@fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css,npm/justifiedGallery@3.8.1/dist/css/justifiedGallery.min.css"},"loader":{"start":true,"switch":true},"search":null,"outime":{"enable":false,"days":90},"quicklink":{"timeout":3000,"priority":true},"playerAPI":"https://api.injahow.cn","disableVL":false,"fireworks":["rgba(255,182,185,.9)","rgba(250,227,217,.9)","rgba(187,222,214,.9)","rgba(138,198,209,.9)"]};const getDocHeight = () => $dom('main > .inner').offsetHeight;
const $dom = (selector, element = document) => {
    if (selector[0] === '#') {
        return element.getElementById(selector.substring(1));
    }
    return element.querySelector(selector);
};
$dom.all = (selector, element = document) => {
    return element.querySelectorAll(selector);
};
$dom.each = (selector, callback, element) => {
    $dom.all(selector, element).forEach(callback);
};
$dom.asyncify = async (selector, element = document) => {
    if (selector[0] === '#') {
        return element.getElementById(selector.substring(1));
    }
    return element.querySelector(selector);
};
$dom.asyncifyEach = (selector, callback, element) => {
    $dom.all(selector, element).forEach(callback);
};
Object.assign(HTMLElement.prototype, {
    createChild(tag, obj, positon) {
        const child = document.createElement(tag);
        Object.assign(child, obj);
        switch (positon) {
            case 'after':
                this.insertAfter(child);
                break;
            case 'replace':
                this.innerHTML = '';
                this.appendChild(child);
                break;
            default:
                this.appendChild(child);
        }
        return child;
    },
    wrapObject(obj) {
        const box = document.createElement('div');
        Object.assign(box, obj);
        this.parentNode.insertBefore(box, this);
        this.parentNode.removeChild(this);
        box.appendChild(this);
    },
    changeOrGetHeight(h) {
        if (h) {
            this.style.height = typeof h === 'number' ? h + 'rem' : h;
        }
        return this.getBoundingClientRect().height;
    },
    changeOrGetWidth(w) {
        if (w) {
            this.style.width = typeof w === 'number' ? w + 'rem' : w;
        }
        return this.getBoundingClientRect().width;
    },
    getTop() {
        return this.getBoundingClientRect().top;
    },
    left() {
        return this.getBoundingClientRect().left;
    },
    attr(type, value) {
        if (value === null) {
            return this.removeAttribute(type);
        }
        if (value) {
            this.setAttribute(type, value);
            return this;
        }
        else {
            return this.getAttribute(type);
        }
    },
    insertAfter(element) {
        const parent = this.parentNode;
        if (parent.lastChild === this) {
            parent.appendChild(element);
        }
        else {
            parent.insertBefore(element, this.nextSibling);
        }
    },
    display(d) {
        if (d == null) {
            return this.style.display;
        }
        else {
            this.style.display = d;
            return this;
        }
    },
    child(selector) {
        return $dom(selector, this);
    },
    find(selector) {
        return $dom.all(selector, this);
    },
    _class(type, className, display) {
        const classNames = className.indexOf(' ') ? className.split(' ') : [className];
        classNames.forEach((name) => {
            if (type === 'toggle') {
                this.classList.toggle(name, display);
            }
            else {
                this.classList[type](name);
            }
        });
    },
    addClass(className) {
        this._class('add', className);
        return this;
    },
    removeClass(className) {
        this._class('remove', className);
        return this;
    },
    toggleClass(className, display) {
        this._class('toggle', className, display);
        return this;
    },
    hasClass(className) {
        return this.classList.contains(className);
    }
});
const $storage = {
    set(key, value) {
        localStorage.setItem(key, value);
    },
    get(key) {
        return localStorage.getItem(key);
    },
    del(key) {
        localStorage.removeItem(key);
    }
};
const getScript = (url, callback, condition) => {
    if (condition) {
        callback();
    }
    else {
        let script = document.createElement('script');
        script.onload = function (_, isAbort) {
            if (isAbort || !script.readyState) {
                console.log('abort!');
                script.onload = null;
                script = undefined;
                if (!isAbort && callback)
                    setTimeout(callback, 0);
            }
        };
        script.src = url;
        document.head.appendChild(script);
    }
};
const assetUrl = (asset, type) => {
    const str = CONFIG[asset][type];
    if (str.includes('gh') || str.includes('combine')) {
        return `https://cdn.jsdelivr.net/${str}`;
    }
    if (str.includes('npm')) {
        return `https://cdn.jsdelivr.net/${str}`;
    }
    if (str.includes('http')) {
        return str;
    }
    return `/${str}`;
};
const vendorJs = (type, callback, condition) => {
    if (LOCAL[type]) {
        getScript(assetUrl('js', type), callback || function () {
            window[type] = true;
        }, condition || window[type]);
    }
};
const vendorCss = (type, condition) => {
    if (window['css' + type]) {
        return;
    }
    if (LOCAL[type]) {
        document.head.createChild('link', {
            rel: 'stylesheet',
            href: assetUrl('css', type)
        });
        window['css' + type] = true;
    }
};
const transition = (target, type, complete, begin) => {
    let animation;
    let display = 'none';
    switch (type) {
        case 0:
            animation = { opacity: [1, 0] };
            break;
        case 1:
            animation = { opacity: [0, 1] };
            display = 'block';
            break;
        case 'bounceUpIn':
            animation = {
                begin(anim) {
                    target.display('block');
                },
                translateY: [
                    { value: -60, duration: 200 },
                    { value: 10, duration: 200 },
                    { value: -5, duration: 200 },
                    { value: 0, duration: 200 }
                ],
                opacity: [0, 1]
            };
            display = 'block';
            break;
        case 'shrinkIn':
            animation = {
                begin(anim) {
                    target.display('block');
                },
                scale: [
                    { value: 1.1, duration: 300 },
                    { value: 1, duration: 200 }
                ],
                opacity: 1
            };
            display = 'block';
            break;
        case 'slideRightIn':
            animation = {
                begin(anim) {
                    target.display('block');
                },
                translateX: ['100%', '0%'],
                opacity: [0, 1]
            };
            display = 'block';
            break;
        case 'slideRightOut':
            animation = {
                translateX: ['0%', '100%'],
                opacity: [1, 0]
            };
            break;
        default:
            animation = type;
            display = type.display;
            break;
    }
    anime(Object.assign({
        targets: target,
        duration: 200,
        easing: 'linear',
        begin() {
            begin && begin();
        },
        complete() {
            target.display(display);
            complete && complete();
        }
    }, animation)).play();
};
const pjaxScript = (element) => {
    const { text, parentNode, id, className, type, src, dataset } = element;
    const code = text || element.textContent || element.innerHTML || '';
    parentNode.removeChild(element);
    const script = document.createElement('script');
    if (id) {
        script.id = id;
    }
    if (className) {
        script.className = className;
    }
    if (type) {
        script.type = type;
    }
    if (src) {
        script.src = src;
        script.async = false;
    }
    if (dataset.pjax !== undefined) {
        script.dataset.pjax = '';
    }
    if (code !== '') {
        script.appendChild(document.createTextNode(code));
    }
    parentNode.appendChild(script);
};
const pageScroll = (target, offset, complete) => {
    const opt = {
        targets: typeof offset === 'number' ? target.parentNode : document.scrollingElement,
        duration: 500,
        easing: 'easeInOutQuad',
        scrollTop: offset || (typeof target === 'number' ? target : (target ? target.getTop() + document.documentElement.scrollTop - siteNavHeight : 0)),
        complete() {
            complete && complete();
        }
    };
    anime(opt).play();
};
let inCloudFlare = true;
window.addEventListener('DOMContentLoaded', function () {
    inCloudFlare = false;
});
if (document.readyState === 'loading') {
    window.addEventListener('load', function () {
        if (inCloudFlare) {
            window.dispatchEvent(new Event('DOMContentLoaded'));
            console.log('%c ☁️cloudflare patch ' + '%c running(rocket & minify)', 'color: white; background: #ff8c00; padding: 5px 3px;', 'padding: 4px;border:1px solid #ff8c00');
        }
    });
}
const statics = CONFIG.statics.indexOf('//') > 0 ? CONFIG.statics : CONFIG.root;
const scrollAction = { x: 0, y: 0 };
let diffY = 0;
let originTitle, titleTime;
const BODY = document.getElementsByTagName('body')[0];
const HTML = document.documentElement;
const Container = $dom('#container');
const loadCat = $dom('#loading');
const siteNav = $dom('#nav');
const siteHeader = $dom('#header');
const menuToggle = siteNav.child('.toggle');
const quickBtn = $dom('#quick');
const sideBar = $dom('#sidebar');
const siteBrand = $dom('#brand');
let toolBtn = $dom('#tool');
let toolPlayer;
let backToTop;
let goToComment;
let showContents;
let siteSearch = $dom('#search');
let siteNavHeight, headerHightInner, headerHight;
let oWinHeight = window.innerHeight;
let oWinWidth = window.innerWidth;
let LOCAL_HASH = 0;
let LOCAL_URL = window.location.href;
let pjax;
const changeTheme = (type) => {
    const btn = $dom('.theme .ic');
    if (type === 'dark') {
        HTML.attr('data-theme', type);
        btn.removeClass('i-sun');
        btn.addClass('i-moon');
    }
    else {
        HTML.attr('data-theme', null);
        btn.removeClass('i-moon');
        btn.addClass('i-sun');
    }
};
const autoDarkmode = () => {
    if (CONFIG.auto_dark.enable) {
        if (new Date().getHours() >= CONFIG.auto_dark.start || new Date().getHours() <= CONFIG.auto_dark.end) {
            changeTheme('dark');
        }
        else {
            changeTheme();
        }
    }
};
const lazyload = lozad('img, [data-background-image]', {
    loaded(el) {
        el.addClass('lozaded');
    }
});
const Loader = {
    timer: undefined,
    lock: false,
    show() {
        clearTimeout(this.timer);
        document.body.removeClass('loaded');
        loadCat.attr('style', 'display:block');
        Loader.lock = false;
    },
    hide(sec) {
        if (!CONFIG.loader.start) {
            sec = -1;
        }
        this.timer = setTimeout(this.vanish, sec || 3000);
    },
    vanish() {
        if (Loader.lock) {
            return;
        }
        if (CONFIG.loader.start) {
            transition(loadCat, 0);
        }
        document.body.addClass('loaded');
        Loader.lock = true;
    }
};
const changeMetaTheme = (color) => {
    if (HTML.attr('data-theme') === 'dark') {
        color = '#222';
    }
    $dom('meta[name="theme-color"]').attr('content', color);
};
const themeColorListener = () => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (mediaQueryList) => {
        if (mediaQueryList.matches) {
            changeTheme('dark');
        }
        else {
            changeTheme();
        }
    });
    const t = $storage.get('theme');
    if (t) {
        changeTheme(t);
    }
    else {
        if (CONFIG.darkmode) {
            changeTheme('dark');
        }
    }
};
const visibilityListener = () => {
    const iconNode = $dom('[rel="icon"]');
    document.addEventListener('visibilitychange', () => {
        switch (document.visibilityState) {
            case 'hidden':
                iconNode.attr('href', statics + CONFIG.favicon.hidden);
                document.title = LOCAL.favicon.hide;
                if (CONFIG.loader.switch) {
                    Loader.show();
                }
                clearTimeout(titleTime);
                break;
            case 'visible':
                iconNode.attr('href', statics + CONFIG.favicon.normal);
                document.title = LOCAL.favicon.show;
                if (CONFIG.loader.switch) {
                    Loader.hide(1000);
                }
                titleTime = setTimeout(() => {
                    document.title = originTitle;
                }, 2000);
                break;
        }
    });
};
const showtip = (msg) => {
    if (!msg) {
        return;
    }
    const tipbox = BODY.createChild('div', {
        innerHTML: msg,
        className: 'tip'
    });
    setTimeout(() => {
        tipbox.addClass('hide');
        setTimeout(() => {
            BODY.removeChild(tipbox);
        }, 300);
    }, 3000);
};
const resizeHandle = (event) => {
    siteNavHeight = siteNav.changeOrGetHeight();
    headerHightInner = siteHeader.changeOrGetHeight();
    headerHight = headerHightInner + $dom('#waves').changeOrGetHeight();
    if (oWinWidth !== window.innerWidth) {
        sideBarToggleHandle(null, 1);
    }
    oWinHeight = window.innerHeight;
    oWinWidth = window.innerWidth;
};
const scrollHandle = (event) => {
    const winHeight = window.innerHeight;
    const docHeight = getDocHeight();
    const contentVisibilityHeight = docHeight > winHeight ? docHeight - winHeight : document.body.scrollHeight - winHeight;
    const SHOW = window.scrollY > headerHightInner;
    const startScroll = window.scrollY > 0;
    if (SHOW) {
        changeMetaTheme('#FFF');
    }
    else {
        changeMetaTheme('#222');
    }
    siteNav.toggleClass('show', SHOW);
    toolBtn.toggleClass('affix', startScroll);
    siteBrand.toggleClass('affix', startScroll);
    sideBar.toggleClass('affix', window.scrollY > headerHight && document.body.offsetWidth > 991);
    if (typeof scrollAction.y === 'undefined') {
        scrollAction.y = window.scrollY;
    }
    diffY = scrollAction.y - window.scrollY;
    if (diffY < 0) {
        siteNav.removeClass('up');
        siteNav.toggleClass('down', SHOW);
    }
    else if (diffY > 0) {
        siteNav.removeClass('down');
        siteNav.toggleClass('up', SHOW);
    }
    else { }
    scrollAction.y = window.scrollY;
    const scrollPercent = Math.round(Math.min(100 * window.scrollY / contentVisibilityHeight, 100)) + '%';
    if (backToTop.child('span').innerText !== scrollPercent) {
        backToTop.child('span').innerText = scrollPercent;
    }
    if ($dom('#sidebar').hasClass('affix') || $dom('#sidebar').hasClass('on')) {
        $dom('.percent').changeOrGetWidth(scrollPercent);
    }
};
const pagePosition = () => {
    if (CONFIG.auto_scroll) {
        $storage.set(LOCAL_URL, String(scrollAction.y));
    }
};
const positionInit = (comment) => {
    const anchor = window.location.hash;
    let target = null;
    if (LOCAL_HASH) {
        $storage.del(LOCAL_URL);
        return;
    }
    if (anchor) {
        target = $dom(decodeURI(anchor));
    }
    else {
        target = CONFIG.auto_scroll ? parseInt($storage.get(LOCAL_URL)) : 0;
    }
    if (target) {
        pageScroll(target);
        LOCAL_HASH = 1;
    }
    if (comment && anchor && !LOCAL_HASH) {
        pageScroll(target);
        LOCAL_HASH = 1;
    }
};
const clipBoard = (str, callback) => {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(str).then(() => {
            callback && callback(true);
        }, () => {
            callback && callback(false);
        });
    }
    else {
        const ta = BODY.createChild('textarea', {
            style: {
                top: window.scrollY + 'px',
                position: 'absolute',
                opacity: '0'
            },
            readOnly: true,
            value: str
        });
        const selection = document.getSelection();
        const selected = selection.rangeCount > 0 ? selection.getRangeAt(0) : false;
        ta.select();
        ta.setSelectionRange(0, str.length);
        ta.readOnly = false;
        const result = document.execCommand('copy');
        callback && callback(result);
        ta.blur();
        if (selected) {
            selection.removeAllRanges();
            selection.addRange(selected);
        }
        BODY.removeChild(ta);
    }
};
const isOutime = () => {
    let updateTime;
    if (CONFIG.outime.enable && LOCAL.outime) {
        const times = document.getElementsByTagName('time');
        if (times.length === 0) {
            return;
        }
        const posts = document.getElementsByClassName('body md');
        if (posts.length === 0) {
            return;
        }
        const now = Date.now();
        const pubTime = new Date(times[0].dateTime);
        if (times.length === 1) {
            updateTime = pubTime;
        }
        else {
            updateTime = new Date(times[1].dateTime);
        }
        const interval = parseInt(String(now - updateTime));
        const days = parseInt(String(CONFIG.outime.days)) || 30;
        if (interval > (days * 86400000)) {
            const publish = parseInt(String((now - pubTime) / 86400000));
            const updated = parseInt(String(interval / 86400000));
            const template = LOCAL.template.replace('{{publish}}', String(publish)).replace('{{updated}}', String(updated));
            posts[0].insertAdjacentHTML('afterbegin', template);
        }
    }
};
const clickMenu = () => {
    const menuElement = $dom('#clickMenu');
    window.oncontextmenu = function (event) {
        if (event.ctrlKey) {
            return;
        }
        event.preventDefault();
        let x = event.offsetX;
        let y = event.offsetY;
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;
        const menuWidth = menuElement.offsetWidth;
        const menuHeight = menuElement.offsetHeight;
        x = winWidth - menuWidth >= x ? x : winWidth - menuWidth;
        y = winHeight - menuHeight >= y ? y : winHeight - menuHeight;
        menuElement.style.top = y + 'px';
        menuElement.style.left = x + 'px';
        menuElement.classList.add('active');
        $dom.each('.clickSubmenu', (submenu) => {
            if (x > (winWidth - menuWidth - submenu.offsetWidth)) {
                submenu.style.left = '-200px';
            }
            else {
                submenu.style.left = '';
                submenu.style.right = '-200px';
            }
        });
    };
    window.addEventListener('click', () => {
        menuElement.classList.remove('active');
    });
};
const cardActive = () => {
    if (!$dom('.index.wrap')) {
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach((article) => {
            if (article.target.hasClass('show')) {
                io.unobserve(article.target);
            }
            else {
                if (article.isIntersecting || article.intersectionRatio > 0) {
                    article.target.addClass('show');
                    io.unobserve(article.target);
                }
            }
        });
    }, {
        root: null,
        threshold: [0.3]
    });
    $dom.each('.index.wrap article.item, .index.wrap section.item', (article) => {
        io.observe(article);
    });
    $dom('.index.wrap .item:first-child').addClass('show');
    $dom.each('.cards .item', (element) => {
        ['mouseenter', 'touchstart'].forEach((item) => {
            element.addEventListener(item, () => {
                if ($dom('.cards .item.active')) {
                    $dom('.cards .item.active').removeClass('active');
                }
                element.addClass('active');
            }, { passive: true });
        });
        ['mouseleave'].forEach((item) => {
            element.addEventListener(item, () => {
                element.removeClass('active');
            }, { passive: true });
        });
    });
};
const registerExtURL = () => {
    $dom.each('span.exturl', (element) => {
        const link = document.createElement('a');
        link.href = decodeURIComponent(window.atob(element.dataset.url).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        link.rel = 'noopener external nofollow noreferrer';
        link.target = '_blank';
        link.className = element.className;
        link.title = element.title || element.innerText;
        link.innerHTML = element.innerHTML;
        if (element.dataset.backgroundImage) {
            link.dataset.backgroundImage = element.dataset.backgroundImage;
        }
        element.parentNode.replaceChild(link, element);
    });
};
const postFancybox = (p) => {
    if ($dom(p + ' .md img')) {
        vendorCss('fancybox');
        vendorJs('fancybox', () => {
            const q = jQuery.noConflict();
            $dom.each(p + ' p.gallery', (element) => {
                const box = document.createElement('div');
                box.className = 'gallery';
                box.attr('data-height', String(element.attr('data-height') || 220));
                box.innerHTML = element.innerHTML.replace(/<br>/g, '');
                element.parentNode.insertBefore(box, element);
                element.remove();
            });
            $dom.each(p + ' .md img:not(.emoji):not(.vemoji)', (element) => {
                const $image = q(element);
                const imageLink = $image.attr('data-src') || $image.attr('src');
                const $imageWrapLink = $image.wrap('<a class="fancybox" href="' + imageLink + '" itemscope itemtype="https://schema.org/ImageObject" itemprop="url"></a>').parent('a');
                let info;
                let captionClass = 'image-info';
                if (!$image.is('a img')) {
                    $image.data('safe-src', imageLink);
                    if (!$image.is('.gallery img')) {
                        $imageWrapLink.attr('data-fancybox', 'default').attr('rel', 'default');
                    }
                    else {
                        captionClass = 'jg-caption';
                    }
                }
                if ((info = element.attr('title'))) {
                    $imageWrapLink.attr('data-caption', info);
                    const para = document.createElement('span');
                    const txt = document.createTextNode(info);
                    para.appendChild(txt);
                    para.addClass(captionClass);
                    element.insertAfter(para);
                }
            });
            $dom.each(p + ' div.gallery', (el, i) => {
                q(el).justifiedGallery({
                    rowHeight: q(el).data('height') || 120,
                    rel: 'gallery-' + i
                }).on('jg.complete', function () {
                    q(this).find('a').each((k, ele) => {
                        ele.attr('data-fancybox', 'gallery-' + i);
                    });
                });
            });
            q.fancybox.defaults.hash = false;
            q(p + ' .fancybox').fancybox({
                loop: true,
                helpers: {
                    overlay: {
                        locked: false
                    }
                }
            });
        }, window.jQuery);
    }
};
const postBeauty = () => {
    loadComments();
    if (!$dom('.md')) {
        return;
    }
    postFancybox('.post.block');
    $dom('.post.block').oncopy = async (event) => {
        showtip(LOCAL.copyright);
        if (LOCAL.nocopy) {
            event.preventDefault();
            return;
        }
        const copyright = await $dom.asyncify('#copyright');
        if (window.getSelection().toString().length > 30 && copyright) {
            event.preventDefault();
            const author = '# ' + copyright.child('.author').innerText;
            const link = '# ' + copyright.child('.link').innerText;
            const license = '# ' + copyright.child('.license').innerText;
            const htmlData = author + '<br>' + link + '<br>' + license + '<br><br>' + window.getSelection().toString().replace(/\r\n/g, '<br>');
            const textData = author + '\n' + link + '\n' + license + '\n\n' + window.getSelection().toString().replace(/\r\n/g, '\n');
            if (event.clipboardData) {
                event.clipboardData.setData('text/html', htmlData);
                event.clipboardData.setData('text/plain', textData);
            }
            else {
                if (window.clipboardData) {
                    return window.clipboardData.setData('text', textData);
                }
            }
        }
    };
    $dom.each('li ruby', (element) => {
        let parent = element.parentNode;
        if (element.parentNode.tagName !== 'LI') {
            parent = element.parentNode.parentNode;
        }
        parent.addClass('ruby');
    });
    $dom.each('ol[start]', (element) => {
        element.style.counterReset = 'counter ' + parseInt(element.attr('start') - 1);
    });
    $dom.each('.md table', (element) => {
        element.wrapObject({
            className: 'table-container'
        });
    });
    $dom.each('.highlight > .table-container', (element) => {
        element.className = 'code-container';
    });
    $dom.each('figure.highlight', (element) => {
        const code_container = element.child('.code-container');
        const caption = element.child('figcaption');
        element.insertAdjacentHTML('beforeend', '<div class="operation"><span class="breakline-btn"><i class="ic i-align-left"></i></span><span class="copy-btn"><i class="ic i-clipboard"></i></span><span class="fullscreen-btn"><i class="ic i-expand"></i></span></div>');
        const copyBtn = element.child('.copy-btn');
        if (LOCAL.nocopy) {
            copyBtn.remove();
        }
        else {
            copyBtn.addEventListener('click', (event) => {
                const target = event.currentTarget;
                let comma = '';
                let code = '';
                code_container.find('pre').forEach((line) => {
                    code += comma + line.innerText;
                    comma = '\n';
                });
                clipBoard(code, (result) => {
                    target.child('.ic').className = result ? 'ic i-check' : 'ic i-times';
                    target.blur();
                    showtip(LOCAL.copyright);
                });
            }, { passive: true });
            copyBtn.addEventListener('mouseleave', (event) => {
                setTimeout(() => {
                    event.target.child('.ic').className = 'ic i-clipboard';
                }, 1000);
            });
        }
        const breakBtn = element.child('.breakline-btn');
        breakBtn.addEventListener('click', (event) => {
            const target = event.currentTarget;
            if (element.hasClass('breakline')) {
                element.removeClass('breakline');
                target.child('.ic').className = 'ic i-align-left';
            }
            else {
                element.addClass('breakline');
                target.child('.ic').className = 'ic i-align-justify';
            }
        });
        const fullscreenBtn = element.child('.fullscreen-btn');
        const removeFullscreen = () => {
            element.removeClass('fullscreen');
            element.scrollTop = 0;
            BODY.removeClass('fullscreen');
            fullscreenBtn.child('.ic').className = 'ic i-expand';
        };
        const fullscreenHandle = () => {
            if (element.hasClass('fullscreen')) {
                removeFullscreen();
                if (code_container && code_container.find('tr').length > 15) {
                    const showBtn = code_container.child('.show-btn');
                    code_container.style.maxHeight = '300px';
                    showBtn.removeClass('open');
                }
                pageScroll(element);
            }
            else {
                element.addClass('fullscreen');
                BODY.addClass('fullscreen');
                fullscreenBtn.child('.ic').className = 'ic i-compress';
                if (code_container && code_container.find('tr').length > 15) {
                    const showBtn = code_container.child('.show-btn');
                    code_container.style.maxHeight = '';
                    showBtn.addClass('open');
                }
            }
        };
        fullscreenBtn.addEventListener('click', fullscreenHandle);
        caption && caption.addEventListener('click', fullscreenHandle);
        if (code_container && code_container.find('tr').length > 15) {
            code_container.style.maxHeight = '300px';
            code_container.insertAdjacentHTML('beforeend', '<div class="show-btn"><i class="ic i-angle-down"></i></div>');
            const showBtn = code_container.child('.show-btn');
            const hideCode = () => {
                code_container.style.maxHeight = '300px';
                showBtn.removeClass('open');
            };
            const showCode = () => {
                code_container.style.maxHeight = '';
                showBtn.addClass('open');
            };
            showBtn.addEventListener('click', () => {
                if (showBtn.hasClass('open')) {
                    removeFullscreen();
                    hideCode();
                    pageScroll(code_container);
                }
                else {
                    showCode();
                }
            });
        }
    });
    $dom.asyncifyEach('pre.mermaid > svg', (element) => {
        const temp = element;
        temp.style.maxWidth = '';
    });
    $dom.each('.reward button', (element) => {
        element.addEventListener('click', (event) => {
            event.preventDefault();
            const qr = $dom('#qr');
            if (qr.display() === 'inline-flex') {
                transition(qr, 0);
            }
            else {
                transition(qr, 1, () => {
                    qr.display('inline-flex');
                });
            }
        });
    });
    $dom.asyncifyEach('.quiz > ul.options li', (element) => {
        element.addEventListener('click', () => {
            if (element.hasClass('correct')) {
                element.toggleClass('right');
                element.parentNode.parentNode.addClass('show');
            }
            else {
                element.toggleClass('wrong');
            }
        });
    });
    $dom.asyncifyEach('.quiz > p', (element) => {
        element.addEventListener('click', () => {
            element.parentNode.toggleClass('show');
        });
    });
    $dom.asyncifyEach('.quiz > p:first-child', (element) => {
        const quiz = element.parentNode;
        let type = 'choice';
        if (quiz.hasClass('true') || quiz.hasClass('false')) {
            type = 'true_false';
        }
        if (quiz.hasClass('multi')) {
            type = 'multiple';
        }
        if (quiz.hasClass('fill')) {
            type = 'gap_fill';
        }
        if (quiz.hasClass('essay')) {
            type = 'essay';
        }
        element.attr('data-type', LOCAL.quiz[type]);
    });
    $dom.asyncifyEach('.quiz .mistake', (element) => {
        element.attr('data-type', LOCAL.quiz.mistake);
    });
    $dom.each('div.tags a', (element) => {
        element.className = ['primary', 'success', 'info', 'warning', 'danger'][Math.floor(Math.random() * 5)];
    });
    $dom.asyncifyEach('.md div.player', (element) => {
        mediaPlayer(element, {
            type: element.attr('data-type'),
            mode: 'order',
            btns: []
        }).player.load(JSON.parse(element.attr('data-src'))).fetch();
    });
    const angleDown = document.querySelectorAll('.show-btn .i-angle-down');
    if (angleDown.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    angleDown.forEach(i => {
                        i.classList.remove('stop-animation');
                    });
                }
                else {
                    angleDown.forEach(i => {
                        i.classList.add('stop-animation');
                    });
                }
            });
        }, {
            root: null,
            threshold: 0.5
        });
        angleDown.forEach(i => {
            io.observe(i);
        });
    }
};
const tabFormat = () => {
    let first_tab;
    $dom.each('div.tab', (element) => {
        if (element.attr('data-ready')) {
            return;
        }
        const id = element.attr('data-id');
        const title = element.attr('data-title');
        let box = $dom('#' + id);
        if (!box) {
            box = document.createElement('div');
            box.className = 'tabs';
            box.id = id;
            box.innerHTML = '<div class="show-btn"></div>';
            const showBtn = box.child('.show-btn');
            showBtn.addEventListener('click', () => {
                pageScroll(box);
            });
            element.parentNode.insertBefore(box, element);
            first_tab = true;
        }
        else {
            first_tab = false;
        }
        let ul = box.child('.nav ul');
        if (!ul) {
            ul = box.createChild('div', {
                className: 'nav',
                innerHTML: '<ul></ul>'
            }).child('ul');
        }
        const li = ul.createChild('li', {
            innerHTML: title
        });
        if (first_tab) {
            li.addClass('active');
            element.addClass('active');
        }
        li.addEventListener('click', (event) => {
            const target = event.currentTarget;
            box.find('.active').forEach((el) => {
                el.removeClass('active');
            });
            element.addClass('active');
            target.addClass('active');
        });
        box.appendChild(element);
        element.attr('data-ready', String(true));
    });
};
const loadComments = () => {
    const element = $dom('#comments');
    if (!element) {
        goToComment.display('none');
        return;
    }
    else {
        goToComment.display('');
    }
    const io = new IntersectionObserver((entries, observer) => {
        const entry = entries[0];
        vendorCss('valine');
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
            transition($dom('#comments'), 'bounceUpIn');
            observer.disconnect();
        }
    });
    io.observe(element);
};
const algoliaSearch = (pjax) => {
    if (CONFIG.search === null) {
        return;
    }
    if (!siteSearch) {
        siteSearch = BODY.createChild('div', {
            id: 'search',
            innerHTML: '<div class="inner"><div class="header"><span class="icon"><i class="ic i-search"></i></span><div class="search-input-container"></div><span class="close-btn"><i class="ic i-times-circle"></i></span></div><div class="results"><div class="inner"><div id="search-stats"></div><div id="search-hits"></div><div id="search-pagination"></div></div></div></div>'
        });
    }
    const search = instantsearch({
        indexName: CONFIG.search.indexName,
        searchClient: algoliasearch(CONFIG.search.appID, CONFIG.search.apiKey),
        searchFunction(helper) {
            const searchInput = $dom('.search-input');
            if (searchInput.value) {
                helper.search();
            }
        }
    });
    search.on('render', () => {
        pjax.refresh($dom('#search-hits'));
    });
    search.addWidgets([
        instantsearch.widgets.configure({
            hitsPerPage: CONFIG.search.hits.per_page || 10
        }),
        instantsearch.widgets.searchBox({
            container: '.search-input-container',
            placeholder: LOCAL.search.placeholder,
            showReset: false,
            showSubmit: false,
            showLoadingIndicator: false,
            cssClasses: {
                input: 'search-input'
            }
        }),
        instantsearch.widgets.stats({
            container: '#search-stats',
            templates: {
                text(data) {
                    const stats = LOCAL.search.stats
                        .replace(/\$\{hits}/, data.nbHits)
                        .replace(/\$\{time}/, data.processingTimeMS);
                    return stats + '<span class="algolia-powered"></span><hr>';
                }
            }
        }),
        instantsearch.widgets.hits({
            container: '#search-hits',
            templates: {
                item(data) {
                    const cats = data.categories ? '<span>' + data.categories.join('<i class="ic i-angle-right"></i>') + '</span>' : '';
                    return '<a href="' + CONFIG.root + data.path + '">' + cats + data._highlightResult.title.value + '</a>';
                },
                empty(data) {
                    return '<div id="hits-empty">' +
                        LOCAL.search.empty.replace(/\$\{query}/, data.query) +
                        '</div>';
                }
            },
            cssClasses: {
                item: 'item'
            }
        }),
        instantsearch.widgets.pagination({
            container: '#search-pagination',
            scrollTo: false,
            showFirst: false,
            showLast: false,
            templates: {
                first: '<i class="ic i-angle-double-left"></i>',
                last: '<i class="ic i-angle-double-right"></i>',
                previous: '<i class="ic i-angle-left"></i>',
                next: '<i class="ic i-angle-right"></i>'
            },
            cssClasses: {
                root: 'pagination',
                item: 'pagination-item',
                link: 'page-number',
                selectedItem: 'current',
                disabledItem: 'disabled-item'
            }
        })
    ]);
    search.start();
    $dom.each('.search', (element) => {
        element.addEventListener('click', () => {
            document.body.style.overflow = 'hidden';
            transition(siteSearch, 'shrinkIn', () => {
                $dom('.search-input').focus();
            });
        });
    });
    const onPopupClose = () => {
        document.body.style.overflow = '';
        transition(siteSearch, 0);
    };
    siteSearch.addEventListener('click', (event) => {
        if (event.target === siteSearch) {
            onPopupClose();
        }
    });
    $dom('.close-btn').addEventListener('click', onPopupClose);
    window.addEventListener('pjax:success', onPopupClose);
    window.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            onPopupClose();
        }
    });
};
const domInit = () => {
    $dom.each('.overview .menu > .item', (el) => {
        siteNav.child('.menu').appendChild(el.cloneNode(true));
    });
    loadCat.addEventListener('click', Loader.vanish);
    menuToggle.addEventListener('click', sideBarToggleHandle);
    $dom('.dimmer').addEventListener('click', sideBarToggleHandle);
    quickBtn.child('.down').addEventListener('click', goToBottomHandle);
    quickBtn.child('.up').addEventListener('click', backToTopHandle);
    if (!toolBtn) {
        toolBtn = siteHeader.createChild('div', {
            id: 'tool',
            innerHTML: '<div class="item player"></div><div class="item contents"><i class="ic i-list-ol"></i></div><div class="item chat"><i class="ic i-comments"></i></div><div class="item back-to-top"><i class="ic i-arrow-up"></i><span>0%</span></div>'
        });
    }
    toolPlayer = toolBtn.child('.player');
    backToTop = toolBtn.child('.back-to-top');
    goToComment = toolBtn.child('.chat');
    showContents = toolBtn.child('.contents');
    backToTop.addEventListener('click', backToTopHandle);
    goToComment.addEventListener('click', goToCommentHandle);
    showContents.addEventListener('click', sideBarToggleHandle);
    if (typeof mediaPlayer !== 'undefined') {
        mediaPlayer(toolPlayer);
        $dom('main').addEventListener('click', () => {
            toolPlayer.player.mini();
        });
    }
    const createIntersectionObserver = () => {
        new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.parallax>use').forEach(i => {
                    i.classList.remove('stop-animation');
                });
                document.querySelectorAll('#imgs .item').forEach(i => {
                    i.classList.remove('stop-animation');
                });
            }
            else {
                document.querySelectorAll('.parallax>use').forEach(i => {
                    i.classList.add('stop-animation');
                });
                document.querySelectorAll('#imgs .item').forEach(i => {
                    i.classList.add('stop-animation');
                });
            }
        }, {
            root: null,
            threshold: 0.2
        }).observe(document.getElementById('waves'));
        new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.with-love>i').forEach(i => {
                    i.classList.remove('stop-animation');
                });
            }
            else {
                document.querySelectorAll('.with-love>i').forEach(i => {
                    i.classList.add('stop-animation');
                });
            }
        }, {
            root: null,
            threshold: 0.2
        }).observe(document.querySelector('.with-love'));
    };
    createIntersectionObserver();
};
const pjaxReload = () => {
    pagePosition();
    if (sideBar.hasClass('on')) {
        transition(sideBar, 0, () => {
            sideBar.removeClass('on');
            menuToggle.removeClass('close');
        });
    }
    const mainNode = $dom('#main');
    mainNode.innerHTML = '';
    mainNode.appendChild(loadCat.lastChild.cloneNode(true));
    pageScroll(0);
};
const siteRefresh = (reload) => {
    LOCAL_HASH = 0;
    LOCAL_URL = window.location.href;
    vendorCss('katex');
    vendorJs('copy_tex');
    vendorCss('mermaid');
    vendorJs('chart');
    if (reload !== 1) {
        $dom.each('script[data-pjax]', pjaxScript);
    }
    originTitle = document.title;
    resizeHandle();
    menuActive();
    sideBarTab();
    sidebarTOC();
    registerExtURL();
    postBeauty();
    tabFormat();
    if (typeof mediaPlayer !== 'undefined') {
        toolPlayer.player.load(LOCAL.audio || CONFIG.audio || {});
    }
    Loader.hide();
    setTimeout(() => {
        positionInit();
    }, 500);
    cardActive();
    lazyload.observe();
    isOutime();
};
const siteInit = () => {
    domInit();
    pjax = new Pjax({
        selectors: [
            'head title',
            '.languages',
            '.twikoo',
            '.pjax',
            '.leancloud-recent-comment',
            'script[data-config]'
        ],
        cacheBust: false
    });
    CONFIG.quicklink.ignores = LOCAL.ignores;
    quicklink.listen(CONFIG.quicklink);
    autoDarkmode();
    if (!CONFIG.disableVL) {
        visibilityListener();
    }
    themeColorListener();
    algoliaSearch(pjax);
    window.addEventListener('scroll', scrollHandle);
    window.addEventListener('resize', resizeHandle);
    window.addEventListener('pjax:send', pjaxReload);
    window.addEventListener('pjax:success', siteRefresh);
    window.addEventListener('beforeunload', () => {
        pagePosition();
    });
    siteRefresh(1);
};
window.addEventListener('DOMContentLoaded', siteInit, {
    passive: true
});
console.log('%c Theme.ShokaX v' + CONFIG.version + ' %c https://github.com/theme-shoka-x/hexo-theme-shokaX ', 'color: white; background: #e9546b; padding:5px 0;', 'padding:4px;border:1px solid #e9546b;');
console.log('%c by kaitaku ' + '%c https://www.kaitaku.xyz', 'color: white; background: #00bfff; padding: 5px 3px;', 'padding: 4px;border:1px solid #00bfff');
Vue.createApp({
    data() {
        return {};
    },
    methods: {
        changeThemeByBtn() {
            let c;
            const btn = $dom('.theme').child('.ic');
            const neko = BODY.createChild('div', {
                id: 'neko',
                innerHTML: '<div class="planet"><div class="sun"></div><div class="moon"></div></div><div class="body"><div class="face"><section class="eyes left"><span class="pupil"></span></section><section class="eyes right"><span class="pupil"></span></section><span class="nose"></span></div></div>'
            });
            const hideNeko = () => {
                transition(neko, {
                    delay: 2500,
                    opacity: 0
                }, () => {
                    BODY.removeChild(neko);
                });
            };
            if (btn.hasClass('i-sun')) {
                c = () => {
                    neko.addClass('dark');
                    changeTheme('dark');
                    $storage.set('theme', 'dark');
                    hideNeko();
                };
            }
            else {
                neko.addClass('dark');
                c = () => {
                    neko.removeClass('dark');
                    changeTheme();
                    $storage.set('theme', 'light');
                    hideNeko();
                };
            }
            transition(neko, 1, () => {
                setTimeout(c, 210);
            }, () => {
                neko.display('block');
            });
        }
    }
}).mount('#rightNav');
const sideBarToggleHandle = (event, force) => {
    if (sideBar.hasClass('on')) {
        sideBar.removeClass('on');
        menuToggle.removeClass('close');
        if (force) {
            sideBar.style = '';
        }
        else {
            transition(sideBar, 'slideRightOut');
        }
    }
    else {
        if (force) {
            sideBar.style = '';
        }
        else {
            transition(sideBar, 'slideRightIn', () => {
                sideBar.addClass('on');
                menuToggle.addClass('close');
            });
        }
    }
};
const sideBarTab = () => {
    const sideBarInner = sideBar.child('.inner');
    if (sideBar.child('.tab')) {
        sideBarInner.removeChild(sideBar.child('.tab'));
    }
    const list = document.createElement('ul');
    let active = 'active';
    list.className = 'tab';
    ['contents', 'related', 'overview'].forEach((item) => {
        const element = sideBar.child('.panel.' + item);
        if (element.innerHTML.trim().length < 1) {
            if (item === 'contents') {
                showContents.display('none');
            }
            return;
        }
        if (item === 'contents') {
            showContents.display('');
        }
        const tab = document.createElement('li');
        const span = document.createElement('span');
        const text = document.createTextNode(element.attr('data-title'));
        span.appendChild(text);
        tab.appendChild(span);
        tab.addClass(item + ' item');
        if (active) {
            element.addClass(active);
            tab.addClass(active);
        }
        else {
            element.removeClass('active');
        }
        tab.addEventListener('click', (event) => {
            const target = event.currentTarget;
            if (target.hasClass('active'))
                return;
            sideBar.find('.tab .item').forEach((element) => {
                element.removeClass('active');
            });
            sideBar.find('.panel').forEach((element) => {
                element.removeClass('active');
            });
            sideBar.child('.panel.' + target.className.replace(' item', '')).addClass('active');
            target.addClass('active');
        });
        list.appendChild(tab);
        active = '';
    });
    if (list.childNodes.length > 1) {
        sideBarInner.insertBefore(list, sideBarInner.childNodes[0]);
        sideBar.child('.panels').style.paddingTop = '';
    }
    else {
        sideBar.child('.panels').style.paddingTop = '.625rem';
    }
};
const sidebarTOC = () => {
    const activateNavByIndex = (index) => {
        const target = navItems[index];
        if (!target)
            return;
        if (target.hasClass('current')) {
            return;
        }
        $dom.each('.toc .active', (element) => {
            element && element.removeClass('active current');
        });
        sections.forEach((element) => {
            element && element.removeClass('active');
        });
        target.addClass('active current');
        sections[index] && sections[index].addClass('active');
        let parent = target.parentNode;
        while (!parent.matches('.contents')) {
            if (parent.matches('li')) {
                parent.addClass('active');
                const t = $dom(parent.child('a.toc-link').attr('href'));
                if (t) {
                    t.addClass('active');
                }
            }
            parent = parent.parentNode;
        }
        if (getComputedStyle(sideBar).display !== 'none' && tocElement.hasClass('active')) {
            pageScroll(tocElement, target.offsetTop - (tocElement.offsetHeight / 4));
        }
    };
    const navItems = $dom.all('.contents li');
    if (navItems.length < 1) {
        return;
    }
    let sections = [...navItems];
    let activeLock = null;
    sections = sections.map((element, index) => {
        const link = element.child('a.toc-link');
        const anchor = $dom(decodeURI(link.attr('href')));
        if (!anchor)
            return null;
        const alink = anchor.child('a.anchor');
        const anchorScroll = (event) => {
            event.preventDefault();
            const target = $dom(decodeURI(event.currentTarget.attr('href')));
            activeLock = index;
            pageScroll(target, null, () => {
                activateNavByIndex(index);
                activeLock = null;
            });
        };
        link.addEventListener('click', anchorScroll);
        alink && alink.addEventListener('click', (event) => {
            anchorScroll(event);
            clipBoard(CONFIG.hostname + '/' + LOCAL.path + event.currentTarget.attr('href'));
        });
        return anchor;
    });
    const tocElement = sideBar.child('.contents.panel');
    const findIndex = (entries) => {
        let index = 0;
        let entry = entries[index];
        if (entry.boundingClientRect.top > 0) {
            index = sections.indexOf(entry.target);
            return index === 0 ? 0 : index - 1;
        }
        for (; index < entries.length; index++) {
            if (entries[index].boundingClientRect.top <= 0) {
                entry = entries[index];
            }
            else {
                return sections.indexOf(entry.target);
            }
        }
        return sections.indexOf(entry.target);
    };
    const createIntersectionObserver = () => {
        const observer = new IntersectionObserver((entries) => {
            const index = findIndex(entries) + (diffY < 0 ? 1 : 0);
            if (activeLock === null) {
                activateNavByIndex(index);
            }
        }, {
            rootMargin: '0px 0px -100% 0px', threshold: 0
        });
        sections.forEach((element) => {
            element && observer.observe(element);
        });
    };
    createIntersectionObserver();
};
const backToTopHandle = () => {
    pageScroll(0);
};
const goToBottomHandle = () => {
    pageScroll(parseInt(String(Container.changeOrGetHeight())));
};
const goToCommentHandle = () => {
    pageScroll($dom('#comments'));
};
const menuActive = () => {
    $dom.each('.menu .item:not(.title)', (element) => {
        const target = element.child('a[href]');
        const parentItem = element.parentNode.parentNode;
        if (!target)
            return;
        const isSamePath = target.pathname === location.pathname || target.pathname === location.pathname.replace('index.html', '');
        const isSubPath = !CONFIG.root.startsWith(target.pathname) && location.pathname.startsWith(target.pathname);
        const active = target.hostname === location.hostname && (isSamePath || isSubPath);
        element.toggleClass('active', active);
        if (element.parentNode.child('.active') && parentItem.hasClass('dropdown')) {
            parentItem.removeClass('active').addClass('expand');
        }
        else {
            parentItem.removeClass('expand');
        }
    });
};
const canvasEl = document.createElement('canvas');
canvasEl.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9999999';
document.body.appendChild(canvasEl);
const ctx = canvasEl.getContext('2d');
const numberOfParticules = 30;
let pointerX = 0;
let pointerY = 0;
const tap = 'click';
const colors = CONFIG.fireworks;
function setCanvasSize() {
    canvasEl.width = window.innerWidth * 2;
    canvasEl.height = window.innerHeight * 2;
    canvasEl.style.width = window.innerWidth + 'px';
    canvasEl.style.height = window.innerHeight + 'px';
    canvasEl.getContext('2d').scale(2, 2);
}
function updateCoords(e) {
    pointerX = e.clientX || (e.touches && e.touches[0].clientX);
    pointerY = e.clientY || (e.touches && e.touches[0].clientY);
}
function setParticuleDirection(p) {
    const angle = anime.random(0, 360) * Math.PI / 180;
    const value = anime.random(50, 180);
    const radius = [-1, 1][anime.random(0, 1)] * value;
    return {
        x: p.x + radius * Math.cos(angle),
        y: p.y + radius * Math.sin(angle)
    };
}
function createParticule(x, y) {
    const p = {
        x,
        y,
        color: undefined,
        radius: undefined,
        endPos: undefined,
        draw() {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
            ctx.fillStyle = p.color;
            ctx.fill();
        }
    };
    p.color = colors[anime.random(0, colors.length - 1)];
    p.radius = anime.random(16, 32);
    p.endPos = setParticuleDirection(p);
    return p;
}
function createCircle(x, y) {
    const p = {
        x,
        y,
        color: '#FFF',
        radius: 0.1,
        endPos: undefined,
        alpha: 0.5,
        lineWidth: 6,
        draw() {
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
            ctx.lineWidth = p.lineWidth;
            ctx.strokeStyle = p.color;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    };
    return p;
}
function renderParticule(targets) {
    for (const target of targets) {
        target.draw();
    }
}
function animateParticules(x, y) {
    const circle = createCircle(x, y);
    const particules = [];
    for (let i = 0; i < numberOfParticules; i++) {
        particules.push(createParticule(x, y));
    }
    anime().timeline().add({
        targets: particules,
        duration: anime.random(1200, 1800),
        easing: 'easeOutExpo',
        update: renderParticule,
        x: p => p.endPos.x,
        y: p => p.endPos.y,
        radius: 0.1
    }).add({
        targets: circle,
        duration: anime.random(1200, 1800),
        easing: 'easeOutExpo',
        update: renderParticule,
        radius: anime.random(80, 160),
        lineWidth: 0,
        alpha: {
            value: 0,
            easing: 'linear',
            duration: anime.random(600, 800)
        }
    }).play();
}
const render = anime({
    duration: Infinity,
    update() {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    }
});
const hasAncestor = (node, name) => {
    name = name.toUpperCase();
    do {
        if (node === null || node === undefined)
            break;
        if (node.nodeName === name)
            return true;
    } while ((node = node.parentNode) !== null);
    return false;
};
document.addEventListener(tap, (e) => {
    if (hasAncestor(e.target, 'a')) {
        return;
    }
    render.play();
    updateCoords(e);
    animateParticules(pointerX, pointerY);
}, false);
setCanvasSize();
window.addEventListener('resize', setCanvasSize, false);
