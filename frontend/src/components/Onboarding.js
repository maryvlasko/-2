import React, { useState } from 'react';
import './Onboarding.css';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate

function Onboarding() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate(); // Инициализируем navigate для переходов

    const slides = [
        {
            title: 'Никогда не забывайте, что хотите купить',
            text: 'Быстро и просто создавайте списки покупок, покупайте только то, что вам действительно нужно.',
        },
        {
            text: 'Делитесь списками с другими пользователями. Вы и ваши друзья можете отслеживать изменения в реальном времени. Будьте всегда в курсе дел!',
        },
        {
            text: 'Заранее спланированные покупки уменьшают шанс на импульсивные покупки.',
        },
    ];

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            setCurrentSlide((prev) => prev - 1);
        }
    };

    const handleStart = () => {
        // Переход на вторую страницу
        navigate('/shopping-lists'); // Замените на правильный путь для второй страницы
    };

    return (
        <div className="onboarding">
            <div className="navigation">
                {currentSlide > 0 && (
                    <button onClick={handlePrev} className="arrow left-arrow">
                        <img src="/left-arrow.png" alt="previous" />
                    </button>
                )}
                <img src="/avocado.png" alt="avocado" className="avocado-image" />
                {currentSlide < slides.length - 1 && (
                    <button onClick={handleNext} className="arrow right-arrow">
                        <img src="/right-arrow.png" alt="next" />
                    </button>
                )}
            </div>
            <h1 className="slide-title">{slides[currentSlide].title}</h1>
            <p className="description">{slides[currentSlide].text}</p>
            <div className="indicator">
                {slides.map((_, index) => (
                    <img
                        key={index}
                        src="/ellipse.png"
                        alt="indicator"
                        className={`dot ${currentSlide === index ? 'active' : ''}`}
                    />
                ))}
            </div>
            <button className="start-button" onClick={handleStart}>Начать</button>
        </div>
    );
}

export default Onboarding;
