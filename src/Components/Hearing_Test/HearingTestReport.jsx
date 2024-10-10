import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';
import { Typography, Box, Card, CardContent, Grid, CardMedia, Button, LinearProgress, Tooltip, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import assets from '../../../public/assets/assets';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const AnimatedCircularProgressbar = ({ value }) => {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
        let animationFrame;
        const animate = () => {
            setAnimatedValue(prev => {
                const newValue = prev + (value - prev) * 0.1;
                if (Math.abs(newValue - value) < 0.1) {
                    return value;
                }
                animationFrame = requestAnimationFrame(animate);
                return newValue;
            });
        };
        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [value]);

    return (
        <CircularProgressbar
            value={animatedValue}
            text={`${Math.round(animatedValue)}`}
            styles={buildStyles({
                textSize: '35px',
                pathTransitionDuration: 1.5,
                pathColor: '#3E98C7',
                textColor: '#3E98C7',
                trailColor: '#d6d6d6',
            })}
        />
    );
};

const HearingCriteria = ({ score }) => {
    const criteria = [
        { range: "90-100", label: "Excellent Hearing", color: "#4CAF50" },
        { range: "80-89", label: "Good Hearing", color: "#8BC34A" },
        { range: "70-79", label: "Moderate Hearing", color: "#CDDC39" },
        { range: "60-69", label: "Mild Hearing Loss", color: "#FFEB3B" },
        { range: "50-59", label: "Moderate Hearing Loss", color: "#FFC107" },
        { range: "40-49", label: "Moderately Severe Hearing Loss", color: "#FF9800" },
        { range: "30-39", label: "Severe Hearing Loss", color: "#FF5722" },
        { range: "20-29", label: "Profound Hearing Loss", color: "#F44336" }
    ];

    return (
        <Card sx={{ mt: 2, height: '100%' }}>
            <CardContent>
                <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 'bold', mb: 2 }}>Hearing Assessment Criteria</Typography>
                {criteria.map((criterion, index) => (
                    <motion.div
                        key={criterion.range}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ fontFamily: 'Poppins', width: '60px', fontSize: '0.8rem' }}>{criterion.range}</Typography>
                            <Box sx={{ flexGrow: 1, mr: 1, width: '60px' }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={score >= parseInt(criterion.range.split('-')[0]) ? 100 : 0}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: 'lightgrey',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 4,
                                            backgroundColor: criterion.color,
                                        }
                                    }}
                                />
                            </Box>
                            <Typography sx={{ fontFamily: 'Poppins', fontSize: '0.8rem', width: '180px' }}>{criterion.label}</Typography>
                        </Box>
                    </motion.div>
                ))}
            </CardContent>
        </Card>
    );
};

const RecommendedProducts = ({ products }) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 2000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        pauseOnHover: true,
    };

    return (
        <Card sx={{ mt: 2, height: '100%' }}>
            <CardContent>
                <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 'bold', mb: 2 }}>Recommended Products</Typography>
                <Slider {...settings}>
                    {products.map((product) => (
                        <div key={product.id}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={product.image}
                                alt={product.name}
                            />
                            <Typography gutterBottom variant="h6" component="div" sx={{ fontFamily: 'Poppins', fontWeight: 'semibold', mt: 1 }}>
                                {product.name}
                            </Typography>
                            <Button variant="contained" color="primary" sx={{ fontFamily: 'Poppins', fontWeight: 'semibold', mt: 1 }}>
                                View Details
                            </Button>
                        </div>
                    ))}
                </Slider>
            </CardContent>
        </Card>
    );
};

const HearingTestReport = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/hearing-test/report');
                setReport(response.data);
            } catch (error) {
                console.error('Error fetching report:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, []);

    const getHearingAssessment = (score) => {
        const adjustedScore = Math.max(20, score);
        if (adjustedScore >= 90) return "Excellent Hearing";
        if (adjustedScore >= 80) return "Good Hearing";
        if (adjustedScore >= 70) return "Moderate Hearing";
        if (adjustedScore >= 60) return "Mild Hearing Loss";
        if (adjustedScore >= 50) return "Moderate Hearing Loss";
        if (adjustedScore >= 40) return "Moderately Severe Hearing Loss";
        if (adjustedScore >= 30) return "Severe Hearing Loss";
        return "Profound Hearing Loss - Immediate Consultation Required";
    };

    const handleDownloadPDF = () => {
        const input = document.getElementById('hearing-test-report');
        const inputWidth = input.offsetWidth;
        const inputHeight = input.offsetHeight;

        html2canvas(input, {
            logging: false,
            useCORS: true,
            width: inputWidth,
            height: inputHeight,
            scale: 2, // Increase scale for better quality
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`${report.name}_hearing_test_report.pdf`);
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h4">Calculating Your Test Results. Please Wait...</Typography>
            </Box>
        );
    }

    if (!report) {
        return <Typography variant="h4">No report available</Typography>;
    }

    const adjustedScore = Math.max(20, report.hearing_score);
    const hearingAssessment = getHearingAssessment(adjustedScore);

    const recommendedProducts = [
        { id: 1, name: "Phonak Audéo", image: assets.product_1 },
        { id: 2, name: "Phonak Naída", image: assets.product_2 },
        { id: 3, name: "Phonak Sky", image: assets.product_3 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
           
            <Box p={2} sx={{ maxWidth: '830px', margin: '0 auto', position: 'relative' }} id="hearing-test-report">
                <Grid container spacing={2}>
                    <Grid item xs={12} container alignItems="center" justifyContent="space-between">
                        <Grid item xs={12} sm={4}>
                            <img src={assets.logo} alt="Aural Hearing Care Logo" style={{ height: 50, maxWidth: '100%' }} />
                        </Grid>
                        <Grid item xs={12} sm={4} textAlign="center">
                            <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 'bold' }}>Hearing Test Results</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} container justifyContent="flex-end" alignItems="center">
                            <Box width={100} height={100}>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <div style={{ fontFamily: 'Outfit', fontWeight: 'bold', width: '100%', height: '100%' }}>
                                        <AnimatedCircularProgressbar value={adjustedScore} />
                                    </div>
                                    <Typography variant="subtitle2" align="center" sx={{ fontFamily: 'Poppins', fontWeight: 'semibold', mt: 1, mb: 2, whiteSpace: 'nowrap' }}>
                                        Hearing Score
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} mt={3}>
                        <Card sx={{ backgroundColor: '#afcc1c', height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 'bold', color: 'white' }}>Personal Information</Typography>
                                <hr className="mt-1 mb-2 border-t-2 border-dotted border-white w-full" />
                                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 'semibold', color: 'white' }}>Name: {report.name}</Typography>
                                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 'semibold', color: 'white' }}>Age: {report.age}</Typography>
                                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 'semibold', color: 'white' }}>Hearing Status: {report.hearing_status}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} mt={3}>
                        <Card sx={{ backgroundColor: '#04adf0', height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 'bold', color: 'white' }}>Threshold Levels</Typography>
                                <hr className="mt-1 mb-2 border-t-2 border-dotted border-white w-full" />
                                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 'semibold', color: 'white' }}>Right Ear Threshold: {report.right_ear_threshold} dB</Typography>
                                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 'semibold', color: 'white' }}>Left Ear Threshold: {report.left_ear_threshold} dB</Typography>
                                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 'semibold', color: 'white' }}>Right Ear Loudest: {report.right_ear_loudest} dB</Typography>
                                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 'semibold', color: 'white' }}>Left Ear Loudest: {report.left_ear_loudest} dB</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 'bold' }}>Test Result</Typography>
                                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 'semibold' }}>{hearingAssessment}</Typography>
                                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 'semibold', mt: 2 }}>{report.recommendation}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ height: '310px' }}>
                            <HearingCriteria score={adjustedScore} />
                            {/* <Typography sx={{ fontFamily: 'Poppins', fontWeight: 'semibold', mt: 2 }}>{report.recommendation}</Typography> */}
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 'semibold', mt: 2, fontSize: '14px' }}>
                               This is a computer-generated hearing test. Please click on    the button below to schedule an appointment at your  nearest Aural Hearing Care Clinic.
                            </Typography>
                            <Box display="flex" justifyContent="space-between">
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    sx={{ mt: 2, fontFamily: 'Poppins', fontWeight: 'semibold' }}
                                >
                                    Schedule Appointment
                                </Button>
                                <Button onClick={handleDownloadPDF} 
                                    variant="contained" 
                                    color="primary" 
                                    sx={{ mt: 2, fontFamily: 'Poppins', fontWeight: 'semibold' }}
                                >
                                    Download Report
                                </Button>
                            </Box>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 'semibold', mt: 2, fontSize: '14px' }}>
                               <Typography sx={{ fontFamily: 'Poppins', fontWeight: 'bold', color: '#afcc1c' }}>Aural Hearing Care</Typography>
                               <Typography sx={{ fontFamily: 'Poppins', color: 'black', fontSize: '14px' }}>Shop no: 6, Pushpkunj Complex, beside YES BANK, near Hotel Centre Point, Ramdaspeth, Nagpur, Maharashtra 440010</Typography>
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <RecommendedProducts products={recommendedProducts} />
                    </Grid>
                </Grid>
            </Box>
        </motion.div>
    );
};

export default HearingTestReport;