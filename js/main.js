(function () {
    'use strict';

    const imageList = [
        'images/20250628_213715.jpg',
        'images/20250628_213730.jpg',
        'images/20250628_212622.jpg',
        'images/20250628_212720.jpg',
        'images/20250628_212508.jpg'
    ];

    let currentIndex = 0;
    let mainImg = null;
    let thumbImgs = [];
    let isAnimating = false;

    function initPhotoWall() {
        const container = document.getElementById('photoStack');
        if (!container) return;

        container.innerHTML = '';
        thumbImgs = [];

        const leftImg = document.createElement('img');
        leftImg.className = 'photo-card thumb-l';
        leftImg.draggable = false;
        container.appendChild(leftImg);
        thumbImgs.push(leftImg);

        mainImg = document.createElement('img');
        mainImg.className = 'photo-card main active';
        mainImg.draggable = false;
        container.appendChild(mainImg);

        const rightImg = document.createElement('img');
        rightImg.className = 'photo-card thumb-r';
        rightImg.draggable = false;
        container.appendChild(rightImg);
        thumbImgs.push(rightImg);

        updatePhotoCards();
    }

    function updatePhotoCards() {
        if (!mainImg || imageList.length === 0) return;

        const total = imageList.length;
        mainImg.src = imageList[currentIndex];
        mainImg.classList.add('active');
        thumbImgs[0].src = imageList[(currentIndex - 1 + total) % total];
        thumbImgs[1].src = imageList[(currentIndex + 1) % total];
    }

    function switchImage(direction) {
        if (isAnimating || !mainImg || imageList.length === 0) return;

        const newIndex = (currentIndex + direction + imageList.length) % imageList.length;
        if (newIndex === currentIndex) return;

        isAnimating = true;
        const cards = [mainImg, thumbImgs[0], thumbImgs[1]];
        cards.forEach(card => {
            card.classList.remove('wave-out', 'wave-in');
            void card.offsetWidth;
            card.classList.add('wave-out');
        });

        window.setTimeout(() => {
            currentIndex = newIndex;
            updatePhotoCards();
            cards.forEach(card => {
                card.classList.remove('wave-out', 'wave-in');
                card.classList.add('wave-in');
            });

            window.setTimeout(() => {
                cards.forEach(card => card.classList.remove('wave-in'));
                isAnimating = false;
            }, 800);
        }, 700);
    }

    function prevImage() {
        switchImage(-1);
    }

    function nextImage() {
        switchImage(1);
    }

    window.prevImage = prevImage;
    window.nextImage = nextImage;

    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') prevImage();
        if (event.key === 'ArrowRight') nextImage();
    });

    const COLLECT_KEY = 'mixx_lab_collect';
    const REACTION_KEY = 'mixx-lab-reactions';
    const NAME_KEY = 'mixx-lab-name';
    const COMMENTS_KEY = 'mixx-lab-comments';
    const CHAT_KEY = 'mixx-lab-chat';

    function readStorage(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function writeStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function getCollectList() {
        const list = readStorage(COLLECT_KEY, []);
        return Array.isArray(list) ? list : [];
    }

    function saveCollectList(list) {
        writeStorage(COLLECT_KEY, list);
    }

    function isCollected(title) {
        return getCollectList().includes(title);
    }

    function collectVideo(title, button) {
        const list = getCollectList();
        const isAlreadyCollected = list.includes(title);
        const nextList = isAlreadyCollected
            ? list.filter(item => item !== title)
            : list.concat(title);

        saveCollectList(nextList);
        if (button) {
            button.innerHTML = isAlreadyCollected
                ? '<i class="fa-regular fa-star"></i>'
                : '<i class="fa-solid fa-star"></i>';
        }
    }

    function refreshAllCollectBtn() {
        document.querySelectorAll('.collect-btn-card').forEach(button => {
            const title = button.dataset.title;
            button.innerHTML = isCollected(title)
                ? '<i class="fa-solid fa-star"></i>'
                : '<i class="fa-regular fa-star"></i>';
        });
    }

    function collectCurrentPic() {
        window.alert('照片收藏功能待扩展，目前仅支持收藏舞台曲目。');
    }

    window.collectVideo = collectVideo;
    window.collectCurrentPic = collectCurrentPic;

    function createElement(tagName, className, text) {
        const element = document.createElement(tagName);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    }

    const reactionDefaults = [
        { symbol: 'ㅠㅠ', label: 'TEARS', count: 128 },
        { symbol: '!!!', label: 'IMPACT', count: 96 },
        { symbol: '♡', label: 'MELT', count: 72 },
        { symbol: '✦', label: 'GLOW', count: 51 },
        { symbol: '↻', label: 'LOOP', count: 43 }
    ];

    function renderReactions() {
        const list = document.getElementById('reactionList');
        if (!list) return;

        const stored = readStorage(REACTION_KEY, {});
        list.replaceChildren();
        reactionDefaults.forEach(reaction => {
            const item = createElement('button', 'reaction-item');
            item.type = 'button';
            item.dataset.label = reaction.label;
            item.setAttribute('aria-label', `${reaction.label}: ${reaction.count}`);

            const symbol = createElement('span', 'reaction-symbol', reaction.symbol);
            const label = createElement('span', 'reaction-label', reaction.label);
            const count = createElement('span', 'reaction-count', String(reaction.count + (stored[reaction.label] || 0)));
            const plusOne = createElement('span', 'reaction-plus-one', '+1');

            item.append(symbol, label, count, plusOne);
            item.addEventListener('click', () => {
                const nextStored = readStorage(REACTION_KEY, {});
                nextStored[reaction.label] = (nextStored[reaction.label] || 0) + 1;
                writeStorage(REACTION_KEY, nextStored);
                count.textContent = String(reaction.count + nextStored[reaction.label]);
                item.classList.add('selected');
                item.setAttribute('aria-label', `${reaction.label}: ${count.textContent}`);
                plusOne.classList.remove('is-visible');
                void plusOne.offsetWidth;
                plusOne.classList.add('is-visible');
                window.setTimeout(() => plusOne.classList.remove('is-visible'), 850);
            });
            list.appendChild(item);
        });
    }

    function getComments() {
        const comments = readStorage(COMMENTS_KEY, []);
        return Array.isArray(comments) ? comments.slice(0, 20) : [];
    }

    function saveComments(comments) {
        writeStorage(COMMENTS_KEY, comments.slice(0, 20));
    }

    function renderComments() {
        const list = document.getElementById('commentList');
        if (!list) return;

        list.replaceChildren();
        getComments().forEach((comment, index) => {
            const item = createElement('article', 'comment-item');
            const meta = createElement('div', 'comment-meta');
            const sequence = createElement('span', 'comment-sequence', `#${index + 1}`);
            const name = createElement('strong', 'comment-name', comment.name);
            const time = createElement('time', 'comment-time', comment.time);
            const body = createElement('p', 'comment-body', comment.content);
            meta.append(sequence, name, time);
            item.append(meta, body);
            list.appendChild(item);
        });
    }

    function getChatMessages() {
        const messages = readStorage(CHAT_KEY, []);
        return Array.isArray(messages) ? messages.slice(-40) : [];
    }

    function saveChatMessages(messages) {
        writeStorage(CHAT_KEY, messages.slice(-40));
    }

    function renderChat() {
        const list = document.getElementById('chatWrap');
        if (!list) return;

        list.replaceChildren();
        getChatMessages().forEach(message => {
            const item = createElement('article', 'chat-item');
            const meta = createElement('div', 'chat-meta');
            const name = createElement('strong', 'chat-name', message.name);
            const time = createElement('time', 'chat-time', message.time);
            const body = createElement('p', 'chat-body', message.text);
            meta.append(name, time);
            item.append(meta, body);
            list.appendChild(item);
        });
        list.scrollTop = list.scrollHeight;
    }

    function getSharedName() {
        const nameInput = document.getElementById('userName');
        const typedName = nameInput ? nameInput.value.trim() : '';
        return typedName || localStorage.getItem(NAME_KEY) || '';
    }

    function rememberName() {
        const nameInput = document.getElementById('userName');
        if (!nameInput) return;
        const name = nameInput.value.trim();
        if (name) localStorage.setItem(NAME_KEY, name);
    }

    function updateCommentCount() {
        const input = document.getElementById('userMsg');
        const counter = document.getElementById('commentCount');
        if (input && counter) counter.textContent = `${input.value.length} / 180`;
    }

    function bindRoomForms() {
        const nameInput = document.getElementById('userName');
        const commentInput = document.getElementById('userMsg');
        const commentForm = document.getElementById('commentForm');
        const chatForm = document.getElementById('chatForm');
        const savedName = localStorage.getItem(NAME_KEY);

        if (nameInput && savedName) nameInput.value = savedName;
        nameInput?.addEventListener('input', rememberName);
        commentInput?.addEventListener('input', updateCommentCount);

        commentForm?.addEventListener('submit', event => {
            event.preventDefault();
            const name = getSharedName();
            const content = commentInput ? commentInput.value.trim() : '';
            if (!name || !content) return;

            rememberName();
            const comments = getComments();
            comments.unshift({
                name,
                content: content.slice(0, 180),
                time: new Date().toLocaleString()
            });
            saveComments(comments);
            if (commentInput) commentInput.value = '';
            updateCommentCount();
            renderComments();
        });

        chatForm?.addEventListener('submit', event => {
            event.preventDefault();
            const input = document.getElementById('chatInput');
            const name = getSharedName();
            const text = input ? input.value.trim() : '';
            if (!name || !text) {
                if (!name) nameInput?.focus();
                return;
            }

            rememberName();
            const messages = getChatMessages();
            messages.push({
                name,
                text: text.slice(0, 80),
                time: new Date().toLocaleString()
            });
            saveChatMessages(messages);
            if (input) input.value = '';
            renderChat();
        });
    }

    function renderCollect() {
        const wrap = document.getElementById('collectWrap');
        const emptyTip = document.getElementById('emptyTip');
        if (!wrap || !emptyTip) return;

        wrap.replaceChildren();
        const list = getCollectList();
        emptyTip.style.display = list.length === 0 ? 'block' : 'none';

        list.forEach((title, index) => {
            const item = createElement('div', 'collect-item');
            const heading = createElement('h3', '', title);
            const live = createElement('a', 'video-link', 'LIVE');
            live.href = `purchase.html?track=${index + 1}`;
            live.target = '_blank';

            const actions = createElement('div');
            actions.style.cssText = 'display:flex;gap:10px;justify-content:center;margin-top:10px;';
            const remove = createElement('button', 'del-collect', '取消收藏');
            const share = createElement('button', 'del-collect', '分享到广场');
            remove.addEventListener('click', () => delCollect(title));
            share.addEventListener('click', () => shareCollect(title));
            actions.append(remove, share);
            item.append(heading, live, actions);
            wrap.appendChild(item);
        });
    }

    function delCollect(title) {
        saveCollectList(getCollectList().filter(item => item !== title));
        renderCollect();
        refreshAllCollectBtn();
    }

    function shareCollect(title) {
        const messageInput = document.getElementById('userMsg');
        const messageBoard = document.getElementById('commentLog');
        if (!messageInput || !messageBoard) {
            window.alert('请先回到首页的 PUBLIC ROOM 使用分享功能。');
            return;
        }
        messageInput.value = `I saved: ${title}`;
        updateCommentCount();
        messageBoard.scrollIntoView({ behavior: 'smooth' });
    }

    window.renderCollect = renderCollect;
    window.delCollect = delCollect;
    window.shareCollect = shareCollect;

    function updateActiveLink() {
        const scrollY = window.scrollY;
        const sections = document.querySelectorAll('section[id]');
        let currentVisibleId = null;
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.clientHeight;
            if (scrollY >= top - window.innerHeight / 2 && scrollY < bottom - window.innerHeight / 3) {
                currentVisibleId = section.id;
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        if (currentVisibleId) {
            document.querySelector(`.nav-link[data-section="${currentVisibleId}"]`)?.classList.add('active');
        }
    }

    function bindNavigation() {
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => link.addEventListener('click', () => {
            links.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
        }));

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                const visible = entries.filter(entry => entry.isIntersecting);
                if (!visible.length) return;
                const section = visible.sort((a, b) => a.target.offsetTop - b.target.offsetTop)[0].target;
                links.forEach(link => link.classList.remove('active'));
                document.querySelector(`.nav-link[data-section="${section.id}"]`)?.classList.add('active');
            }, { threshold: 0.5 });
            document.querySelectorAll('section[id]').forEach(section => observer.observe(section));
        } else {
            window.addEventListener('scroll', updateActiveLink, { passive: true });
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        initPhotoWall();
        refreshAllCollectBtn();
        renderReactions();
        bindRoomForms();
        updateCommentCount();
        renderComments();
        renderChat();
        bindNavigation();
    });
}());
