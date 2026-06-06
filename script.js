document.addEventListener("DOMContentLoaded", () => {
    // Находим все элементы, которые нужно анимировать
    const counters = document.querySelectorAll('.counter-value');
    
    // Настройки анимации (чем больше цифра, тем медленнее)
    const speed = 100; 

    // Создаем наблюдатель за скроллом
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Если блок появился в зоне видимости
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target'); // Получаем финальную цифру
                
                const updateCount = () => {
                    const count = +counter.innerText.replace(/\D/g, ''); // Текущее значение
                    const inc = target / speed; // Шаг прибавления

                    if (count < target) {
                        // Округляем, добавляем пробелы между тысячами и записываем
                        counter.innerText = Math.ceil(count + inc).toLocaleString('ru-RU');
                        // Вызываем функцию снова через 20 миллисекунд
                        setTimeout(updateCount, 20);
                    } else {
                        // Финальный аккорд, чтобы цифра была точной
                        counter.innerText = target.toLocaleString('ru-RU');
                    }
                };
                
                updateCount(); // Запускаем анимацию
                observer.unobserve(counter); // Отключаем слежку, чтобы анимация сработала только 1 раз
            }
        });
    }, { threshold: 0.5 }); // Анимация начнется, когда блок появится на экране наполовину

    // Вешаем наблюдатель на каждый счетчик
    counters.forEach(counter => {
        observer.observe(counter);
    });
});
// === Выделение активного пункта меню при скролле (Scrollspy) ===
    const sections = document.querySelectorAll("section[id], header[id]");
    const navLinks = document.querySelectorAll(".nav-links a");

    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -60% 0px', // Триггер срабатывает, когда секция доходит до верхней трети экрана
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Убираем класс active у всех ссылок
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    // Добавляем класс active нужной ссылке
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
    // === Управление звуком в видео "Как это работает" ===
    const mechVideo = document.getElementById('mech-video');
    const muteToggle = document.getElementById('mute-toggle');
    const muteIcon = document.getElementById('mute-icon');

    if(muteToggle && mechVideo) {
        // Заранее подготовленные пути для двух состояний иконки
        const pathMuted = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>`;
        const pathUnmuted = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;

        muteToggle.addEventListener('click', () => {
            if (mechVideo.muted) {
                // Включаем звук
                mechVideo.muted = false;
                muteIcon.innerHTML = pathUnmuted;
                muteToggle.classList.add('is-unmuted');
            } else {
                // Выключаем звук
                mechVideo.muted = true;
                muteIcon.innerHTML = pathMuted;
                muteToggle.classList.remove('is-unmuted');
            }
        });
    }
// === Воспроизведение YouTube видео по клику (Блок Обучение) ===
    const eduVideoWrapper = document.getElementById('edu-video-wrapper');
    
    if (eduVideoWrapper) {
        eduVideoWrapper.addEventListener('click', function() {
            if (!this.querySelector('iframe')) {
                this.innerHTML = `<iframe width="100%" height="100%" style="position: absolute; top: 0; left: 0; border: none;" src="https://www.youtube.com/embed/XShhB1SxT0k?autoplay=1" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                
                // Добавляем класс, чтобы убрать CSS-оверлей и открыть доступ к плееру
                this.classList.add('is-playing');
            }
        });
    }
    // === Бутерброд-меню для мобильных ===
    const hamburger = document.getElementById('hamburger');
    const navLinksMenu = document.getElementById('nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinksMenu.classList.toggle('active-menu');
            hamburger.classList.toggle('toggle');
        });

        // Закрываем меню при клике на любую ссылку
        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinksMenu.classList.remove('active-menu');
                hamburger.classList.remove('toggle');
            });
        });
    }
    // === Плавающие кнопки (Sticky CTA) для мобильных ===
    const stickyCta = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero-section');

    if (stickyCta && heroSection) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Если первый экран (hero) скрылся из виду — показываем кнопки
                if (!entry.isIntersecting) {
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 }); // Срабатывает, когда от hero остается 10%

        ctaObserver.observe(heroSection);
    }
    // === Плавное появление элементов при скролле (МНОГОРАЗОВОЕ) ===
    const fadeElements = document.querySelectorAll('.fade-up');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Если блок появился на экране — показываем
                entry.target.classList.add('is-visible');
            } else {
                // Если блок ушел с экрана — прячем обратно (чтобы потом снова показать)
                entry.target.classList.remove('is-visible');
            }
        });
    }, { rootMargin: '0px 0px -50px 0px' }); 

    fadeElements.forEach(el => fadeObserver.observe(el));