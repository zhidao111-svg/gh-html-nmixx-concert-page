        // ===== 六首歌数据（配好图片路径） =====
const trackData = {
    1: {
        title: 'Run For Roses',
        subtitle: ' ₩ 0 + 1 drop',
        info: [
            ['Volume', '50 mL'],
            ['State', 'Liquid · 室温保存'],
            ['Effect', '注入后自动奔向舞台，持续 3:30'],
            ['Delivery', 'Free if you say "Run!" 🏃'],
            ['Return', 'No returns — keep running'],
            ['Payment', 'smile only']
        ],
        img: 'images/0083znWegy1i87ccvegsoj33y83y84qr.jpg',
        watchLink: 'https://youtu.be/你的链接1'
    },
    2: {
        title: 'Sonar',
        subtitle: ' ₩ 0 + 1 pulse',
        info: [
            ['Volume', '50 mL'],
            ['State', 'Gas · 避光保存'],
            ['Effect', '发出 20Hz~20kHz 信号，锁定你心里那个人'],
            ['Delivery', 'Free if you say "Sonar!" 📡'],
            ['Return', 'No returns — signal sent'],
            ['Payment', 'smile only']
        ],
        img: 'images/006YIJCWly1hzdvh4jt3cj30u00u0wi0.jpg',
        watchLink: 'https://youtu.be/你的链接2'
    },
    3: {
        title: 'Beat Beat',
        subtitle: ' ₩ 0 + 1 beat',
        info: [
            ['Volume', '50 mL'],
            ['State', 'Liquid · 摇匀后使用'],
            ['Effect', '加速心跳至 BPM 128，不可逆'],
            ['Delivery', 'Free if you say "Beat!" 🥁'],
            ['Return', 'No returns — rhythm started'],
            ['Payment', 'smile only']
        ],
        img: 'images/006YIJCWgy1hx3dg3bb2aj30u00u00zy.jpg',
        watchLink: 'https://youtu.be/你的链接3'
    },
    4: {
        title: 'Plot Twist',
        subtitle: ' ₩ 0 + 1 twist',
        info: [
            ['Volume', '50 mL'],
            ['State', 'Liquid · 静置后分层'],
            ['Effect', '静置 5 秒后出现意想不到的沉淀物'],
            ['Delivery', 'Free if you say "Twist!" 🌀'],
            ['Return', 'No returns — embrace the twist'],
            ['Payment', 'smile only']
        ],
        img: 'images/006YIJCWgy1hx3dg2srhbj30u00u0q6i.jpg',
        watchLink: 'https://youtu.be/你的链接4'
    },
    5: {
        title: 'Love Me Like This',
        subtitle: ' ₩ 0 + 1 hug',
        info: [
            ['Volume', '50 mL'],
            ['State', 'Liquid · 避光保存'],
            ['Effect', '接触后产生强烈 “想被爱” 的错觉'],
            ['Delivery', 'Free if you say "Love!" 💕'],
            ['Return', 'No returns — love is forever'],
            ['Payment', 'smile only']
        ],
        img: 'images/006YIJCWgy1hx3dg2fxmwj30u00u0jue.jpg',
        watchLink: 'https://youtu.be/你的链接5'
    },
    6: {
        title: 'Young Dumb Stupid',
        subtitle: ' ₩ 0 + 1 smile',
        info: [
            ['Volume', '50 mL'],
            ['State', 'Gas · 易挥发'],
            ['Effect', '吸入后智商暂时归零，效果持续 3 分钟'],
            ['Delivery', 'Free if you say "Stupid!" 😜'],
            ['Return', 'No returns — youth doesn\'t come back'],
            ['Payment', 'smile only']
        ],
        img: 'images/006YIJCWgy1hx3dg1myq8j30u00u0n0d.jpg',
        watchLink: 'https://youtu.be/你的链接6'
    }
};

        // ===== 获取 URL 参数 =====
        const urlParams = new URLSearchParams(window.location.search);
        const trackId = urlParams.get('track') || '1';

        // ===== 渲染数据 =====
        const data = trackData[trackId] || trackData[1];

        // 设置图片、标题、副标题、按钮链接
        document.getElementById('productImage').src = data.img;
        document.getElementById('productTitle').textContent = data.title;
        document.getElementById('productSub').textContent = data.subtitle;
        document.getElementById('watchBtn').href = data.watchLink;

        // 渲染 info grid
        const infoContainer = document.getElementById('productInfo');
        infoContainer.innerHTML = '';
        data.info.forEach(row => {
            const label = document.createElement('span');
            label.className = 'label';
            label.textContent = row[0];
            const value = document.createElement('span');
            value.className = 'value';
            value.innerHTML = row[1];
            infoContainer.appendChild(label);
            infoContainer.appendChild(value);
        });
