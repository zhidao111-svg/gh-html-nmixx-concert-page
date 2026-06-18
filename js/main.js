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

        // 使用 Intersection Observer 滚动监听
        if ('IntersectionObserver' in window) {
            const observerOptions = {
            threshold: 0.3
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            // ✅ 用 data-section 匹配
                            if (link.getAttribute('data-section') === entry.target.getAttribute('id')) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            }, observerOptions);

            sections.forEach(section => observer.observe(section));
        } else {
            // 降级方案：传统滚动监听
            window.addEventListener('scroll', updateActiveLink, { passive: true });
        }

        function updateActiveLink() {
            const scrollY = window.scrollY;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollY >= sectionTop - 200 && scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    // ✅ 用 data-section 匹配
                    document.querySelector(`a[data-section="${section.getAttribute('id')}"]`)?.classList.add('active');
                }
            });
        }
    })();

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

// ===== 启动 =====
initCards();
