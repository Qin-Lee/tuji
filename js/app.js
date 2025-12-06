/**
 * 途迹 TravelPath - 智能旅游攻略平台
 * 主应用脚本
 * 使用高德地图API
 */

// ========================================
// API 配置
// ========================================
const CONFIG = {
    // 高德地图 API
    AMAP_KEY: 'fec014039ba8dc133f5f6d989bb448e0',
    AMAP_WEATHER_URL: 'https://restapi.amap.com/v3/weather/weatherInfo',
    
    // 城市编码映射（高德adcode）
    CITY_CODES: {
        '北京': '110000',
        '上海': '310000',
        '广州': '440100',
        '深圳': '440300',
        '杭州': '330100',
        '成都': '510100',
        '西安': '610100',
        '南京': '320100',
        '武汉': '420100',
        '重庆': '500000',
        '苏州': '320500',
        '厦门': '350200',
        '青岛': '370200',
        '大连': '210200',
        '三亚': '460200',
        '丽江': '530700',
        '桂林': '450300',
        '张家界': '430800'
    },
    
    // 城市坐标映射（用于定位匹配）
    CITY_COORDS: {
        '北京': { lat: 39.9042, lon: 116.4074 },
        '上海': { lat: 31.2304, lon: 121.4737 },
        '广州': { lat: 23.1291, lon: 113.2644 },
        '深圳': { lat: 22.5431, lon: 114.0579 },
        '杭州': { lat: 30.2741, lon: 120.1551 },
        '成都': { lat: 30.5728, lon: 104.0668 },
        '西安': { lat: 34.3416, lon: 108.9398 },
        '南京': { lat: 32.0603, lon: 118.7969 },
        '武汉': { lat: 30.5928, lon: 114.3055 },
        '重庆': { lat: 29.4316, lon: 106.9123 },
        '苏州': { lat: 31.2990, lon: 120.5853 },
        '厦门': { lat: 24.4798, lon: 118.0894 },
        '青岛': { lat: 36.0671, lon: 120.3826 },
        '大连': { lat: 38.9140, lon: 121.6147 },
        '三亚': { lat: 18.2528, lon: 109.5119 },
        '丽江': { lat: 26.8721, lon: 100.2299 },
        '桂林': { lat: 25.2740, lon: 110.2990 },
        '张家界': { lat: 29.1170, lon: 110.4793 }
    },
    
    // 景点数据
    ATTRACTIONS: {
        '北京': [
            { name: '故宫博物院', desc: '世界上现存规模最大、保存最为完整的木质结构古建筑之一', rating: 4.9, tags: ['历史文化', '世界遗产'], image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&q=80' },
            { name: '长城·八达岭', desc: '不到长城非好汉，中国古代伟大的防御工程', rating: 4.8, tags: ['世界遗产', '户外'], image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&q=80' },
            { name: '颐和园', desc: '中国现存规模最大、保存最完整的皇家园林', rating: 4.7, tags: ['皇家园林', '世界遗产'], image: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=600&q=80' },
            { name: '天坛公园', desc: '明清两代帝王祭祀皇天、祈五谷丰登之场所', rating: 4.6, tags: ['历史文化', '公园'], image: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=600&q=80' }
        ],
        '上海': [
            { name: '外滩', desc: '上海的标志性景观，感受东西方文化的完美融合', rating: 4.8, tags: ['城市风光', '夜景'], image: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=600&q=80' },
            { name: '东方明珠', desc: '上海地标性建筑，360度俯瞰魔都全景', rating: 4.5, tags: ['地标', '观光'], image: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=600&q=80' },
            { name: '豫园', desc: '江南古典园林的代表，感受老上海的风情', rating: 4.6, tags: ['园林', '美食'], image: 'https://images.unsplash.com/photo-1577086664693-894d8c895bca?w=600&q=80' },
            { name: '迪士尼乐园', desc: '亚洲最大的迪士尼主题乐园，梦幻童话世界', rating: 4.7, tags: ['主题乐园', '亲子'], image: 'https://images.unsplash.com/photo-1597466599360-3b9775841aec?w=600&q=80' }
        ],
        '杭州': [
            { name: '西湖', desc: '欲把西湖比西子，淡妆浓抹总相宜', rating: 4.9, tags: ['世界遗产', '自然风光'], image: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=600&q=80' },
            { name: '灵隐寺', desc: '江南著名古刹，感受禅宗文化的魅力', rating: 4.7, tags: ['佛教文化', '古迹'], image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80' },
            { name: '西溪湿地', desc: '城市中的天然湿地，感受自然野趣', rating: 4.5, tags: ['湿地', '自然'], image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80' },
            { name: '宋城', desc: '穿越千年，体验宋朝繁华盛世', rating: 4.6, tags: ['主题乐园', '演艺'], image: 'https://images.unsplash.com/photo-1513415564515-763d91423bdd?w=600&q=80' }
        ],
        '成都': [
            { name: '大熊猫繁育研究基地', desc: '近距离接触国宝大熊猫，萌化你的心', rating: 4.9, tags: ['动物园', '亲子'], image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&q=80' },
            { name: '宽窄巷子', desc: '成都最具代表性的历史文化街区', rating: 4.6, tags: ['历史街区', '美食'], image: 'https://images.unsplash.com/photo-1598887142487-3c854d51eabb?w=600&q=80' },
            { name: '锦里古街', desc: '西蜀历史上最古老的商业街区之一', rating: 4.5, tags: ['古街', '小吃'], image: 'https://images.unsplash.com/photo-1544085701-4d54e9f41c45?w=600&q=80' },
            { name: '都江堰', desc: '世界水利文化的鼻祖，两千年仍在运转', rating: 4.8, tags: ['世界遗产', '水利工程'], image: 'https://images.unsplash.com/photo-1569431059531-00cfb7e0c1ac?w=600&q=80' }
        ],
        '西安': [
            { name: '兵马俑', desc: '世界第八大奇迹，震撼人心的地下军团', rating: 4.9, tags: ['世界遗产', '考古'], image: 'https://images.unsplash.com/photo-1529921879218-a1cfa3b86d0d?w=600&q=80' },
            { name: '大雁塔', desc: '唐代高僧玄奘译经之地，西安地标', rating: 4.7, tags: ['佛塔', '历史'], image: 'https://images.unsplash.com/photo-1536722203615-229e0bf38e25?w=600&q=80' },
            { name: '回民街', desc: '西安美食聚集地，品尝正宗西北风味', rating: 4.5, tags: ['美食街', '小吃'], image: 'https://images.unsplash.com/photo-1568819317551-31051b37f69f?w=600&q=80' },
            { name: '华清宫', desc: '唐明皇与杨贵妃的爱情圣地', rating: 4.6, tags: ['历史', '温泉'], image: 'https://images.unsplash.com/photo-1566159196870-b57dc45f6f82?w=600&q=80' }
        ],
        '三亚': [
            { name: '亚龙湾', desc: '天下第一湾，中国最美的热带海滨', rating: 4.8, tags: ['海滩', '度假'], image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80' },
            { name: '天涯海角', desc: '海南标志性景点，浪漫的天涯情缘', rating: 4.5, tags: ['海景', '浪漫'], image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80' },
            { name: '蜈支洲岛', desc: '中国的马尔代夫，潜水天堂', rating: 4.7, tags: ['海岛', '潜水'], image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80' },
            { name: '南山文化旅游区', desc: '海上观音，佛教文化圣地', rating: 4.6, tags: ['佛教', '文化'], image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80' }
        ],
        '厦门': [
            { name: '鼓浪屿', desc: '海上花园，文艺小清新的天堂', rating: 4.8, tags: ['海岛', '文艺'], image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&q=80' },
            { name: '厦门大学', desc: '中国最美大学之一，海边的学术殿堂', rating: 4.6, tags: ['校园', '建筑'], image: 'https://images.unsplash.com/photo-1580974928064-f0aaef70895a?w=600&q=80' },
            { name: '环岛路', desc: '最美海滨公路，骑行的绝佳选择', rating: 4.5, tags: ['骑行', '海景'], image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80' },
            { name: '中山路步行街', desc: '厦门最繁华的商业街，吃喝玩乐一条龙', rating: 4.4, tags: ['购物', '美食'], image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&q=80' }
        ],
        '丽江': [
            { name: '丽江古城', desc: '世界文化遗产，纳西族千年古镇', rating: 4.7, tags: ['古城', '世界遗产'], image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80' },
            { name: '玉龙雪山', desc: '北半球最南的大雪山，纳西族的神山', rating: 4.8, tags: ['雪山', '自然'], image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80' },
            { name: '泸沽湖', desc: '高原明珠，神秘的女儿国', rating: 4.9, tags: ['湖泊', '民俗'], image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&q=80' },
            { name: '束河古镇', desc: '比大研古镇更安静的纳西村落', rating: 4.5, tags: ['古镇', '休闲'], image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80' }
        ]
    },
    
    // 旅行计划模板
    TRAVEL_PLANS: {
        '北京': {
            title: '北京3日精华游',
            days: [
                { time: '第一天 上午', title: '故宫深度游', desc: '从午门进入，沿中轴线游览三大殿，建议请导游讲解' },
                { time: '第一天 下午', title: '景山公园 → 北海公园', desc: '登景山俯瞰故宫全景，然后漫步北海公园' },
                { time: '第一天 晚上', title: '王府井美食街', desc: '品尝北京小吃，逛逛王府井商业街' },
                { time: '第二天 全天', title: '长城一日游', desc: '建议选择慕田峪或八达岭，早出发避开人流' },
                { time: '第三天 上午', title: '颐和园', desc: '皇家园林精华，乘船游昆明湖' },
                { time: '第三天 下午', title: '天坛公园', desc: '感受古代皇帝祭天的庄严氛围' }
            ]
        },
        '上海': {
            title: '上海2日都市游',
            days: [
                { time: '第一天 上午', title: '豫园 + 城隍庙', desc: '感受老上海风情，品尝南翔小笼包' },
                { time: '第一天 下午', title: '外滩 → 南京路', desc: '欣赏万国建筑博览，漫步南京路步行街' },
                { time: '第一天 晚上', title: '外滩夜景', desc: '观赏浦江两岸灯火璀璨的夜景' },
                { time: '第二天 上午', title: '陆家嘴', desc: '登东方明珠或上海中心，俯瞰魔都' },
                { time: '第二天 下午', title: '田子坊或新天地', desc: '探索上海的文艺腔调和时尚氛围' }
            ]
        },
        '杭州': {
            title: '杭州2日诗画游',
            days: [
                { time: '第一天 上午', title: '西湖环湖游', desc: '断桥残雪→白堤→孤山→苏堤，骑行或步行' },
                { time: '第一天 下午', title: '雷峰塔 + 西湖游船', desc: '登塔俯瞰西湖，乘船游三潭印月' },
                { time: '第一天 晚上', title: '河坊街', desc: '品尝杭帮菜，逛逛清河坊历史街区' },
                { time: '第二天 上午', title: '灵隐寺', desc: '千年古刹，感受禅意' },
                { time: '第二天 下午', title: '龙井村', desc: '品一杯正宗西湖龙井茶' }
            ]
        },
        '成都': {
            title: '成都3日慢生活游',
            days: [
                { time: '第一天 上午', title: '大熊猫基地', desc: '早起看熊猫最活跃，建议7:30入园' },
                { time: '第一天 下午', title: '宽窄巷子', desc: '感受成都的悠闲生活，喝盖碗茶' },
                { time: '第一天 晚上', title: '锦里古街', desc: '品尝各种成都小吃' },
                { time: '第二天 全天', title: '都江堰 + 青城山', desc: '世界水利奇迹，问道青城山' },
                { time: '第三天 上午', title: '人民公园', desc: '和本地人一起喝茶、掏耳朵' },
                { time: '第三天 下午', title: '春熙路 + 太古里', desc: '时尚购物，打卡IFS熊猫' }
            ]
        },
        '三亚': {
            title: '三亚4日度假游',
            days: [
                { time: '第一天', title: '亚龙湾休闲', desc: '入住酒店后，在亚龙湾沙滩放松' },
                { time: '第二天 全天', title: '蜈支洲岛', desc: '潜水、摩托艇等海上项目' },
                { time: '第三天 上午', title: '南山文化旅游区', desc: '参观南海观音，祈福许愿' },
                { time: '第三天 下午', title: '天涯海角', desc: '打卡经典地标，看日落' },
                { time: '第四天', title: '酒店休闲', desc: '享受酒店设施，睡到自然醒' }
            ]
        },
        '西安': {
            title: '西安3日古都游',
            days: [
                { time: '第一天 上午', title: '兵马俑', desc: '世界第八大奇迹，建议请讲解员' },
                { time: '第一天 下午', title: '华清宫', desc: '参观温泉遗址，了解唐玄宗与杨贵妃的故事' },
                { time: '第一天 晚上', title: '回民街', desc: '品尝西安美食：肉夹馍、羊肉泡馍、biangbiang面' },
                { time: '第二天 上午', title: '古城墙', desc: '租自行车环城骑行，俯瞰古城' },
                { time: '第二天 下午', title: '大雁塔', desc: '参观大慈恩寺，欣赏音乐喷泉' },
                { time: '第三天', title: '陕西历史博物馆', desc: '了解十三朝古都的辉煌历史' }
            ]
        }
    }
};

// ========================================
// 全局状态
// ========================================
let currentCity = '';
let currentCoords = null;
let reviews = JSON.parse(localStorage.getItem('travelReviews') || '[]');

// ========================================
// DOM 元素
// ========================================
const DOM = {
    // 光标
    cursorDot: document.querySelector('.cursor-dot'),
    cursorOutline: document.querySelector('.cursor-outline'),
    
    // 轮播图
    carousel: document.querySelector('.carousel'),
    carouselSlides: document.querySelectorAll('.carousel-slide'),
    carouselPrev: document.querySelector('.carousel-btn.prev'),
    carouselNext: document.querySelector('.carousel-btn.next'),
    carouselDots: document.querySelector('.carousel-dots'),
    
    // 位置搜索
    autoLocateBtn: document.getElementById('autoLocate'),
    cityInput: document.getElementById('cityInput'),
    searchBtn: document.getElementById('searchBtn'),
    currentLocation: document.getElementById('currentLocation'),
    
    // 天气
    weatherCard: document.getElementById('weatherCard'),
    weatherIcon: document.getElementById('weatherIcon'),
    tempValue: document.getElementById('tempValue'),
    weatherDesc: document.getElementById('weatherDesc'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    feelsLike: document.getElementById('feelsLike'),
    visibility: document.getElementById('visibility'),
    clothingAdvice: document.getElementById('clothingAdvice'),
    forecastCards: document.getElementById('forecastCards'),
    
    // 景点
    attractionsGrid: document.getElementById('attractionsGrid'),
    
    // 旅行计划
    planCard: document.getElementById('planCard'),
    
    // 游记
    reviewForm: document.getElementById('reviewForm'),
    reviewsList: document.getElementById('reviewsList'),
    starRating: document.getElementById('starRating'),
    
    // 订阅
    subscribeForm: document.getElementById('subscribeForm'),
    
    // Toast
    toastContainer: document.getElementById('toastContainer')
};

// ========================================
// 自定义光标
// ========================================
function initCustomCursor() {
    if (window.innerWidth <= 768) return; // 移动端不启用
    
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let outlineX = 0, outlineY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // 使用 requestAnimationFrame 实现平滑跟随
    function animate() {
        // 点光标 - 快速跟随
        dotX += (mouseX - dotX) * 0.5;
        dotY += (mouseY - dotY) * 0.5;
        DOM.cursorDot.style.left = dotX + 'px';
        DOM.cursorDot.style.top = dotY + 'px';
        
        // 圆环光标 - 缓慢跟随
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        DOM.cursorOutline.style.left = outlineX + 'px';
        DOM.cursorOutline.style.top = outlineY + 'px';
        
        requestAnimationFrame(animate);
    }
    animate();
    
    // 悬停效果
    const hoverElements = document.querySelectorAll('a, button, input, select, textarea, .carousel-slide, .news-card, .attraction-card, .review-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            DOM.cursorOutline.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            DOM.cursorOutline.classList.remove('hover');
        });
    });
    
    // 点击效果
    document.addEventListener('mousedown', () => {
        DOM.cursorOutline.classList.add('click');
    });
    document.addEventListener('mouseup', () => {
        DOM.cursorOutline.classList.remove('click');
    });
}

// ========================================
// 轮播图
// ========================================
function initCarousel() {
    let currentSlide = 0;
    const totalSlides = DOM.carouselSlides.length;
    let autoPlayInterval;
    
    // 创建指示器点
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        DOM.carouselDots.appendChild(dot);
    }
    
    const dots = DOM.carouselDots.querySelectorAll('.carousel-dot');
    
    function goToSlide(index) {
        DOM.carouselSlides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = (index + totalSlides) % totalSlides;
        
        DOM.carouselSlides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // 按钮事件
    DOM.carouselNext.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });
    
    DOM.carouselPrev.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });
    
    // 自动播放
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }
    
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }
    
    startAutoPlay();
    
    // 鼠标悬停暂停
    DOM.carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    DOM.carousel.addEventListener('mouseleave', startAutoPlay);
}

// ========================================
// 导航栏滚动效果
// ========================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // 城市下拉菜单点击
    document.querySelectorAll('.dropdown-menu a, .footer-links a[data-city]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const city = link.dataset.city;
            if (city) {
                DOM.cityInput.value = city;
                searchCity(city);
            }
        });
    });
}

// ========================================
// 位置获取
// ========================================
function initLocation() {
    // 自动定位按钮
    DOM.autoLocateBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            showToast('您的浏览器不支持地理定位功能', 'error');
            return;
        }
        
        const locationText = DOM.currentLocation.querySelector('.location-text');
        const spinner = DOM.currentLocation.querySelector('.loading-spinner');
        
        spinner.style.display = 'inline-block';
        locationText.textContent = '正在获取位置...';
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                currentCoords = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                
                // 反向地理编码获取城市名
                try {
                    const city = await reverseGeocode(currentCoords.lat, currentCoords.lon);
                    locationText.textContent = `📍 当前位置: ${city}`;
                    DOM.cityInput.value = city;
                    currentCity = city;
                    
                    // 加载该城市的信息
                    loadCityData(city);
                    showToast(`已定位到: ${city}`, 'success');
                } catch (error) {
                    // 使用坐标匹配最近城市
                    const city = findNearestCity(currentCoords.lat, currentCoords.lon);
                    locationText.textContent = `📍 当前位置: ${city}`;
                    DOM.cityInput.value = city;
                    currentCity = city;
                    loadCityData(city);
                    showToast(`已定位到: ${city}`, 'success');
                }
                
                spinner.style.display = 'none';
            },
            (error) => {
                spinner.style.display = 'none';
                let message = '定位失败';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        message = '您已拒绝位置授权，请手动输入城市';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = '位置信息不可用';
                        break;
                    case error.TIMEOUT:
                        message = '定位超时，请重试';
                        break;
                }
                locationText.textContent = message;
                showToast(message, 'error');
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    });
    
    // 搜索按钮
    DOM.searchBtn.addEventListener('click', () => {
        const city = DOM.cityInput.value.trim();
        if (city) {
            searchCity(city);
        } else {
            showToast('请输入城市名称', 'info');
        }
    });
    
    // 回车搜索
    DOM.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = DOM.cityInput.value.trim();
            if (city) {
                searchCity(city);
            }
        }
    });
}

// 查找最近的城市
function findNearestCity(lat, lon) {
    let nearestCity = '北京';
    let minDistance = Infinity;
    
    for (const [city, coords] of Object.entries(CONFIG.CITY_COORDS)) {
        const distance = Math.sqrt(
            Math.pow(lat - coords.lat, 2) + Math.pow(lon - coords.lon, 2)
        );
        if (distance < minDistance) {
            minDistance = distance;
            nearestCity = city;
        }
    }
    
    return nearestCity;
}

// 使用高德API进行逆地理编码
async function reverseGeocode(lat, lon) {
    try {
        const response = await fetch(
            `https://restapi.amap.com/v3/geocode/regeo?key=${CONFIG.AMAP_KEY}&location=${lon},${lat}&extensions=base`
        );
        const data = await response.json();
        
        if (data.status === '1' && data.regeocode) {
            const city = data.regeocode.addressComponent.city;
            // 去掉"市"字
            return city.replace('市', '');
        }
    } catch (error) {
        console.error('逆地理编码失败:', error);
    }
    
    // 失败时使用坐标匹配
    return findNearestCity(lat, lon);
}

// 搜索城市
function searchCity(city) {
    // 处理带"市"字的城市名
    const normalizedCity = city.replace('市', '');
    
    // 检查是否支持该城市
    if (CONFIG.CITY_CODES[normalizedCity]) {
        currentCity = normalizedCity;
        loadCityData(normalizedCity);
        
        // 更新位置显示
        const locationText = DOM.currentLocation.querySelector('.location-text');
        locationText.textContent = `📍 已选择: ${normalizedCity}`;
        
        showToast(`正在加载 ${normalizedCity} 的旅游信息...`, 'info');
        
        // 滚动到天气区域
        setTimeout(() => {
            document.getElementById('weather').scrollIntoView({ behavior: 'smooth' });
        }, 500);
    } else {
        showToast(`暂不支持 "${city}"，请选择其他城市`, 'error');
    }
}

// ========================================
// 加载城市数据
// ========================================
function loadCityData(city) {
    loadWeatherByCity(city);
    loadAttractions(city);
    loadTravelPlan(city);
}

// ========================================
// 天气模块 - 使用高德API
// ========================================
async function loadWeatherByCity(city) {
    const weatherLoading = DOM.weatherCard.querySelector('.weather-loading');
    const weatherContent = DOM.weatherCard.querySelector('.weather-content');
    
    weatherLoading.style.display = 'block';
    weatherContent.style.display = 'none';
    
    const cityCode = CONFIG.CITY_CODES[city];
    if (!cityCode) {
        showToast('无法获取该城市的天气信息', 'error');
        return;
    }
    
    try {
        // 获取实时天气
        const liveResponse = await fetch(
            `${CONFIG.AMAP_WEATHER_URL}?city=${cityCode}&key=${CONFIG.AMAP_KEY}&extensions=base`
        );
        const liveData = await liveResponse.json();
        
        // 获取天气预报
        const forecastResponse = await fetch(
            `${CONFIG.AMAP_WEATHER_URL}?city=${cityCode}&key=${CONFIG.AMAP_KEY}&extensions=all`
        );
        const forecastData = await forecastResponse.json();
        
        if (liveData.status === '1' && liveData.lives && liveData.lives.length > 0) {
            displayWeatherAmap(liveData.lives[0]);
        }
        
        if (forecastData.status === '1' && forecastData.forecasts && forecastData.forecasts.length > 0) {
            displayForecastAmap(forecastData.forecasts[0].casts);
        }
        
        weatherLoading.style.display = 'none';
        weatherContent.style.display = 'grid';
        
    } catch (error) {
        console.error('获取天气失败:', error);
        showToast('获取天气信息失败，请稍后重试', 'error');
        weatherLoading.style.display = 'none';
    }
}

// 显示高德天气数据
function displayWeatherAmap(data) {
    const temp = parseInt(data.temperature);
    const humidity = data.humidity;
    const weather = data.weather;
    const windDirection = data.winddirection;
    const windPower = data.windpower;
    
    // 获取天气图标
    const weatherIcon = getWeatherIconAmap(weather);
    
    DOM.weatherIcon.textContent = weatherIcon;
    DOM.tempValue.textContent = temp;
    DOM.weatherDesc.textContent = weather;
    DOM.humidity.textContent = humidity + '%';
    DOM.windSpeed.textContent = windDirection + '风 ' + windPower + '级';
    DOM.feelsLike.textContent = temp + '°C'; // 高德API没有体感温度，使用实际温度
    DOM.visibility.textContent = '--'; // 高德基础API没有能见度
    
    // 穿衣建议
    DOM.clothingAdvice.textContent = getClothingAdvice(temp, weather);
}

// 获取高德天气图标
function getWeatherIconAmap(weather) {
    const iconMap = {
        '晴': '☀️',
        '多云': '⛅',
        '阴': '☁️',
        '小雨': '🌧️',
        '中雨': '🌧️',
        '大雨': '🌧️',
        '暴雨': '⛈️',
        '雷阵雨': '⛈️',
        '阵雨': '🌦️',
        '小雪': '🌨️',
        '中雪': '🌨️',
        '大雪': '❄️',
        '暴雪': '❄️',
        '雨夹雪': '🌨️',
        '雾': '🌫️',
        '霾': '🌫️',
        '扬沙': '🌪️',
        '沙尘暴': '🌪️',
        '浮尘': '🌫️'
    };
    
    // 模糊匹配
    for (const [key, icon] of Object.entries(iconMap)) {
        if (weather.includes(key)) {
            return icon;
        }
    }
    
    return '🌤️'; // 默认图标
}

// 穿衣建议
function getClothingAdvice(temp, weather) {
    let advice = '';
    
    if (temp <= 5) {
        advice = '天气寒冷，建议穿羽绒服、厚毛衣、保暖内衣，戴帽子和手套，注意防寒保暖。';
    } else if (temp <= 10) {
        advice = '天气较冷，建议穿厚外套、毛衣、加绒裤，可以带一条围巾。';
    } else if (temp <= 15) {
        advice = '天气凉爽，建议穿夹克、针织衫、长裤，早晚温差大请备一件外套。';
    } else if (temp <= 20) {
        advice = '天气舒适，建议穿长袖T恤、薄外套、休闲裤，适合户外活动。';
    } else if (temp <= 25) {
        advice = '天气温暖，建议穿短袖、薄长裤或裙子，外出可带一件薄外套。';
    } else if (temp <= 30) {
        advice = '天气炎热，建议穿短袖、短裤、凉鞋，注意防晒补水。';
    } else {
        advice = '天气酷热，建议穿透气轻薄的衣物，做好防暑降温措施，避免长时间户外活动。';
    }
    
    // 根据天气状况补充建议
    if (weather.includes('雨')) {
        advice += ' 🌂 记得带伞，穿防水的鞋子。';
    } else if (weather.includes('雪')) {
        advice += ' ❄️ 注意防滑，穿保暖防水的靴子。';
    } else if (weather.includes('风') || weather.includes('沙')) {
        advice += ' 💨 风大，注意防风，可戴口罩和帽子。';
    } else if (weather.includes('雾') || weather.includes('霾')) {
        advice += ' 😷 空气质量较差，建议戴口罩，减少户外活动。';
    }
    
    return advice;
}

// 显示高德天气预报
function displayForecastAmap(casts) {
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    
    DOM.forecastCards.innerHTML = casts.map((cast, index) => {
        const date = new Date(cast.date);
        const dayName = index === 0 ? '今天' : weekDays[date.getDay()];
        const icon = getWeatherIconAmap(cast.dayweather);
        const high = cast.daytemp;
        const low = cast.nighttemp;
        
        return `
            <div class="forecast-card">
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-icon">${icon}</div>
                <div class="forecast-temp">
                    <span class="high">${high}°</span>
                    <span class="low">${low}°</span>
                </div>
                <div class="forecast-desc">${cast.dayweather}</div>
            </div>
        `;
    }).join('');
}

// ========================================
// 景点推荐
// ========================================
function loadAttractions(city) {
    const attractions = CONFIG.ATTRACTIONS[city];
    
    if (!attractions) {
        DOM.attractionsGrid.innerHTML = `
            <div class="attraction-placeholder">
                <p>🔍 暂无 "${city}" 的景点数据，敬请期待更多城市上线</p>
            </div>
        `;
        return;
    }
    
    DOM.attractionsGrid.innerHTML = attractions.map(attr => `
        <div class="attraction-card">
            <div class="attraction-image" style="background-image: url('${attr.image}')">
                <div class="attraction-rating">
                    <span class="stars">★</span> ${attr.rating}
                </div>
            </div>
            <div class="attraction-content">
                <h3>${attr.name}</h3>
                <p>${attr.desc}</p>
                <div class="attraction-tags">
                    ${attr.tags.map(tag => `<span class="attraction-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// ========================================
// 旅行计划
// ========================================
function loadTravelPlan(city) {
    const plan = CONFIG.TRAVEL_PLANS[city];
    const placeholder = DOM.planCard.querySelector('.plan-placeholder');
    let planContent = DOM.planCard.querySelector('.plan-content');
    
    if (!plan) {
        placeholder.style.display = 'block';
        if (planContent) planContent.style.display = 'none';
        return;
    }
    
    placeholder.style.display = 'none';
    
    if (!planContent) {
        planContent = document.createElement('div');
        planContent.className = 'plan-content';
        DOM.planCard.appendChild(planContent);
    }
    
    planContent.innerHTML = `
        <div class="plan-header">
            <h3>${plan.title}</h3>
            <p>根据当地特色为您精心规划的行程安排</p>
        </div>
        <div class="plan-timeline">
            ${plan.days.map(item => `
                <div class="plan-item">
                    <div class="plan-item-time">${item.time}</div>
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                </div>
            `).join('')}
        </div>
    `;
    
    planContent.style.display = 'block';
}

// ========================================
// 游记评论
// ========================================
function initReviews() {
    // 星级评分
    const stars = DOM.starRating.querySelectorAll('.star');
    let currentRating = 5;
    
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            currentRating = index + 1;
            document.getElementById('reviewRating').value = currentRating;
            updateStars(stars, currentRating);
        });
        
        star.addEventListener('mouseenter', () => {
            updateStars(stars, index + 1);
        });
    });
    
    DOM.starRating.addEventListener('mouseleave', () => {
        updateStars(stars, currentRating);
    });
    
    // 初始化显示
    updateStars(stars, currentRating);
    
    // 提交游记
    DOM.reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('reviewerName').value.trim();
        const destination = document.getElementById('reviewDestination').value;
        const rating = document.getElementById('reviewRating').value;
        const content = document.getElementById('reviewContent').value.trim();
        
        if (!name || !destination || !content) {
            showToast('请填写完整信息', 'error');
            return;
        }
        
        const review = {
            id: Date.now(),
            name,
            destination,
            rating: parseInt(rating),
            content,
            date: new Date().toISOString().split('T')[0],
            likes: 0,
            comments: 0
        };
        
        // 保存到本地存储
        reviews.unshift(review);
        localStorage.setItem('travelReviews', JSON.stringify(reviews));
        
        // 添加到列表
        addReviewToList(review, true);
        
        // 重置表单
        DOM.reviewForm.reset();
        currentRating = 5;
        updateStars(stars, currentRating);
        
        showToast('游记发布成功！感谢您的分享 🎉', 'success');
    });
    
    // 加载已有游记
    loadReviews();
}

function updateStars(stars, rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function loadReviews() {
    reviews.forEach(review => addReviewToList(review, false));
}

function addReviewToList(review, prepend = false) {
    const avatars = ['👤', '🧑‍🎨', '👩‍💼', '🧑‍🚀', '👨‍🍳', '👩‍🎤', '🧑‍💻', '👨‍🎓'];
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];
    
    const reviewHTML = `
        <div class="review-card" data-id="${review.id}">
            <div class="review-header">
                <div class="reviewer-avatar">${avatar}</div>
                <div class="reviewer-info">
                    <span class="reviewer-name">${escapeHtml(review.name)}</span>
                    <span class="review-location">📍 ${review.destination}</span>
                </div>
                <div class="review-rating">
                    <span class="stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                </div>
            </div>
            <div class="review-body">
                <p>${escapeHtml(review.content)}</p>
            </div>
            <div class="review-footer">
                <span class="review-date">${review.date}</span>
                <div class="review-actions">
                    <button class="btn-like" onclick="likeReview(${review.id})">
                        <span>❤️</span> ${review.likes}
                    </button>
                    <button class="btn-comment">
                        <span>💬</span> ${review.comments}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    if (prepend) {
        DOM.reviewsList.insertAdjacentHTML('afterbegin', reviewHTML);
    } else {
        DOM.reviewsList.insertAdjacentHTML('beforeend', reviewHTML);
    }
}

// 点赞功能
window.likeReview = function(id) {
    const review = reviews.find(r => r.id === id);
    if (review) {
        review.likes++;
        localStorage.setItem('travelReviews', JSON.stringify(reviews));
        
        const card = document.querySelector(`.review-card[data-id="${id}"]`);
        const likeBtn = card.querySelector('.btn-like');
        likeBtn.innerHTML = `<span>❤️</span> ${review.likes}`;
        
        showToast('点赞成功 ❤️', 'success');
    }
};

// HTML 转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// 订阅功能
// ========================================
function initSubscribe() {
    DOM.subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const phone = document.getElementById('phoneNumber').value.trim();
        
        if (!phone || phone.length !== 11) {
            showToast('请输入有效的11位手机号码', 'error');
            return;
        }
        
        // 获取订阅选项
        const options = [];
        DOM.subscribeForm.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            options.push(checkbox.parentElement.textContent.trim());
        });
        
        // 模拟订阅
        console.log('订阅信息:', { phone, options });
        
        showToast(`订阅成功！我们将发送 ${options.join('、')} 到您的手机`, 'success');
        
        // 重置表单
        document.getElementById('phoneNumber').value = '';
    });
    
    // 导航栏订阅按钮
    document.getElementById('subscribeBtn').addEventListener('click', () => {
        document.getElementById('subscribe').scrollIntoView({ behavior: 'smooth' });
    });
}

// ========================================
// Toast 通知
// ========================================
function showToast(message, type = 'info') {
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    DOM.toastContainer.appendChild(toast);
    
    // 自动消失
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ========================================
// 初始化
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initCarousel();
    initNavbar();
    initLocation();
    initReviews();
    initSubscribe();
    
    console.log('🚀 途迹 TravelPath 已加载完成！');
    console.log('🗺️ 使用高德地图API提供天气服务');
});
