import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SplitText from "./SplitText";
import sillaImg from "../../../images/silla.jpg";
import "../../styles/components/common/HeroSlider.css";

export default function HeroSlider() {
    const navigate = useNavigate();
    
    const slides = [
        { 
            image: sillaImg, 
            text: "Bienvenido a K´abé",
            subtitle: "Renta todo lo que necesitas para tu evento perfecto"
        },
        { 
            image: sillaImg, 
            text: "Ofertas Especiales",
            subtitle: "Descuentos increíbles en paquetes completos"
        },
        { 
            image: sillaImg, 
            text: "Calidad Garantizada",
            subtitle: "Los mejores productos para eventos únicos"
        },
    ];

    const handleVerPaquetes = () => {
        navigate('/paquetes');
    };

    const handleCotizarAhora = () => {
        const contactSection = document.getElementById('contact-section');
        if (contactSection) {
            contactSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // Variantes de animación para Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2,
            }
        }
    };

    const itemVariants = {
        hidden: { 
            opacity: 0, 
            y: 20 
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

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
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="hero-slide-overlay" />
                            <motion.div 
                                className="hero-slide-content"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <motion.h1 
                                    variants={itemVariants}
                                    className="hero-slide-title"
                                >
                                    {slide.text}
                                </motion.h1>
                                
                                <motion.p 
                                    variants={itemVariants}
                                    className="hero-slide-subtitle"
                                >
                                    {slide.subtitle}
                                </motion.p>
                                
                                <motion.div 
                                    variants={itemVariants}
                                    className="hero-slide-actions"
                                >
                                    <motion.button 
                                        className="hero-btn primary"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleVerPaquetes}
                                    >
                                        Ver Paquetes
                                    </motion.button>
                                    <motion.button 
                                        className="hero-btn secondary"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleCotizarAhora}
                                    >
                                        Cotizar Ahora
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}