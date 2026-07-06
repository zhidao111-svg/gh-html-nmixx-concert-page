    // ===== 强制 HOME 高亮（页面加载时） =====
    (function() {
        // 先清除所有 active
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        // 给 HOME 加上 active
        document.querySelector('.nav-link[data-section="home"]')?.classList.add('active');
    })();

 // ===== 导航链接活跃状态更新（使用 data-section 匹配） =====
(function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // 处理导航链接点击
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

if ('IntersectionObserver' in window) {
    const observerOptions = { threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
        const visibleEntries = entries.filter(e => e.isIntersecting);
        if(visibleEntries.length === 0) return;
        const topEntry = visibleEntries.sort((a,b)=>a.target.offsetTop - b.target.offsetTop)[0];
        const targetId = topEntry.target.id;
        navLinks.forEach(link => link.classList.remove('active'));
        const targetLink = document.querySelector(`.nav-link[data-section="${targetId}"]`);
        if(targetLink) targetLink.classList.add('active');
    }, observerOptions);
    sections.forEach(section => observer.observe(section));
} else {
    window.addEventListener('scroll', updateActiveLink, { passive: true });
}

// 【移到这里，缩进和上面代码对齐，包在自执行函数内部】
function updateActiveLink() {
    const scrollY = window.scrollY;
    let currentVisibleId = null;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - window.innerHeight/2 && scrollY < sectionTop + sectionHeight - window.innerHeight/3) {
            currentVisibleId = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => link.classList.remove('active'));
    if(currentVisibleId){
        const link = document.querySelector(`.nav-link[data-section="${currentVisibleId}"]`);
        if(link) link.classList.add('active');
    }
}
})(); // 自执行函数闭合括号，放在updateActiveLink后面

    // ===== 图片切换功能 =====
    // ===== 图片列表 =====
const imageList = [
    'images/20250628_213715.jpg',
    'images/20250628_213730.jpg',
    'images/20250628_212622.jpg',
    'images/20250628_212720.jpg',
    'images/20250628_212508.jpg'
];
let currentIndex = 0;
const container = document.getElementById('photoStack');
let mainImg = null;
let thumbImgs = [];

function initCards() {
    container.innerHTML = '';
    thumbImgs = [];

    // 只创建三张图：左子图、主图、右子图
    // 左子图
    const leftImg = document.createElement('img');
    leftImg.className = 'photo-card thumb-l';
    leftImg.draggable = false;
    container.appendChild(leftImg);
    thumbImgs.push(leftImg);   // thumbImgs[0] 为左子图

    // 主图
    mainImg = document.createElement('img');
    mainImg.className = 'photo-card main active';
    mainImg.draggable = false;
    container.appendChild(mainImg);

    // 右子图
    const rightImg = document.createElement('img');
    rightImg.className = 'photo-card thumb-r';
    rightImg.draggable = false;
    container.appendChild(rightImg);
    thumbImgs.push(rightImg);  // thumbImgs[1] 为右子图

    updateCards();
}

function updateCards() {
    const total = imageList.length;
    if (total === 0) return;

    // 主图显示 currentIndex
    mainImg.src = imageList[currentIndex];
    mainImg.classList.add('active');

    // 左子图 = currentIndex - 1，右子图 = currentIndex + 1
    const leftIdx = (currentIndex - 1 + total) % total;
    const rightIdx = (currentIndex + 1) % total;

    thumbImgs[0].src = imageList[leftIdx];   // 左
    thumbImgs[1].src = imageList[rightIdx];  // 右
}


// ===== 切换函数（海面掠过版） =====
let isAnimating = false;

function switchImage(direction) {
    if (isAnimating || imageList.length === 0) return;

    let newIndex = (currentIndex + direction + imageList.length) % imageList.length;
    if (newIndex === currentIndex) return;

    isAnimating = true;

    const mainCard = mainImg;
    const leftCard = thumbImgs[0];
    const rightCard = thumbImgs[1];

    // 1. 移除旧动画类，重置状态
    mainCard.classList.remove('wave-out', 'wave-in');
    leftCard.classList.remove('wave-out', 'wave-in');
    rightCard.classList.remove('wave-out', 'wave-in');

    // 强制重排
    void mainCard.offsetWidth;

    // 2. 根据方向决定动画方向
    if (direction === -1) { // 向左切换 → 图片向右滑出
        mainCard.classList.add('wave-out');
        leftCard.classList.add('wave-out');
        rightCard.classList.add('wave-out');
    } else { // 向右切换 → 图片向左滑出
        mainCard.classList.add('wave-out');
        leftCard.classList.add('wave-out');
        rightCard.classList.add('wave-out');
    }

    // 3. 等待滑出动画完成（700ms）
    setTimeout(() => {
        // 更新索引和图片
        currentIndex = newIndex;
        updateCards();

        // 移除所有动画类
        mainCard.classList.remove('wave-out', 'wave-in');
        leftCard.classList.remove('wave-out', 'wave-in');
        rightCard.classList.remove('wave-out', 'wave-in');

        // 4. 主图滑入
        mainCard.classList.add('wave-in');

        // 5. 子图滑入（方向与滑出相反）
        leftCard.classList.add('wave-in');
        rightCard.classList.add('wave-in');

        // 6. 解锁
        setTimeout(() => {
            // 移除动画类，恢复默认状态
            mainCard.classList.remove('wave-in');
            leftCard.classList.remove('wave-in');
            rightCard.classList.remove('wave-in');
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

// ===== 键盘左右键 =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
});

window.prevImage = prevImage;
window.nextImage = nextImage;



// ========== 留言区逻辑 ==========
function getMsgData(){
    return JSON.parse(localStorage.getItem("nmixxMsg")) || [];
}
function saveMsgData(arr){
    localStorage.setItem("nmixxMsg",JSON.stringify(arr));
}
function renderMsg(){
    const wrap = document.getElementById("msgWrap");
    if(!wrap) return;
    const list = getMsgData();
    const likeRecord = getLikeData();
    wrap.innerHTML = "";
    list.forEach(item=>{
        const dom = document.createElement("div");
        dom.className = "msg-item";
        const likeNum = likeRecord[item.time] || 0;
        dom.innerHTML = `
            <h4>${item.name}</h4>
            <p style="white-space:pre-line;">${item.content}</p>
            <span>${item.time}</span>
            <div class="social-btn">
                <button class="like-btn" onclick="addLike('${item.time}')">💛 共鸣 ${likeNum}</button>
                <button class="reply-btn" onclick="replyMsg('${item.name}')">回复</button>
                <button class="share-btn" onclick="copyMsg('${item.content}')">分享给同好</button>
            </div>
        `;
        wrap.appendChild(dom);
    })
}

function copyMsg(text){
    navigator.clipboard.writeText(text).then(()=>{
        alert("动态文案已复制，可以发给搭子！");
    }).catch(()=>{
        prompt("复制下面内容", text);
    })
}

function addLike(msgTime){
  const likes = getLikeData();
  likes[msgTime] = (likes[msgTime] || 0) + 1;
  localStorage.setItem("msgLikes", JSON.stringify(likes));
  renderMsg();
}

// 回复动态
function replyMsg(authorName){
    const replyText = prompt(`回复 ${authorName}：`,"");
    if(!replyText || replyText.trim() === "") return;
    // 拼接回复内容，追加到留言列表
    const name = document.getElementById("userName").value.trim() || "匿名NSWER";
    const fullReply = `回复 @${authorName}：${replyText}`;
    const myTags = getUserTags().join("、");
    const finalText = myTags ? `${fullReply}\n【我的标签】${myTags}` : fullReply;

    const data = getMsgData();
    data.push({
        name,
        content: finalText,
        time:new Date().toLocaleString()
    })
    saveMsgData(data);
    renderMsg();
    alert("回复发送成功！");
}

function submitMessage(){
    const name = document.getElementById("userName").value.trim();
    const msg = document.getElementById("userMsg").value.trim();
    if(!name||!msg){alert("昵称和留言不能为空");return;}

    // 获取用户标签
    const myTags = getUserTags().join("、");
    const fullContent = myTags ? `${msg}\n【我的标签】${myTags}` : msg;

    const data = getMsgData();
    data.push({
        name,
        content: fullContent,
        time:new Date().toLocaleString()
    })
    saveMsgData(data);
    document.getElementById("userName").value = "";
    document.getElementById("userMsg").value = "";
    renderMsg();
    alert("发布瞬间成功！");
}


// 匹配同好
function openMatchModal(){
    const modal = document.getElementById("matchModal");
    modal.style.display = "flex";
    startMatch();
}
function closeMatchModal(){
    document.getElementById("matchModal").style.display = "none";
}
function startMatch(){
    const myTags = getUserTags();
    // 读取所有留言发布用户作为匹配池
    const allMsg = getMsgData();
    const userPool = [...new Set(allMsg.map(item=>item.name))];
    if(userPool.length <= 1){
        document.getElementById("matchText").innerText = "暂无其他同好发布动态，多去广场留言吧！";
        return;
    }
    // 随机抽取一名用户模拟匹配
    const randomUser = userPool[Math.floor(Math.random()*userPool.length)];
    document.getElementById("matchText").innerText = `匹配到同好：${randomUser}\n你们共同标签：${myTags.join("、")}`;
    // 存储匹配对象，用于私聊
    localStorage.setItem("matchTarget", randomUser);
}
// 打开私聊
function openChat(){
    const target = localStorage.getItem("matchTarget");
    const input = prompt(`给 ${target} 发消息：`,"");
    if(!input?.trim()) return;
    sendChat(target, input);
    closeMatchModal();
}

// 公共聊天室
function getRoomChat(){
    return JSON.parse(localStorage.getItem("mixxRoomChat")) || [];
}
function saveRoomChat(arr){
    localStorage.setItem("mixxRoomChat", JSON.stringify(arr));
}
function renderRoomChat(){
    const wrap = document.getElementById("chatWrap");
    if(!wrap) return;
    const list = getRoomChat();
    wrap.innerHTML = "";
    list.slice(-30).forEach(item=>{ // 只保留最新30条
        wrap.innerHTML += `<div class="chat-item"><b>${item.name}</b>：${item.text} <span style="font-size:10px;">${item.time}</span></div>`;
    })
    wrap.scrollTop = wrap.scrollHeight;
}
function sendRoomChat(){
    const text = document.getElementById("chatInput").value.trim();
    if(!text) return;
    const name = getUserNick();
    const data = getRoomChat();
    data.push({name, text, time:new Date().toLocaleString()});
    saveRoomChat(data);
    document.getElementById("chatInput").value = "";
    renderRoomChat();
}
// 页面加载渲染聊天室
window.addEventListener("DOMContentLoaded", () => {
    refreshAllCollectBtn();
    renderMsg();
    initCards();
    renderUserPage();
    renderRoomChat(); // 新增
});

// 本地存储key
const COLLECT_KEY = "mixx_lab_collect";

// 获取收藏数组
function getCollectList() {
    let str = localStorage.getItem(COLLECT_KEY);
    if (!str) return [];
    return JSON.parse(str);
}

// 保存收藏数组
function saveCollectList(list) {
    localStorage.setItem(COLLECT_KEY, JSON.stringify(list));
}

// 判断是否已收藏
function isCollected(title) {
    const list = getCollectList();
    return list.includes(title);
}

// 切换收藏状态（歌曲卡片星星按钮调用）
function collectVideo(title, btnDom) {
    let list = getCollectList();
    if (list.includes(title)) {
        // 已收藏 → 取消
        list = list.filter(item => item !== title);
        btnDom.innerHTML = `<i class="fa-regular fa-star"></i>`;
    } else {
        // 未收藏 → 添加
        list.push(title);
        btnDom.innerHTML = `<i class="fa-solid fa-star"></i>`;
    }
    saveCollectList(list);
}

// 顶部照片爱心收藏（如需图片收藏可扩展，当前只做歌曲）
function collectCurrentPic() {
    alert("图片收藏功能待扩展，当前仅支持收藏舞台曲目");
}

// 页面加载时，统一刷新所有收藏按钮图标状态
function refreshAllCollectBtn() {
    const allBtn = document.querySelectorAll(".collect-btn-card");
    allBtn.forEach(btn => {
        const title = btn.dataset.title;
        if (isCollected(title)) {
            btn.innerHTML = `<i class="fa-solid fa-star"></i>`;
        } else {
            btn.innerHTML = `<i class="fa-regular fa-star"></i>`;
        }
    })
}

// 渲染收藏页面列表（collect.html调用）
function renderCollect() {
    const wrap = document.getElementById("collectWrap");
    const emptyTip = document.getElementById("emptyTip");
    if(!wrap || !emptyTip) return;
    const list = getCollectList();
    wrap.innerHTML = "";
    if (list.length === 0) {
        emptyTip.style.display = "block";
        return;
    }
    emptyTip.style.display = "none";
    let html = "";
    list.forEach((title, idx) => {
        html += `
        <div class="collect-item">
            <h3>${title}</h3>
            <a href="purchase.html?track=${idx+1}" target="_blank" class="video-link">LIVE</a>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:10px;">
                <button class="del-collect" onclick="delCollect('${title}')">取消收藏</button>
                <button class="del-collect" onclick="shareCollect('${title}')">分享到广场</button>
            </div>
        </div>
        `
    })
    wrap.innerHTML = html;
}

// 删除单条收藏（收藏页按钮）
function delCollect(title) {
    let list = getCollectList();
    list = list.filter(item => item !== title);
    saveCollectList(list);
    renderCollect();
    // 切回首页时星星同步更新
    refreshAllCollectBtn();
}


// 全局页面加载完成执行
window.addEventListener("DOMContentLoaded", () => {
    refreshAllCollectBtn();
    renderMsg();
    // 等HTML加载完再初始化图片
    initCards();
});

// 点赞功能
function getLikeData(){
  return JSON.parse(localStorage.getItem("msgLikes")) || {};
}
function addLike(msgTime){
  const likes = getLikeData();
  likes[msgTime] = (likes[msgTime] || 0) + 1;
  localStorage.setItem("msgLikes", JSON.stringify(likes));
  renderMsg();
}

// 用户标签
function saveTags(){
  const inputs = document.querySelectorAll('#tagModal input:checked');
  const tags = Array.from(inputs).map(i=>i.value);
  localStorage.setItem("userTags", JSON.stringify(tags));
}
function getUserTags(){
  return JSON.parse(localStorage.getItem("userTags")) || [];
}

function shareCollect(title){
  const tags = getUserTags().join("、");
  const content = `我收藏了舞台：${title}${tags ? "｜我的标签：" + tags : ""}`;
  const msgInput = document.getElementById("userMsg");
  const msgBoard = document.querySelector("#messageBoard");
  if(!msgInput || !msgBoard) {
    alert("请先回到首页留言广场使用分享功能");
    return;
  }
  msgInput.value = content;
  msgBoard.scrollIntoView();
}

// 私信存储
function getChatList(){
  return JSON.parse(localStorage.getItem("mixChat")) || [];
}
function sendChat(targetName, text){
  const chats = getChatList();
  chats.push({to:targetName, content:text, time:new Date().toLocaleString()});
  localStorage.setItem("mixChat", JSON.stringify(chats));
  alert("私信发送成功！");
}

function closeTagModal(){
  document.getElementById("tagModal").style.display = "none";
}