import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import assets from '../../../public/assets/assets';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const HearingTestReport = ({ report }) => {
    const consolidatedScore = Math.round(
        (report.speech_recognition_score * 0.4) + (report.hearing_score * 0.6)
    );

    const handleDownload = async () => {
        try {
            const reportElement = document.getElementById('report-content');
            
            const productsSection = reportElement.querySelector('#recommended-products');
            if (productsSection) {
                productsSection.style.display = 'none';
            }

            const canvas = await html2canvas(reportElement, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                windowWidth: reportElement.scrollWidth,
                windowHeight: reportElement.scrollHeight,
                onclone: (clonedDoc) => {
                    const clonedElement = clonedDoc.getElementById('report-content');
                    if (clonedElement) {
                        clonedElement.style.padding = '40px';
                        const gridElements = clonedElement.querySelectorAll('.grid');
                        gridElements.forEach(grid => {
                            grid.style.display = 'flex';
                            grid.style.flexDirection = 'column';
                            grid.style.gap = '20px';
                        });
                    }
                }
            });

            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            pdf.addImage(
                canvas.toDataURL('image/png'),
                'PNG',
                0,
                0,
                imgWidth,
                imgHeight,
                '',
                'FAST'
            );

            pdf.save(`hearing_test_report_${report.name}.pdf`);

            if (productsSection) {
                productsSection.style.display = 'block';
            }

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        }
    };

    const hearingCriteria = [
        { range: '90-100', label: 'Excellent Hearing' },
        { range: '80-89', label: 'Good Hearing' },
        { range: '70-79', label: 'Moderate Hearing' },
        { range: '60-69', label: 'Mild Hearing Loss' },
        { range: '50-59', label: 'Moderate Hearing Loss' },
        { range: '40-49', label: 'Moderately Severe Hearing Loss' },
        { range: '30-39', label: 'Severe Hearing Loss' },
        { range: '20-29', label: 'Profound Hearing Loss' }
    ];

    const pdfStyles = `
        @media print {
            #recommended-products {
                display: none !important;
            }
            .pdf-hide {
                display: none !important;
            }
        }
    `;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[900px] bg-white p-8 pb-10 rounded-lg shadow-lg relative"
        >
            <style>{pdfStyles}</style>
            <IconButton 
                onClick={handleDownload}
                sx={{ 
                    position: 'absolute',
                    right: '32px',
                    top: '10px',
                    color: '#04adf0',
                    '@media print': { display: 'none' }
                }}
            >
                <FileDownloadIcon fontSize="large" />
            </IconButton>

            <div id="report-content" className="bg-white">
                <div className="flex items-center justify-between mb-12 mt-10">
                    <img src={assets.logo} alt="Aural Hearing Care" className="w-72" />
                    <div className="text-center">
                        <div className="w-24 h-24 rounded-full border-[6px] border-auralblue flex items-center justify-center">
                            <Typography variant="h3" sx={{ fontFamily: 'Outfit', color: '#04adf0' }}>
                                {consolidatedScore}
                            </Typography>
                        </div>
                        <Typography variant="subtitle2" sx={{ fontFamily: 'Poppins', mt: 1 }}>
                            Hearing Score
                        </Typography>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-auralyellow p-6 rounded-lg">
                        <Typography variant="h6" sx={{ fontFamily: 'Outfit', color: 'white', mb: 2 }}>
                            Personal Information
                        </Typography>
                        <hr className="border-white border-dotted border-2 mb-4" />
                        <div className="space-y-2">
                            <Typography sx={{ fontFamily: 'Poppins', color: 'white' }}>
                                Name: {report.name}
                            </Typography>
                            <Typography sx={{ fontFamily: 'Poppins', color: 'white' }}>
                                Age: {report.age}
                            </Typography>
                            <Typography sx={{ fontFamily: 'Poppins', color: 'white' }}>
                                Hearing Status: {report.hearing_status}
                            </Typography>
                        </div>
                    </div>

                    <div className="bg-auralblue p-6 rounded-lg">
                        <Typography variant="h6" sx={{ fontFamily: 'Outfit', color: 'white', mb: 2 }}>
                            Threshold Levels
                        </Typography>
                        <hr className="border-white border-dotted border-2 mb-4" />
                        <div className="space-y-2">
                            <Typography sx={{ fontFamily: 'Poppins', color: 'white' }}>
                                Left Ear Threshold: {report.avg_threshold} dB
                            </Typography>
                            <Typography sx={{ fontFamily: 'Poppins', color: 'white' }}>
                                Right Ear Threshold: {report.avg_threshold} dB
                            </Typography>
                            <Typography sx={{ fontFamily: 'Poppins', color: 'white' }}>
                                Left Ear Loudest: {report.avg_dynamic_range} dB
                            </Typography>
                            <Typography sx={{ fontFamily: 'Poppins', color: 'white' }}>
                                Right Ear Loudest: {report.avg_dynamic_range} dB
                            </Typography>
                        </div>
                    </div>
                </div>

                 <div className="mb-8">
                    <Typography variant="h5" sx={{ fontFamily: 'Outfit', mb: 1, fontWeight: 'bold' }}>
                        Test Result
                    </Typography>
                    <Typography sx={{ fontFamily: 'Poppins', color: '#ef4444' }}>
                        {report.hearing_status} - {report.recommendation}
                    </Typography>
                </div>


                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                        <Typography variant="h6" sx={{ fontFamily: 'Outfit', mb: 3 }}>
                            Hearing Assessment Criteria
                        </Typography>
                        {hearingCriteria.map((criteria, index) => (
                            <div key={index} className="flex items-center gap-4 mb-3">
                                <span className="w-16 text-sm">{criteria.range}</span>
                                <div className="flex-1 h-2 bg-gray-200 rounded">
                                    <div
                                        className="h-full rounded bg-auralblue"
                                        style={{
                                            width: `${consolidatedScore >= parseInt(criteria.range) ? '100%' : '0%'}`
                                        }}
                                    />
                                </div>
                                <span className="w-40 text-sm">{criteria.label}</span>
                            </div>
                        ))}
                    </div>

                    <div id="recommended-products" className="pdf-hide">
                        <Typography variant="h6" sx={{ fontFamily: 'Outfit', mb: 3 }}>
                            Recommended Products
                        </Typography>
                        <div className="flex flex-col items-center">
                            <img 
                                src={assets.product_1} 
                                alt="Phonak Sky"
                                className="w-48 h-48 object-contain mb-4"
                            />
                            <Typography 
                                variant="subtitle1" 
                                sx={{ fontFamily: 'Poppins', fontWeight: 'medium', mb: 2 }}
                            >
                                Phonak Sky
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#04adf0',
                                    fontFamily: 'Poppins',
                                    '&:hover': { backgroundColor: '#0398d3' }
                                }}
                            >
                                VIEW DETAILS
                            </Button>
                        </div>
                    </div>
                </div>

               
                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        backgroundColor: '#04adf0',
                        fontFamily: 'Poppins',
                        mt: 4,
                        '&:hover': { backgroundColor: '#0398d3' }
                    }}
                >
                    SCHEDULE APPOINTMENT
                </Button>
            </div>
        </motion.div>
    );
};

export default HearingTestReport;
