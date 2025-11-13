import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import SplitText from "./SplitText";
import sillaImg from "../../../images/silla.jpg";
import "../../styles/components/common/HeroSlider.css";

export default function HeroSlider() {
    const slides = [
        { image: sillaImg, text: "Bienvenido a K´abé" },
        { image: sillaImg, text: "Ofertas Especiales" },
        { image: sillaImg, text: "Calidad Garantizada" },
    ];

    return (
        <div className="hero-slider-container">
            <Swiper
                modules={[Pagination, Autoplay]}
                loop={true}
                autoplay={{ delay: 4000 }}
                pagination={{ clickable: true }}
                className="hero-swiper"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <motion.div
                                className="hero-slide-bg"
                                style={{
                                    backgroundImage: `url(${slide.image})`,
                                    backgroundColor: "#222",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat"
                                }}
                                                        >
                            <div className="hero-slide-overlay" />
                            <div className="hero-slide-content">
                                <SplitText
                                    text={slide.text}
                                    className="hero-slide-title"
                                />
                            </div>
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}